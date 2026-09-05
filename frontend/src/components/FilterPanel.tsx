import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FilterState } from '../types/event';
import { DEFAULT_FILTERS } from '../types/event';

const MJL_INDEXES = ['SCIE', 'SSCI', 'AHCI', 'ESCI'];
const QUARTILES = ['Q1', 'Q2', 'Q3', 'Q4'];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (partial: Partial<FilterState>) => void;
  totalResults: number;
}

export function FilterPanel({ filters, onChange, totalResults }: FilterPanelProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleDropdown(name: string) {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }

  // Multi-select for quartiles
  const selectedQuartiles = filters.type
    ? filters.type.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handleQuartileCheck(q: string) {
    let next: string[];
    if (selectedQuartiles.includes(q)) {
      next = selectedQuartiles.filter((item) => item !== q);
    } else {
      next = [...selectedQuartiles, q];
    }
    onChange({ type: next.join(',') });
  }

  // Multi-select for indexing platforms
  const selectedPlatforms = filters.platform
    ? filters.platform.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handlePlatformCheck(plat: string) {
    let next: string[];
    if (selectedPlatforms.includes(plat)) {
      next = selectedPlatforms.filter((p) => p !== plat);
    } else {
      next = [...selectedPlatforms, plat];
    }
    onChange({ platform: next.join(',') });
  }

  const activeFilterCount = [
    filters.search,
    filters.type,
    filters.platform,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  function clearAll() {
    onChange({
      search: DEFAULT_FILTERS.search,
      type: DEFAULT_FILTERS.type,
      platform: DEFAULT_FILTERS.platform,
    });
    setActiveDropdown(null);
  }

  return (
    <div ref={containerRef} className="glass-card p-3 sm:p-4 space-y-3 relative z-30">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold text-xs uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Journal Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="badge bg-accent-600 text-white text-[10px] px-1.5 py-0.5 font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            {totalResults} {totalResults === 1 ? 'journal' : 'journals'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-accent-600 dark:text-accent-400 hover:underline"
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Quartile */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('quartile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              selectedQuartiles.length > 0
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Quartile {selectedQuartiles.length > 0 && `(${selectedQuartiles.join(', ')})`}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'quartile' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Select Quartiles
                </div>
                <div className="space-y-1.5">
                  {QUARTILES.map((q) => {
                    const isChecked = selectedQuartiles.includes(q);
                    return (
                      <label
                        key={q}
                        className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleQuartileCheck(q)}
                          className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                        />
                        <span className="font-semibold">{q} Quartile</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indexing (SCIE/SSCI/AHCI/ESCI) */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('indexing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              selectedPlatforms.length > 0
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Indexing {selectedPlatforms.length > 0 && `(${selectedPlatforms.join(', ')})`}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'indexing' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Indexing Databases
                </div>
                <div className="space-y-1.5">
                  {MJL_INDEXES.map((plat) => {
                    const isChecked = selectedPlatforms.includes(plat);
                    return (
                      <label
                        key={plat}
                        className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePlatformCheck(plat)}
                          className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                        />
                        <span className="font-semibold">{plat}</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800"
          >
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
              Active:
            </span>

            {filters.search && (
              <Chip label={`Search: "${filters.search}"`} onRemove={() => onChange({ search: '' })} />
            )}

            {selectedQuartiles.map((q) => (
              <Chip key={q} label={`Quartile: ${q}`} onRemove={() => handleQuartileCheck(q)} />
            ))}

            {selectedPlatforms.map((plat) => (
              <Chip key={plat} label={`Indexing: ${plat}`} onRemove={() => handlePlatformCheck(plat)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
      {label}
      <button onClick={onRemove} className="hover:text-accent-900">✕</button>
    </span>
  );
}
