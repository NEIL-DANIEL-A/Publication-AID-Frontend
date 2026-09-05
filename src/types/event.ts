// Event type — adapted for Publication-AID journal data from Supabase

export type EventType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Event {
  id: string;
  title: string;
  organizer: string | null;
  type: EventType | string;
  hackathon_date: string | null; // Coverage
  deadline: string | null;
  registration_url: string | null;
  mode: string | null;
  venue: string | null;          // SJR 2025
  registration_fee: string | null;
  eligibility: string | null;
  min_team_size: number | null;
  max_team_size: number | null;
  platform: string | null;       // SCIE/SSCI/AHCI/ESCI/Scopus
  issn?: string | null;
  e_issn?: string | null;
  h_index?: string | null;
  sjr_2025?: string | null;
  coverage?: string | null;
  quartile?: string | null;
  created_at: string;
  updated_at: string;
  _journal?: unknown;
}

export type SortOption =
  | 'if_desc'
  | 'if_asc'
  | 'name_asc'
  | 'name_desc'
  | 'deadline_asc'
  | 'deadline_desc'
  | 'newest'
  | 'oldest';

export interface FilterState {
  search: string;
  type: string;
  platform: string;
  mode: string;
  publisher: string;
  fee: string;
  eligibility: string;
  coverage: string;
  min_impact_factor?: number;
  min_h_index?: number;
  upcoming: boolean;
  sort: SortOption;
  page: number;
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  type: '',
  platform: '',
  mode: '',
  publisher: '',
  fee: '',
  eligibility: '',
  coverage: '',
  min_impact_factor: 0,
  min_h_index: 0,
  upcoming: false,
  sort: 'name_asc',
  page: 1,
};

export interface EventTypeCount {
  type: EventType;
  count: number;
}

export interface PaginatedResponse {
  success: true;
  data: Event[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleResponse {
  success: true;
  data: Event;
}

export interface ApiError {
  success: false;
  error: string;
}
