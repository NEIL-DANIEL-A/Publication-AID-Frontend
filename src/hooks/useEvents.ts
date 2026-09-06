import { useQuery } from '@tanstack/react-query';
import {
  fetchJournals,
  fetchJournalById,
  fetchLatestPipelineRun,
  fetchJournalChanges,
  fetchSkippedRecords,
  fetchJournalCounts,
  fetchRecentChanges,
  type JournalFilters,
} from '../services/journalApi';
import type { JournalWithRelations } from '../types/journal';

const EVENTS_STALE_TIME = 5 * 60 * 1000;
const EVENTS_GC_TIME = 10 * 60 * 1000;

export function useEvents(filters: JournalFilters, _limit = 24) {
  return useQuery({
    queryKey: ['journals', filters],
    queryFn: () => fetchJournals(filters),
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
    placeholderData: (prev) => prev,
    retry: 2,
  });
}

export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ['journal', id],
    queryFn: () => fetchJournalById(id!),
    enabled: !!id,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
    retry: 1,
  });
}

export function useJournalChanges(journalId: string | null) {
  return useQuery({
    queryKey: ['journalChanges', journalId],
    queryFn: () => fetchJournalChanges(journalId!),
    enabled: !!journalId,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
  });
}

export function usePipelineRun() {
  return useQuery({
    queryKey: ['pipelineRun'],
    queryFn: fetchLatestPipelineRun,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
  });
}

export function useSkippedRecords(pipelineRunId: string | null) {
  return useQuery({
    queryKey: ['skippedRecords', pipelineRunId],
    queryFn: () => fetchSkippedRecords(pipelineRunId!),
    enabled: !!pipelineRunId,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
  });
}

export function useJournalCounts() {
  return useQuery({
    queryKey: ['journalCounts'],
    queryFn: fetchJournalCounts,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
  });
}

export function useRecentChanges(limit = 20) {
  return useQuery({
    queryKey: ['recentChanges', limit],
    queryFn: () => fetchRecentChanges(limit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function mapJournalToEvent(journal: JournalWithRelations) {
  const scopus = journal.scopus_results;
  const mjl = journal.mjl_results;
  const scimago = journal.scimago_results;
  const cfr = journal.cfr_results;

  const scopusStatus = scopus?.scopus_status ?? '';
  const mjlIndex = mjl?.mjl_index ?? '';
  const platform = mjlIndex || (scopusStatus.includes('Active') ? 'Scopus' : '');

  const issn = journal.print_issn || cfr?.print_issn || '';
  const eIssn = journal.e_issn || cfr?.e_issn || '';

  function clean(val: string | null | undefined): string | null {
    if (!val) return null;
    return val;
  }

  return {
    id: journal.id,
    title: journal.title,
    organizer: journal.publisher || cfr?.publisher || null,
    type: clean(scimago?.quartile) ?? '',
    hackathon_date: clean(scimago?.coverage) || clean(scopus?.scopus_coverage) || null,
    deadline: null,
    registration_url: clean(scimago?.url) || null,
    mode: null,
    venue: clean(scimago?.sjr) || null,
    registration_fee: null,
    eligibility: null,
    min_team_size: null,
    max_team_size: null,
    platform: clean(platform) || null,
    issn: issn || null,
    e_issn: eIssn || null,
    h_index: clean(scimago?.h_index) || null,
    sjr_2025: clean(scimago?.sjr) || null,
    coverage: clean(scimago?.coverage) || clean(scopus?.scopus_coverage) || null,
    quartile: clean(scimago?.quartile) || null,
    created_at: journal.created_at,
    updated_at: journal.updated_at,
    _journal: journal,
  };
}

export { fetchJournals };
