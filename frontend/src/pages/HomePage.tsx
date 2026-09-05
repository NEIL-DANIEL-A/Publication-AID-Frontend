import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useEvents(effectiveFilters, LIMIT);
  const { data: pipelineRun } = usePipelineRun();

  const hasActiveFilters = !!(
    filters.type ||
    filters.platform ||
    filters.search ||
    filters.publisher
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
      {/* Hero */}
      <section className="pt-24 pb-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400 border border-accent-100 dark:border-accent-800/50 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            Publication-AID Journal Database
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight text-balance">
            Find your next{' '}
            <span className="gradient-text">journal</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-balance">
            Discover SCI, Scopus, and SSCI indexed journals with real-time metrics and filtering.
          </p>

          {!isLoading && totalResults > 0 && (
            <motion.p
              key={totalResults}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 pt-1"
            >
              <span className="font-semibold text-accent-600 dark:text-accent-400">{totalResults.toLocaleString()}</span>{' '}
              {hasActiveFilters ? 'matching' : ''} journals found
            </motion.p>
          )}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            isLoading={isFetching && !isLoading}
          />
        </motion.div>
      </section>

      {/* Main content */}
      <main className="px-4 sm:px-6 max-w-7xl mx-auto pb-16 space-y-6">
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
