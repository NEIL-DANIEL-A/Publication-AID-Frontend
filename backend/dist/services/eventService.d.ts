import type { Event, EventListParams, PaginatedResponse, EventTypeCount } from '../types/event';
/**
 * Fetch a paginated, filtered, sorted list of events.
 */
export declare function getEvents(params: EventListParams): Promise<PaginatedResponse>;
/**
 * Fetch a single event by ID.
 */
export declare function getEventById(id: string): Promise<Event | null>;
/**
 * Fetch distinct event types with counts.
 */
export declare function getEventTypeCounts(): Promise<EventTypeCount[]>;
//# sourceMappingURL=eventService.d.ts.map