import { supabase } from './supabase';
import type { Event, EventListParams, PaginatedResponse, EventType, EventTypeCount } from '../types/event';

const TABLE = 'journals';

/**
 * Maps journals database fields to the Event interface structure.
 */
function sanitizeEvent(raw: Record<string, unknown>): Event {
  const journalName = String(raw.journal_name || '');
  return {
    id: String(raw.id),
    title: journalName,
    organizer: (raw.publisher_name as string | null) || null,
    type: ((raw.quartile as string) || 'Q1') as EventType,
    hackathon_date: (raw.coverage as string | null) || null,
    deadline: (raw.citescore_year as string | null) || null,
    registration_url: `https://www.google.com/search?q=${encodeURIComponent(journalName)}`,
    mode: (raw.open_access as string | null) || null,
    venue: (raw.sjr_2025 as string | null) || null,
    registration_fee: (raw.apc_details as string | null) || null,
    eligibility: (raw.subject_area as string | null) || null,
    min_team_size: raw.impact_factor ? Number(raw.impact_factor) : null,
    max_team_size: null,
    platform: (raw.sci_scopus_ssci as string | null) || null,
    issn: (raw.issn as string | null) || null,
    e_issn: (raw.e_issn as string | null) || null,
    h_index: (raw.h_index as string | null) || null,
    sjr_2025: (raw.sjr_2025 as string | null) || null,
    coverage: (raw.coverage as string | null) || null,
    quartile: (raw.quartile as string | null) || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch a paginated, filtered, sorted list of journals.
 */
export async function getEvents(
  params: EventListParams
): Promise<PaginatedResponse> {
  const {
    search,
    type,
    platform,
    mode,
    fee,
    eligibility,
    publisher,
    coverage,
    min_impact_factor,
    min_h_index,
    sort = 'if_desc',
    page = 1,
    limit = 12,
  } = params;

  const offset = (page - 1) * limit;

  // ── Build query ────────────────────────────────────────────
  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' });

  // Filter: quartile maps to type (Q1, Q2, Q3, Q4)
  if (type && type.trim()) {
    const types = type.split(',').map((t) => t.trim()).filter(Boolean);
    if (types.length === 1) {
      query = query.eq('quartile', types[0]);
    } else if (types.length > 1) {
      query = query.in('quartile', types);
    }
  }

  // Search: journal_name, publisher_name, subject_area
  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(
      `journal_name.ilike.%${term}%,publisher_name.ilike.%${term}%,subject_area.ilike.%${term}%`
    );
  }

  // Filter: Publisher name (supports comma-separated list)
  if (publisher && publisher.trim()) {
    const pubs = publisher.split(',').map((p) => p.trim()).filter(Boolean);
    if (pubs.length === 1) {
      query = query.ilike('publisher_name', `%${pubs[0]}%`);
    } else if (pubs.length > 1) {
      const orClause = pubs.map((p) => `publisher_name.ilike.%${p}%`).join(',');
      query = query.or(orClause);
    }
  }

  // Filter: index platform maps to sci_scopus_ssci (SCI, SSCI, AHCI, ESCI, Scopus)
  if (platform && platform.trim()) {
    const platforms = platform.split(',').map((p) => p.trim()).filter(Boolean);
    if (platforms.length === 1) {
      query = query.ilike('sci_scopus_ssci', `%${platforms[0]}%`);
    } else if (platforms.length > 1) {
      const orClause = platforms.map((p) => `sci_scopus_ssci.ilike.%${p}%`).join(',');
      query = query.or(orClause);
    }
  }

  // Filter: open_access maps to mode (Open Access, Subscription, Hybrid)
  if (mode && mode.trim()) {
    const modes = mode.split(',').map((m) => m.trim()).filter(Boolean);
    if (modes.length === 1) {
      query = query.ilike('open_access', `%${modes[0]}%`);
    } else if (modes.length > 1) {
      const orClause = modes.map((m) => `open_access.ilike.%${m}%`).join(',');
      query = query.or(orClause);
    }
  }

  // Filter: apc_details maps to fee
  if (fee) {
    if (fee.toLowerCase() === 'free') {
      query = query.or('apc_details.is.null,apc_details.eq.Free,apc_details.eq.');
    } else if (fee.toLowerCase() === 'paid') {
      query = query.not('apc_details', 'is', null).not('apc_details', 'eq', 'Free').not('apc_details', 'eq', '');
    }
  }

  // Filter: subject_area maps to eligibility
  if (eligibility && eligibility.trim()) {
    query = query.ilike('subject_area', `%${eligibility.trim()}%`);
  }

  // Filter: Minimum Impact Factor
  if (typeof min_impact_factor === 'number' && !isNaN(min_impact_factor) && min_impact_factor > 0) {
    query = query.gte('impact_factor', min_impact_factor);
  }

  // Filter: Minimum H-Index (if specified)
  if (typeof min_h_index === 'number' && !isNaN(min_h_index) && min_h_index > 0) {
    query = query.not('h_index', 'is', null);
  }

  // Filter: coverage (e.g., active 2025/2026)
  if (coverage && coverage.trim()) {
    if (coverage.toLowerCase() === 'active') {
      query = query.or('coverage.ilike.%2025%,coverage.ilike.%2026%');
    } else {
      query = query.ilike('coverage', `%${coverage.trim()}%`);
    }
  }

  // Sort logic for journals
  switch (sort) {
    case 'if_desc':
    case 'deadline_asc':
    case 'newest':
      query = query.order('impact_factor', { ascending: false, nullsFirst: false });
      break;
    case 'if_asc':
    case 'deadline_desc':
    case 'oldest':
      query = query.order('impact_factor', { ascending: true, nullsFirst: true });
      break;
    case 'name_asc':
      query = query.order('journal_name', { ascending: true });
      break;
    case 'name_desc':
      query = query.order('journal_name', { ascending: false });
      break;
    default:
      query = query.order('impact_factor', { ascending: false, nullsFirst: false });
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const events = (data as Record<string, unknown>[]).map(sanitizeEvent);

  return {
    success: true,
    data: events,
    total: count ?? 0,
    page,
    limit,
  };
}

/**
 * Fetch a single journal by ID (bigint id in Supabase).
 */
export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', parseInt(id, 10))
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }

  return sanitizeEvent(data as Record<string, unknown>);
}

/**
 * Fetch distinct quartile types with counts.
 */
export async function getEventTypeCounts(): Promise<EventTypeCount[]> {
  const allowedTypes: EventType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  const { data, error } = await supabase
    .from(TABLE)
    .select('quartile');

  if (error) throw new Error(error.message);

  const countsMap: Record<string, number> = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };

  (data as { quartile: string }[]).forEach((item) => {
    if (item.quartile && countsMap[item.quartile] !== undefined) {
      countsMap[item.quartile]++;
    }
  });

  return allowedTypes.map((type) => ({
    type,
    count: countsMap[type] || 0,
  }));
}
