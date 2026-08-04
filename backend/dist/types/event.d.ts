export type EventType = 'Hackathon' | 'Workshop' | 'Conference' | 'Competition';
export interface Event {
    id: string;
    title: string;
    organizer: string | null;
    type: EventType;
    hackathon_date: string | null;
    deadline: string | null;
    registration_url: string | null;
    mode: 'Online' | 'Offline' | 'Hybrid' | null;
    venue: string | null;
    registration_fee: string | null;
    eligibility: string | null;
    min_team_size: number | null;
    max_team_size: number | null;
    platform: string | null;
    created_at: string;
    updated_at: string;
}
export type SortOption = 'deadline_asc' | 'deadline_desc' | 'newest' | 'oldest';
export interface EventListParams {
    search?: string;
    type?: string;
    platform?: string;
    mode?: string;
    fee?: string;
    eligibility?: string;
    upcoming?: boolean;
    sort?: SortOption;
    page?: number;
    limit?: number;
}
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
export interface ErrorResponse {
    success: false;
    error: string;
}
//# sourceMappingURL=event.d.ts.map