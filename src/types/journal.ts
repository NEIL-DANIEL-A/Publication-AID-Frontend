export interface Journal {
  id: string;
  title: string;
  print_issn: string | null;
  e_issn: string | null;
  normalized_print: string | null;
  normalized_e: string | null;
  publisher: string | null;
  country: string | null;
  data_hash: string | null;
  created_at: string;
  updated_at: string;
  first_seen_at: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  last_seen_pipeline_run_id: string | null;
}

export interface CfrResult {
  id: string;
  journal_id: string;
  sl_no: string | null;
  journal_title: string | null;
  print_issn: string | null;
  e_issn: string | null;
  publisher: string | null;
  country: string | null;
  updated_at: string;
}

export interface ScopusResult {
  journal_id: string;
  scopus_status: string | null;
  match_type: string | null;
  sourcerecord_id: string | null;
  source_title: string | null;
  scopus_publisher: string | null;
  scopus_coverage: string | null;
  scopus_issn: string | null;
  scopus_eissn: string | null;
  raw_active_status: string | null;
  raw_discontinued_flag: string | null;
  updated_at: string;
}

export interface MjlResult {
  journal_id: string;
  mjl_status: string | null;
  mjl_index: string | null;
  mjl_issn_used: string | null;
  mjl_match_type: string | null;
  mjl_source_title: string | null;
  execution_time: number | null;
  error: string | null;
  updated_at: string;
}

export interface ScimagoResult {
  journal_id: string;
  scimago_status: string | null;
  journal_id_external: string | null;
  matched_issn: string | null;
  sjr: string | null;
  quartile: string | null;
  h_index: string | null;
  coverage: string | null;
  url: string | null;
  execution_time: number | null;
  error: string | null;
  updated_at: string;
}

export interface PipelineRun {
  id: string;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  status: string;
  total_cfr: number | null;
  total_scopus_active: number | null;
  total_mjl_processed: number | null;
  total_scimago_processed: number | null;
  new_records: number;
  updated_records: number;
  unchanged_records: number;
  failed_records: number;
  error: string | null;
  duplicate_skipped: number | null;
  skipped_count?: number;
}

export interface JournalChange {
  id: string;
  journal_id: string;
  pipeline_run_id: string | null;
  source: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
}

export interface SkippedRecord {
  id: string;
  pipeline_run_id: string | null;
  sl_no: string | null;
  journal_title: string | null;
  print_issn: string | null;
  e_issn: string | null;
  normalized_print: string | null;
  normalized_e: string | null;
  publisher: string | null;
  country: string | null;
  reason: string;
  duplicate_of_issn: string | null;
  duplicate_of_title: string | null;
  skipped_at: string;
}

export interface JournalWithRelations extends Journal {
  cfr_results: CfrResult | null;
  scopus_results: ScopusResult | null;
  mjl_results: MjlResult | null;
  scimago_results: ScimagoResult | null;
}
