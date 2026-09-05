import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { FilterState, SortOption } from '../types/event';
import { DEFAULT_FILTERS } from '../types/event';

type SetFilters = (updater: Partial<FilterState> | ((prev: FilterState) => FilterState)) => void;

export function useUrlState(): [FilterState, SetFilters] {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);

  const parseFromUrl = useCallback((): FilterState => {
    const p = new URLSearchParams(location.search);
    return {
      search:      p.get('search')      ?? DEFAULT_FILTERS.search,
      type:        p.get('type')        ?? DEFAULT_FILTERS.type,
      platform:    p.get('platform')    ?? DEFAULT_FILTERS.platform,
      mode:        p.get('mode')        ?? DEFAULT_FILTERS.mode,
      publisher:   p.get('publisher')   ?? DEFAULT_FILTERS.publisher,
      country:     p.get('country')     ?? DEFAULT_FILTERS.country,
      min_sjr:     p.get('min_sjr')     ? parseFloat(p.get('min_sjr')!)  : 0,
      max_sjr:     p.get('max_sjr')     ? parseFloat(p.get('max_sjr')!)  : 0,
      min_h_index: p.get('min_h')       ? parseInt(p.get('min_h')!, 10)  : 0,
      max_h_index: p.get('max_hi')      ? parseInt(p.get('max_hi')!, 10) : 0,
      fee:         p.get('fee')         ?? DEFAULT_FILTERS.fee,
      eligibility: p.get('eligibility') ?? DEFAULT_FILTERS.eligibility,
      coverage:    p.get('coverage')    ?? DEFAULT_FILTERS.coverage,
      min_impact_factor: p.get('min_if') ? parseFloat(p.get('min_if')!) : 0,
      upcoming:    p.get('upcoming')    === 'true',
      sort:        (p.get('sort') as SortOption) ?? DEFAULT_FILTERS.sort,
      page:        parseInt(p.get('page') ?? '1', 10),
    };
  }, [location.search]);

  const filters = parseFromUrl();

  const setFilters: SetFilters = useCallback(
    (updater) => {
      const current = parseFromUrl();
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };

      const p = new URLSearchParams();
      if (next.search)      p.set('search',      next.search);
      if (next.type)        p.set('type',        next.type);
      if (next.platform)    p.set('platform',    next.platform);
      if (next.mode)        p.set('mode',        next.mode);
      if (next.publisher)   p.set('publisher',   next.publisher);
      if (next.country)     p.set('country',     next.country);
      if (next.min_sjr && next.min_sjr > 0)     p.set('min_sjr', String(next.min_sjr));
      if (next.max_sjr && next.max_sjr > 0)     p.set('max_sjr', String(next.max_sjr));
      if (next.min_h_index && next.min_h_index > 0) p.set('min_h',  String(next.min_h_index));
      if (next.max_h_index && next.max_h_index > 0) p.set('max_hi', String(next.max_h_index));
      if (next.fee)         p.set('fee',         next.fee);
      if (next.eligibility) p.set('eligibility', next.eligibility);
      if (next.coverage)    p.set('coverage',    next.coverage);
      if (next.min_impact_factor && next.min_impact_factor > 0) p.set('min_if', String(next.min_impact_factor));
      if (next.upcoming)    p.set('upcoming',    'true');
      if (next.sort && next.sort !== DEFAULT_FILTERS.sort) p.set('sort', next.sort);
      if (next.page > 1)    p.set('page',        String(next.page));

      const search = p.toString();
      if (search !== location.search.slice(1)) {
        navigate({ search: search ? `?${search}` : '' }, { replace: isFirstRender.current });
      }
      isFirstRender.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search]
  );

  const setFiltersWithReset: SetFilters = useCallback(
    (updater) => {
      const current = parseFromUrl();
      const partial = typeof updater === 'function' ? updater(current) : updater;
      const pageRelated = 'page' in partial;
      setFilters(pageRelated ? partial : { ...partial, page: 1 });
    },
    [parseFromUrl, setFilters]
  );

  return [filters, setFiltersWithReset];
}
