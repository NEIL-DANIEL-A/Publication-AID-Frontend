// Event type — mirrors backend/src/types/event.ts exactly

export type EventType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Event {
  id: string;
  title: string;
  organizer: string | null;
  type: EventType;
  hackathon_date: string | null; // Mapped to coverage
  deadline: string | null;       // Mapped to citescore_year
  registration_url: string | null;
  mode: string | null;           // Mapped to open_access
  venue: string | null;          // Mapped to sjr_2025
  registration_fee: string | null; // Mapped to apc_details
  eligibility: string | null;    // Mapped to subject_area
  min_team_size: number | null;  // Mapped to impact_factor
  max_team_size: number | null;
  platform: string | null;       // Mapped to sci_scopus_ssci
  issn?: string | null;
  e_issn?: string | null;
  h_index?: string | null;
  sjr_2025?: string | null;
  coverage?: string | null;
  quartile?: string | null;
  created_at: string;
  updated_at: string;
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
  type: string; // Quartile (Q1, Q2, Q3, Q4)
  platform: string;
  mode: string;
  publisher: string;
  fee: string;
  eligibility: string; // Subject area
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
  sort: 'if_desc',
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
