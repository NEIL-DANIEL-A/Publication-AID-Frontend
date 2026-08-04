import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchEventById } from '../services/api';
import type { FilterState } from '../types/event';

const EVENTS_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const EVENTS_GC_TIME    = 10 * 60 * 1000; // 10 minutes

/**
 * TanStack Query hook for the paginated events list.
 * Caches results and refetches in the background.
 */
export function useEvents(filters: FilterState, limit = 12) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents({ ...filters, limit }),
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
    placeholderData: (prev) => prev, // keep previous data while refetching (smooth UX)
    retry: 2,
  });
}

/**
 * TanStack Query hook for a single event by ID.
 */
export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
    retry: 1,
  });
}

/**
 * Prefetch the next page of events (call on hover of pagination next button).
 */
export { fetchEvents };
