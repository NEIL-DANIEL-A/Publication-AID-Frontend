import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FilterState } from '../types/event';
import { DEFAULT_FILTERS } from '../types/event';

const PLATFORMS = ['Unstop', 'Devpost', 'Hack2Skill', 'HackerEarth', 'HackerRank', 'Kaggle', 'Topcoder', 'Other'];
const MODES = ['Online', 'Offline', 'Hybrid'];
const FEES  = ['Free', 'Paid'];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (partial: Partial<FilterState>) => void;
  totalResults: number;
}

// Animated filter chip
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                 bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300"
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 hover:text-accent-900 dark:hover:text-accent-100 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.span>
  );
}

// Pill toggle button
function PillToggle({
  label, active, onClick
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
        active
          ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
          : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-accent-400 dark:hover:border-accent-600'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export function FilterPanel({ filters, onChange, totalResults }: FilterPanelProps) {
  const [open, setOpen] = useState(true);

  const activeFilterCount = [
    filters.platform, filters.mode, filters.fee, filters.eligibility,
  ].filter(Boolean).length + (filters.upcoming ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  function clearAll() {
    onChange({
      platform: DEFAULT_FILTERS.platform,
      mode: DEFAULT_FILTERS.mode,
      fee: DEFAULT_FILTERS.fee,
      eligibility: DEFAULT_FILTERS.eligibility,
      upcoming: DEFAULT_FILTERS.upcoming,
    });
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Panel header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left focus-visible:ring-inset"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="filter-panel-body"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Filters</span>
          {activeFilterCount > 0 && (
            <span className="badge bg-accent-600 text-white text-[10px] px-1.5 py-0.5">{activeFilterCount}</span>
          )}
          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">{totalResults} results</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="text-xs text-accent-600 dark:text-accent-400 hover:underline font-medium"
            >
              Clear all
            </button>
          )}
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            className="text-neutral-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </div>
      </button>

      {/* Active filter chips */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {filters.platform && <FilterChip label={`Platform: ${filters.platform}`} onRemove={() => onChange({ platform: '' })} />}
              {filters.mode     && <FilterChip label={`Mode: ${filters.mode}`}         onRemove={() => onChange({ mode: '' })} />}
              {filters.fee      && <FilterChip label={`Fee: ${filters.fee}`}           onRemove={() => onChange({ fee: '' })} />}
              {filters.eligibility && <FilterChip label={`Eligibility: ${filters.eligibility}`} onRemove={() => onChange({ eligibility: '' })} />}
              {filters.upcoming && <FilterChip label="Upcoming only" onRemove={() => onChange({ upcoming: false })} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="filter-panel-body"
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-5 border-t border-neutral-100 dark:border-neutral-800 pt-4">

              {/* Platform */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
                  Platform
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.map((p) => (
                    <PillToggle
                      key={p} label={p}
                      active={filters.platform === p}
                      onClick={() => onChange({ platform: filters.platform === p ? '' : p })}
                    />
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
                  Mode
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MODES.map((m) => (
                    <PillToggle
                      key={m} label={m}
                      active={filters.mode === m}
                      onClick={() => onChange({ mode: filters.mode === m ? '' : m })}
                    />
                  ))}
                </div>
              </div>

              {/* Fee */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
                  Registration Fee
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEES.map((f) => (
                    <PillToggle
                      key={f} label={f}
                      active={filters.fee === f}
                      onClick={() => onChange({ fee: filters.fee === f ? '' : f })}
                    />
                  ))}
                </div>
              </div>

              {/* Upcoming toggle */}
              <div className="flex items-center gap-3">
                <button
                  role="switch"
                  aria-checked={filters.upcoming}
                  onClick={() => onChange({ upcoming: !filters.upcoming })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-500 ${
                    filters.upcoming ? 'bg-accent-600' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                >
                  <motion.span
                    className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm"
                    animate={{ x: filters.upcoming ? 18 : 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                  Upcoming events only
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
