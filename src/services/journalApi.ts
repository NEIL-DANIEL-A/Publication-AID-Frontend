import { supabaseDb } from '../lib/supabaseDb';
import type {
  JournalWithRelations,
  PipelineRun,
  JournalChange,
  SkippedRecord,
} from '../types/journal';

const PAGE_SIZE = 24;

export interface JournalFilters {
  search?: string;
  scopus_status?: string;
  mjl_index?: string;
  quartile?: string;
  publisher?: string;
  country?: string;
  min_sjr?: number;
  max_sjr?: number;
  min_h_index?: number;
  max_h_index?: number;
  has_apc?: boolean;
  without_apc?: boolean;
  sort?: string;
  page?: number;
}

export interface PaginatedJournals {
  data: JournalWithRelations[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchJournals(filters: JournalFilters = {}): Promise<PaginatedJournals> {
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const mjlVals = filters.mjl_index ? filters.mjl_index.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const hasNotMjl = mjlVals.includes('Not MJL Indexed');
  const hasRealMjl = mjlVals.some((v) => v !== 'Not MJL Indexed');
  const hasMjlFilter = !!filters.mjl_index;
  const hasApcFilter = !!filters.has_apc;
  const hasWithoutApcFilter = !!filters.without_apc;

  const select = [
    'cfr_results(*)',
    'scopus_results!inner(*)',
    hasMjlFilter ? 'mjl_results!inner(*)' : 'mjl_results(*)',
    'scimago_results!inner(*)',
    hasApcFilter ? 'apc_results!inner(*)' : 'apc_results(*)',
  ].join(', ');

  let query = supabaseDb
    .from('journals')
    .select(`*, ${select}`, { count: 'exact' });

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,print_issn.ilike.%${filters.search}%,e_issn.ilike.%${filters.search}%`);
  }

  // Exclude journals where pipeline skipped data collection
  query = query.not('scimago_results.sjr', 'is', null).not('scimago_results.sjr', 'ilike', '%skipped%');

  // Without APC needs client-side filtering (PostgREST left-join is-null doesn't work reliably)
  // Handle it after the main query via separate logic
  const needsWithoutApcClientFilter = hasWithoutApcFilter;

  if (filters.scopus_status) {
    const vals = filters.scopus_status.split(',').map((s) => s.trim()).filter(Boolean);
    if (vals.length === 1) {
      query = query.eq('scopus_results.scopus_status', vals[0]);
    } else if (vals.length > 1) {
      query = query.in('scopus_results.scopus_status', vals);
    }
  }

  if (filters.mjl_index) {
    if (hasNotMjl && hasRealMjl) {
      const realVals = mjlVals.filter((v) => v !== 'Not MJL Indexed');
      const parts = [...realVals.map((v) => `mjl_index.ilike.%${v}%`), 'mjl_index.is.null', 'mjl_index.eq."no data"'];
      query = query.or(parts.join(','), { foreignTable: 'mjl_results' } as never);
    } else if (hasNotMjl) {
      query = query.or('mjl_index.is.null,mjl_index.eq."no data"', { foreignTable: 'mjl_results' } as never);
    } else if (mjlVals.length === 1) {
      query = query.ilike('mjl_results.mjl_index', `%${mjlVals[0]}%`);
    } else if (mjlVals.length > 1) {
      query = query.or(mjlVals.map((v) => `mjl_index.ilike.%${v}%`).join(','), { foreignTable: 'mjl_results' } as never);
    }
  }

  if (filters.quartile) {
    const vals = filters.quartile.split(',').map((s) => s.trim()).filter(Boolean);
    if (vals.length === 1) {
      query = query.eq('scimago_results.quartile', vals[0]);
    } else if (vals.length > 1) {
      query = query.in('scimago_results.quartile', vals);
    }
  }

  if (filters.publisher) {
    const pubs = filters.publisher.split(',').map((s) => s.trim()).filter(Boolean);
    const hasElsevierGroup = pubs.includes('ELSEVIER_GROUP');
    const otherPubs = pubs.filter((p) => p !== 'ELSEVIER_GROUP');
    if (hasElsevierGroup && otherPubs.length === 0) {
      query = query.ilike('publisher', '%ELSEVIER%');
    } else if (hasElsevierGroup) {
      const parts: string[] = ['publisher.ilike.%ELSEVIER%'];
      if (otherPubs.length === 1) parts.push(`publisher.eq."${otherPubs[0].replace(/"/g, '\\"')}"`);
      else if (otherPubs.length > 1) {
        const quoted = otherPubs.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(',');
        parts.push(`publisher.in.(${quoted})`);
      }
      query = query.or(parts.join(','));
    } else if (pubs.length === 1) {
      query = query.eq('publisher', pubs[0]);
    } else if (pubs.length > 1) {
      query = query.in('publisher', pubs);
    }
  }

  if (filters.country) {
    const vals = filters.country.split(',').map((s) => s.trim()).filter(Boolean);
    if (vals.length === 1) {
      query = query.ilike('country', `%${vals[0]}%`);
    } else if (vals.length > 1) {
      query = query.or(vals.map((c) => `country.ilike.%${c}%`).join(','));
    }
  }

  if (filters.min_sjr && filters.min_sjr > 0) {
    query = query.gte('scimago_results.sjr', String(filters.min_sjr));
  }
  if (filters.max_sjr && filters.max_sjr > 0) {
    query = query.lte('scimago_results.sjr', String(filters.max_sjr));
  }

  if (filters.min_h_index && filters.min_h_index > 0) {
    query = query.gte('scimago_results.h_index', String(filters.min_h_index));
  }
  if (filters.max_h_index && filters.max_h_index > 0) {
    query = query.lte('scimago_results.h_index', String(filters.max_h_index));
  }

  const sortCol = filters.sort === 'title_asc' || filters.sort === 'title_desc' ? 'title' : 'title';
  const ascending = filters.sort !== 'title_desc';
  query = query.order(sortCol, { ascending });

  // Without APC needs client-side filtering (PostgREST left-join is-null is unreliable)
  if (needsWithoutApcClientFilter) {
    const all: JournalWithRelations[] = [];
    let offset = 0;
    const size = 1000;
    while (true) {
      const { data: chunk, error: chunkErr } = await query.range(offset, offset + size - 1);
      if (chunkErr) throw new Error(chunkErr.message);
      if (!chunk || chunk.length === 0) break;
      all.push(...(chunk as unknown as JournalWithRelations[]));
      if (chunk.length < size) break;
      offset += size;
      if (offset > 20000) break;
    }
    const filtered = all.filter((j) => !j.apc_results || j.apc_results.length === 0);
    const total = filtered.length;
    const paginated = filtered.slice(from, to + 1);
    return { data: paginated, total, page, limit: PAGE_SIZE };
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('[JournalAPI] fetchJournals error:', error);
    throw new Error(error.message);
  }

  return {
    data: (data ?? []) as unknown as JournalWithRelations[],
    total: count ?? 0,
    page,
    limit: PAGE_SIZE,
  };
}

export async function fetchJournalById(id: string): Promise<JournalWithRelations | null> {
  const { data, error } = await supabaseDb
    .from('journals')
    .select('*, cfr_results(*), scopus_results(*), mjl_results(*), scimago_results(*), apc_results(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[JournalAPI] fetchJournalById error:', error);
    return null;
  }

  return data as JournalWithRelations;
}

export async function fetchLatestPipelineRun(): Promise<PipelineRun | null> {
  const { data, error } = await supabaseDb
    .from('pipeline_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[JournalAPI] fetchLatestPipelineRun error:', error);
    return null;
  }

  if (!data) return null;
  const run = data as PipelineRun;
  // Enrich with real skipped count from skipped_records (column duplicate_skipped was removed in new schema)
  const { count } = await supabaseDb
    .from('skipped_records')
    .select('id', { count: 'exact', head: true })
    .eq('pipeline_run_id', run.id);
  return { ...run, skipped_count: count ?? run.duplicate_skipped ?? 0 };
}

export async function fetchJournalChanges(journalId: string): Promise<JournalChange[]> {
  const { data, error } = await supabaseDb
    .from('journal_changes')
    .select('*')
    .eq('journal_id', journalId)
    .order('changed_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[JournalAPI] fetchJournalChanges error:', error);
    return [];
  }

  return (data ?? []) as JournalChange[];
}

export async function fetchSkippedRecords(pipelineRunId: string): Promise<SkippedRecord[]> {
  const { data, error } = await supabaseDb
    .from('skipped_records')
    .select('*')
    .eq('pipeline_run_id', pipelineRunId)
    .order('skipped_at', { ascending: false });

  if (error) {
    console.error('[JournalAPI] fetchSkippedRecords error:', error);
    return [];
  }

  return (data ?? []) as SkippedRecord[];
}

export interface RecentChange extends JournalChange {
  journal_title: string | null;
}

export async function fetchRecentChanges(limit = 20): Promise<RecentChange[]> {
  const { data, error } = await supabaseDb
    .from('journal_changes')
    .select('*')
    .neq('field_name', 'data_hash')
    .order('changed_at', { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    if (error) console.error('[JournalAPI] fetchRecentChanges error:', error);
    return [];
  }

  const changes = data as JournalChange[];
  const ids = [...new Set(changes.map((c) => c.journal_id))];
  const { data: journals } = await supabaseDb
    .from('journals')
    .select('id, title')
    .in('id', ids);

  const titleMap = new Map<string, string>();
  (journals ?? []).forEach((j: { id: string; title: string }) => titleMap.set(j.id, j.title));

  return changes.map((c) => ({
    ...c,
    journal_title: titleMap.get(c.journal_id) ?? null,
  }));
}

export async function fetchAllPipelineRuns(page = 1, limit = 10): Promise<{ data: PipelineRun[]; total: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count, error } = await supabaseDb
    .from('pipeline_runs')
    .select('*', { count: 'exact' })
    .order('started_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[JournalAPI] fetchAllPipelineRuns error:', error);
    return { data: [], total: 0 };
  }
  const runs = (data ?? []) as PipelineRun[];
  if (runs.length > 0) {
    const ids = runs.map((r) => r.id);
    const { data: skipped } = await supabaseDb
      .from('skipped_records')
      .select('pipeline_run_id')
      .in('pipeline_run_id', ids);
    const counts = new Map<string, number>();
    (skipped ?? []).forEach((s: { pipeline_run_id: string | null }) => {
      if (!s.pipeline_run_id) return;
      counts.set(s.pipeline_run_id, (counts.get(s.pipeline_run_id) ?? 0) + 1);
    });
    runs.forEach((r) => {
      r.skipped_count = counts.get(r.id) ?? r.duplicate_skipped ?? 0;
    });
  }
  return { data: runs, total: count ?? 0 };
}

export async function fetchAllChanges(
  page = 1,
  limit = 20,
  opts: { onlyApc?: boolean; hideHash?: boolean; field?: string; pipelineRunId?: string } = {}
): Promise<{ data: RecentChange[]; total: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let apcIds: Set<string> | null = null;
  if (opts.onlyApc) {
    const ids = await fetchAll<{ journal_id: string }>('apc_results', 'journal_id');
    apcIds = new Set(ids.map((r) => r.journal_id));
    if (apcIds.size === 0) return { data: [], total: 0 };
  }

  // Build base query with server-side filters where possible
  let query = supabaseDb
    .from('journal_changes')
    .select('*', { count: 'exact' })
    .order('changed_at', { ascending: false });

  if (opts.hideHash) query = query.neq('field_name', 'data_hash');
  if (opts.field) query = query.eq('field_name', opts.field);
  if (opts.pipelineRunId) query = query.eq('pipeline_run_id', opts.pipelineRunId);

  if (opts.onlyApc && apcIds) {
    const { data: all, error } = await supabaseDb
      .from('journal_changes')
      .select('*')
      .order('changed_at', { ascending: false });
    if (error || !all) return { data: [], total: 0 };
    let filtered = all as JournalChange[];
    if (opts.hideHash) filtered = filtered.filter((c) => c.field_name !== 'data_hash');
    if (opts.field) filtered = filtered.filter((c) => c.field_name === opts.field);
    if (opts.pipelineRunId) filtered = filtered.filter((c) => c.pipeline_run_id === opts.pipelineRunId);
    filtered = filtered.filter((c) => apcIds!.has(c.journal_id));
    const total = filtered.length;
    const pageData = filtered.slice(from, to + 1);
    const ids = [...new Set(pageData.map((c) => c.journal_id))];
    if (ids.length === 0) return { data: [], total };
    const { data: journals } = await supabaseDb.from('journals').select('id, title').in('id', ids);
    const titleMap = new Map<string, string>();
    (journals ?? []).forEach((j: { id: string; title: string }) => titleMap.set(j.id, j.title));
    return { data: pageData.map((c) => ({ ...c, journal_title: titleMap.get(c.journal_id) ?? null })), total };
  }

  const { data, count, error } = await query.range(from, to);

  if (error || !data || data.length === 0) {
    if (error) console.error('[JournalAPI] fetchAllChanges error:', error);
    return { data: [], total: 0 };
  }

  const changes = data as JournalChange[];
  const ids = [...new Set(changes.map((c) => c.journal_id))];
  const { data: journals } = await supabaseDb
    .from('journals')
    .select('id, title')
    .in('id', ids);

  const titleMap = new Map<string, string>();
  (journals ?? []).forEach((j: { id: string; title: string }) => titleMap.set(j.id, j.title));

  return {
    data: changes.map((c) => ({ ...c, journal_title: titleMap.get(c.journal_id) ?? null })),
    total: count ?? 0,
  };
}

export async function fetchChangeFields(): Promise<string[]> {
  const rows = await fetchAll<{ field_name: string }>('journal_changes', 'field_name');
  return [...new Set(rows.map((r) => r.field_name))].sort();
}

async function fetchAll<T>(table: string, column: string): Promise<T[]> {
  const all: T[] = [];
  let from = 0;
  const size = 1000;
  while (true) {
    const { data, error } = await supabaseDb.from(table).select(column).range(from, from + size - 1);
    if (error || !data || data.length === 0) break;
    all.push(...(data as T[]));
    if (data.length < size) break;
    from += size;
  }
  return all;
}

export async function fetchJournalCounts(): Promise<{
  scopusStatuses: Record<string, number>;
  mjlIndexes: Record<string, number>;
  quartiles: Record<string, number>;
  countries: string[];
  publishers: string[];
}> {
  const [scopusData, mjlData, scimagoData, countryData, publisherData] = await Promise.all([
    fetchAll<{ scopus_status: string | null }>('scopus_results', 'scopus_status'),
    fetchAll<{ mjl_index: string | null }>('mjl_results', 'mjl_index'),
    fetchAll<{ quartile: string | null }>('scimago_results', 'quartile'),
    fetchAll<{ country: string | null }>('journals', 'country'),
    fetchAll<{ publisher: string | null }>('journals', 'publisher'),
  ]);

  const scopusStatuses: Record<string, number> = {};
  (scopusData ?? []).forEach((r: { scopus_status: string | null }) => {
    const s = r.scopus_status ?? 'Unknown';
    scopusStatuses[s] = (scopusStatuses[s] ?? 0) + 1;
  });

  const mjlIndexes: Record<string, number> = {};
  (mjlData ?? []).forEach((r: { mjl_index: string | null }) => {
    const idx = r.mjl_index ?? 'Unknown';
    mjlIndexes[idx] = (mjlIndexes[idx] ?? 0) + 1;
  });

  const quartiles: Record<string, number> = {};
  (scimagoData ?? []).forEach((r: { quartile: string | null }) => {
    const q = r.quartile ?? 'Unknown';
    quartiles[q] = (quartiles[q] ?? 0) + 1;
  });

  const invalid = new Set(['-', '--', 'no data', 'n/a', 'na', 'none', '']);
  const countrySet = new Set<string>();
  (countryData ?? []).forEach((r: { country: string | null }) => {
    const v = r.country?.trim();
    if (!v || invalid.has(v.toLowerCase())) return;
    countrySet.add(v);
  });
  const countries = [...countrySet].sort();

  const publisherSet = new Set<string>();
  (publisherData ?? []).forEach((r: { publisher: string | null }) => {
    const v = r.publisher?.trim();
    if (!v || invalid.has(v.toLowerCase())) return;
    publisherSet.add(v);
  });
  const publishers = [...publisherSet].sort();

  return { scopusStatuses, mjlIndexes, quartiles, countries, publishers };
}
