import { useEffect, useState } from 'react';
import { useEvents, usePipelineRun, mapJournalToEvent } from '../hooks/useEvents';
import { useDebounce } from '../hooks/useDebounce';
import { useUrlState } from '../hooks/useUrlState';
import { DEFAULT_FILTERS, Event } from '../types/event';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { EventGrid } from '../components/EventGrid';
import { SkeletonGrid } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';
import { JournalDetailModal } from '../components/JournalDetailModal';
import { PipelineStatusCard } from '../components/PipelineStatusCard';

const LIMIT = 24;

export function HomePage() {
  const [filters, setFilters] = useUrlState();
  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectedJournal, setSelectedJournal] = useState<Event | null>(null);
  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const activeSearch = searchInput === filters.search ? filters.search : debouncedSearch;
  const effectiveFilters = {
    ...filters,
    search: activeSearch,
    quartile: filters.type || undefined,
    mjl_index: filters.platform || undefined,
    country: filters.country || undefined,
    publisher: filters.publisher || undefined,
    min_sjr: filters.min_sjr || undefined,
    max_sjr: filters.max_sjr || undefined,
    min_h_index: filters.min_h_index || undefined,
    max_h_index: filters.max_h_index || undefined,
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useEvents(effectiveFilters, LIMIT);
  const { data: pipelineRun } = usePipelineRun();

  const hasActiveFilters = !!(
    filters.type ||
    filters.platform ||
    filters.search ||
    filters.publisher ||
    filters.country ||
    filters.min_sjr > 0 ||
    filters.max_sjr > 0 ||
    filters.min_h_index > 0 ||
    filters.max_h_index > 0
  );

  function handleSearchChange(val: string) {
    setSearchInput(val);
    setFilters({ page: 1 });
  }

  function clearAllFilters() {
    setSearchInput('');
    setFilters({ ...DEFAULT_FILTERS });
  }

  function handleViewDetail(id: string) {
    const found = events.find((e) => e.id === id);
    if (found) {
      setSelectedJournal(found);
    }
  }

  const totalResults = data?.total ?? 0;
  const events = (data?.data ?? []).map(mapJournalToEvent);

  return (
    <div className="min-h-screen bg-mesh">
      {/* Main content */}
      <main className="px-4 sm:px-6 max-w-7xl mx-auto pb-16 space-y-6 pt-20">
        {/* Search bar */}
        <div className="flex justify-center">
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            isLoading={isFetching && !isLoading}
          />
        </div>
        {/* Pipeline status */}
        {pipelineRun && <PipelineStatusCard run={pipelineRun} />}

        {/* Filter row */}
        <div className="w-full">
          <FilterPanel
            filters={filters}
            onChange={(partial) => setFilters(partial)}
            totalResults={totalResults}
          />
        </div>

        {/* Events area */}
        {isLoading ? (
          <SkeletonGrid count={LIMIT} />
        ) : isError ? (
          <ErrorState
            message={(error as Error)?.message}
            onRetry={() => refetch()}
          />
        ) : events.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        ) : (
          <>
            <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-80' : 'opacity-100'}`}>
              <EventGrid events={events} onViewDetail={handleViewDetail} />
            </div>

            <Pagination
              page={filters.page}
              total={totalResults}
              limit={LIMIT}
              onPageChange={(page) => {
                setFilters({ page });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Detail Modal */}
      <JournalDetailModal
        journal={selectedJournal}
        onClose={() => setSelectedJournal(null)}
      />
    </div>
  );
}
