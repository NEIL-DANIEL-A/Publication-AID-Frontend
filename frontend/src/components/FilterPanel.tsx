import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FilterState } from '../types/event';
import { DEFAULT_FILTERS } from '../types/event';

const POPULAR_JOURNALS = [
  'Ain Shams Engineering Journal',
  'ACS Omega',
  'Molecules',
  'Scientific Reports',
  'The Journal of Supercomputing',
  'Journal of Molecular Structure',
  'Heliyon',
  'Fractal and Fractional',
  'Journal of Parallel and Distributed Computing',
  'Applied Mathematics and Computation',
  'The European Physical Journal Plus',
];

const PUBLISHERS = [
  'Elsevier',
  'Springer',
  'IEEE',
  'MDPI',
  'Wiley',
  'Taylor & Francis',
  'IOP Publishing',
  'SAGE',
  'Inderscience',
  'American Chemical Society',
];

const INDEXING_PLATFORMS = ['SCI', 'SSCI', 'AHCI', 'ESCI', 'Scopus'];
const QUARTILES = ['Q1', 'Q2', 'Q3', 'Q4'];
const MODES = ['Open Access', 'Subscription', 'Hybrid'];
const SUBJECT_AREAS = [
  'Computer Science',
  'Artificial Intelligence',
  'Mathematics',
  'Engineering',
  'Physics',
  'Chemistry',
  'Multidisciplinary',
  'Medicine',
  'Biochemistry',
];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (partial: Partial<FilterState>) => void;
  totalResults: number;
}

export function FilterPanel({ filters, onChange, totalResults }: FilterPanelProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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

  // Multi-select helper for publishers
  const selectedPublishers = filters.publisher
    ? filters.publisher.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handlePublisherCheck(pub: string) {
    let next: string[];
    if (selectedPublishers.includes(pub)) {
      next = selectedPublishers.filter((p) => p !== pub);
    } else {
      next = [...selectedPublishers, pub];
    }
    onChange({ publisher: next.join(',') });
  }

  // Multi-select helper for quartiles (type)
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

  // Multi-select helper for indexing platforms (SCI, SSCI, AHCI, ESCI, Scopus)
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

  // Multi-select helper for access modes
  const selectedModes = filters.mode
    ? filters.mode.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handleModeCheck(m: string) {
    let next: string[];
    if (selectedModes.includes(m)) {
      next = selectedModes.filter((item) => item !== m);
    } else {
      next = [...selectedModes, m];
    }
    onChange({ mode: next.join(',') });
  }

  const activeFilterCount = [
    filters.search,
    filters.publisher,
    filters.type,
    filters.mode,
    filters.platform,
    filters.fee,
    filters.eligibility,
    filters.coverage,
    filters.min_impact_factor && filters.min_impact_factor > 0 ? 'if' : '',
    filters.min_h_index && filters.min_h_index > 0 ? 'h' : '',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  function clearAll() {
    onChange({
      search: DEFAULT_FILTERS.search,
      publisher: DEFAULT_FILTERS.publisher,
      type: DEFAULT_FILTERS.type,
      mode: DEFAULT_FILTERS.mode,
      platform: DEFAULT_FILTERS.platform,
      fee: DEFAULT_FILTERS.fee,
      eligibility: DEFAULT_FILTERS.eligibility,
      coverage: DEFAULT_FILTERS.coverage,
      min_impact_factor: DEFAULT_FILTERS.min_impact_factor,
      min_h_index: DEFAULT_FILTERS.min_h_index,
    });
    setActiveDropdown(null);
  }

  return (
    <div ref={containerRef} className="glass-card p-3 sm:p-4 space-y-3 relative z-30">
      {/* Horizontal Dropdowns Header Row */}
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

      {/* Dropdown Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 0. Journal Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('journal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.search
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm font-semibold'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Journal: {filters.search ? `"${filters.search.length > 18 ? filters.search.slice(0, 18) + '…' : filters.search}"` : 'All Journals'}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'journal' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-72 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Select or Search Journal
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type journal title..."
                    value={filters.search}
                    onChange={(e) => onChange({ search: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-accent-500"
                  />
                  {filters.search && (
                    <button
                      onClick={() => onChange({ search: '' })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                  <button
                    onClick={() => { onChange({ search: '' }); setActiveDropdown(null); }}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      !filters.search ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    All Journals
                  </button>
                  {POPULAR_JOURNALS.map((j) => (
                    <button
                      key={j}
                      onClick={() => { onChange({ search: j }); setActiveDropdown(null); }}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors truncate ${
                        filters.search === j ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {j}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 1. Publishers Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('publisher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              selectedPublishers.length > 0
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Publishers {selectedPublishers.length > 0 && `(${selectedPublishers.length})`}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'publisher' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Select Publishers
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {PUBLISHERS.map((pub) => {
                    const isChecked = selectedPublishers.includes(pub);
                    return (
                      <label
                        key={pub}
                        className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePublisherCheck(pub)}
                          className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                        />
                        <span>{pub}</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Quartile Dropdown */}
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

        {/* 2.5 Indexing Dropdown (SCI, SSCI, AHCI, ESCI, Scopus) */}
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
                  {INDEXING_PLATFORMS.map((plat) => {
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

        {/* 3. Access Mode Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('mode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              selectedModes.length > 0
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Access Mode {selectedModes.length > 0 && `(${selectedModes.length})`}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'mode' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Access Mode
                </div>
                <div className="space-y-1.5">
                  {MODES.map((m) => {
                    const isChecked = selectedModes.includes(m);
                    return (
                      <label
                        key={m}
                        className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleModeCheck(m)}
                          className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                        />
                        <span>{m}</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Subject Area Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('subject')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.eligibility
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Subject: {filters.eligibility || 'All Fields'}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'subject' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Field / Area
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  <button
                    onClick={() => { onChange({ eligibility: '' }); setActiveDropdown(null); }}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      !filters.eligibility ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    All Subject Areas
                  </button>
                  {SUBJECT_AREAS.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => { onChange({ eligibility: subj }); setActiveDropdown(null); }}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        filters.eligibility === subj ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Impact Factor Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('impactFactor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.min_impact_factor && filters.min_impact_factor > 0
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            Impact Factor: {filters.min_impact_factor ? `≥ ${filters.min_impact_factor}` : 'Any IF'}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'impactFactor' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-1"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Min Impact Factor
                </div>
                {[0, 1, 3, 5, 8].map((val) => (
                  <button
                    key={val}
                    onClick={() => { onChange({ min_impact_factor: val }); setActiveDropdown(null); }}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      (filters.min_impact_factor ?? 0) === val
                        ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {val === 0 ? 'Any Impact Factor' : `≥ ${val}.0 Impact Factor`}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. APC Details / Fee */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('fee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.fee
                ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            APC Fee: {filters.fee ? (filters.fee === 'Free' ? 'Free (No APC)' : 'Paid APC') : 'All'}
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === 'fee' && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-1"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  APC Fee Filter
                </div>
                {[
                  { label: 'All APC Statuses', val: '' },
                  { label: 'Free (No APC)', val: 'Free' },
                  { label: 'Paid APC', val: 'Paid' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => { onChange({ fee: item.val }); setActiveDropdown(null); }}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      filters.fee === item.val
                        ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                Journal: "{filters.search}"
                <button onClick={() => onChange({ search: '' })} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            )}

            {selectedPublishers.map((pub) => (
              <span
                key={pub}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800"
              >
                Publisher: {pub}
                <button onClick={() => handlePublisherCheck(pub)} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            ))}

            {selectedQuartiles.map((q) => (
              <span
                key={q}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800"
              >
                Quartile: {q}
                <button onClick={() => handleQuartileCheck(q)} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            ))}

            {selectedPlatforms.map((plat) => (
              <span
                key={plat}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800"
              >
                Indexing: {plat}
                <button onClick={() => handlePlatformCheck(plat)} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            ))}

            {selectedModes.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800"
              >
                Mode: {m}
                <button onClick={() => handleModeCheck(m)} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            ))}

            {filters.eligibility && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                Subject: {filters.eligibility}
                <button onClick={() => onChange({ eligibility: '' })} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            )}

            {filters.min_impact_factor && filters.min_impact_factor > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                IF ≥ {filters.min_impact_factor}
                <button onClick={() => onChange({ min_impact_factor: 0 })} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            ) : null}

            {filters.fee && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800">
                APC: {filters.fee}
                <button onClick={() => onChange({ fee: '' })} className="hover:text-accent-900">
                  ✕
                </button>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
