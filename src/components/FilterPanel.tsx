import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { FilterState } from '../types/event';
import { DEFAULT_FILTERS } from '../types/event';
import { useJournalCounts } from '../hooks/useEvents';

const MJL_INDEXES = ['SCIE', 'SSCI', 'AHCI', 'ESCI', 'Not MJL Indexed'];
const QUARTILES = ['Q1', 'Q2', 'Q3', 'Q4'];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (partial: Partial<FilterState>) => void;
  totalResults: number;
}

export function FilterPanel({ filters, onChange, totalResults }: FilterPanelProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [publisherSearch, setPublisherSearch] = useState('');
  const [elsevierExpanded, setElsevierExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: counts } = useJournalCounts();

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
    const next = selectedQuartiles.includes(q)
      ? selectedQuartiles.filter((item) => item !== q)
      : [...selectedQuartiles, q];
    onChange({ type: next.join(',') });
  }

  // Multi-select for indexing platforms
  const selectedPlatforms = filters.platform
    ? filters.platform.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handlePlatformCheck(plat: string) {
    const next = selectedPlatforms.includes(plat)
      ? selectedPlatforms.filter((p) => p !== plat)
      : [...selectedPlatforms, plat];
    onChange({ platform: next.join(',') });
  }

  // Multi-select for countries
  const selectedCountries = filters.country
    ? filters.country.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handleCountryCheck(c: string) {
    const next = selectedCountries.includes(c)
      ? selectedCountries.filter((item) => item !== c)
      : [...selectedCountries, c];
    onChange({ country: next.join(',') });
  }

  // Multi-select for publishers
  const selectedPublishers = filters.publisher
    ? filters.publisher.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  function handlePublisherCheck(pub: string) {
    const isElsevierVariant = pub.toLowerCase().includes('elsevier');
    if (isElsevierVariant && isElsevierGroupChecked) {
      // Deselecting one member from the group: expand group into individual variants minus this one
      const otherVariants = elsevierAll.filter((v) => v !== pub);
      const withoutGroup = selectedPublishers.filter((p) => p !== ELSEVIER_GROUP);
      onChange({ publisher: [...withoutGroup, ...otherVariants].join(',') });
      return;
    }
    const next = selectedPublishers.includes(pub)
      ? selectedPublishers.filter((item) => item !== pub)
      : [...selectedPublishers, pub];
    onChange({ publisher: next.join(',') });
  }

  const allPublishers = counts?.publishers ?? [];
  const elsevierAll = allPublishers.filter((p) => p.toLowerCase().includes('elsevier'));
  const ELSEVIER_GROUP = 'ELSEVIER_GROUP';
  const isElsevierGroupChecked = selectedPublishers.includes(ELSEVIER_GROUP);

  function handleElsevierGroupCheck() {
    let next: string[];
    if (isElsevierGroupChecked) {
      next = selectedPublishers.filter((p) => p !== ELSEVIER_GROUP);
    } else {
      const withoutElsevierVariants = selectedPublishers.filter((p) => !p.toLowerCase().includes('elsevier'));
      next = [...withoutElsevierVariants, ELSEVIER_GROUP];
    }
    onChange({ publisher: next.join(',') });
  }

  const publishers = (counts?.publishers ?? []).filter((p) =>
    publisherSearch ? p.toLowerCase().includes(publisherSearch.toLowerCase()) : true
  );
  const elsevierPublishers = publishers.filter((p) => p.toLowerCase().includes('elsevier'));
  const otherPublishers = publishers.filter((p) => !p.toLowerCase().includes('elsevier'));

  const activeFilterCount = [
    filters.search,
    filters.type,
    filters.platform,
    filters.country,
    filters.publisher,
    filters.min_sjr > 0 || filters.max_sjr > 0,
    filters.min_h_index > 0 || filters.max_h_index > 0,
    filters.has_apc,
    filters.without_apc,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  function clearAll() {
    onChange({
      search: DEFAULT_FILTERS.search,
      type: DEFAULT_FILTERS.type,
      platform: DEFAULT_FILTERS.platform,
      country: DEFAULT_FILTERS.country,
      publisher: DEFAULT_FILTERS.publisher,
      min_sjr: DEFAULT_FILTERS.min_sjr,
      max_sjr: DEFAULT_FILTERS.max_sjr,
      min_h_index: DEFAULT_FILTERS.min_h_index,
      max_h_index: DEFAULT_FILTERS.max_h_index,
      has_apc: DEFAULT_FILTERS.has_apc,
      without_apc: DEFAULT_FILTERS.without_apc,
    });
    setPublisherSearch('');
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

      {/* Filter buttons — flexed across entire div */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <FilterDropdown
          label="Quartile"
          active={selectedQuartiles.length > 0}
          badge={selectedQuartiles.length > 0 ? selectedQuartiles.join(', ') : undefined}
          isOpen={activeDropdown === 'quartile'}
          onToggle={() => toggleDropdown('quartile')}
        >
          <DropdownLabel>Select Quartiles</DropdownLabel>
          {QUARTILES.map((q) => (
            <CheckboxItem key={q} label={`${q} Quartile`} checked={selectedQuartiles.includes(q)} onChange={() => handleQuartileCheck(q)} />
          ))}
        </FilterDropdown>

        <FilterDropdown
          label="Indexing"
          active={selectedPlatforms.length > 0}
          badge={selectedPlatforms.length > 0 ? selectedPlatforms.join(', ') : undefined}
          isOpen={activeDropdown === 'indexing'}
          onToggle={() => toggleDropdown('indexing')}
        >
          <DropdownLabel>Indexing Databases</DropdownLabel>
          {MJL_INDEXES.map((plat) => (
            <CheckboxItem key={plat} label={plat} checked={selectedPlatforms.includes(plat)} onChange={() => handlePlatformCheck(plat)} />
          ))}
        </FilterDropdown>

        <FilterDropdown
          label="Country"
          active={selectedCountries.length > 0}
          badge={selectedCountries.length > 0 ? `${selectedCountries.length} selected` : undefined}
          isOpen={activeDropdown === 'country'}
          onToggle={() => toggleDropdown('country')}
          wide
        >
          <DropdownLabel>Select Countries</DropdownLabel>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {(counts?.countries ?? []).length === 0 && <p className="text-[11px] text-neutral-400">Loading...</p>}
            {(counts?.countries ?? []).map((c) => (
              <CheckboxItem key={c} label={c} checked={selectedCountries.includes(c)} onChange={() => handleCountryCheck(c)} />
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="Publisher"
          active={selectedPublishers.length > 0}
          badge={selectedPublishers.length > 0 ? `${selectedPublishers.length} selected` : undefined}
          isOpen={activeDropdown === 'publisher'}
          onToggle={() => toggleDropdown('publisher')}
          wide
        >
          <DropdownLabel>Select Publishers</DropdownLabel>
          <input
            type="text"
            value={publisherSearch}
            onChange={(e) => setPublisherSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500 mb-1"
          />
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {/* Elsevier group */}
            {elsevierPublishers.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 py-1 px-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                  <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none flex-1">
                    <input type="checkbox" checked={isElsevierGroupChecked} onChange={handleElsevierGroupCheck} className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500" />
                    <span className="font-bold">ELSEVIER ({elsevierAll.length})</span>
                  </label>
                  <button onClick={() => setElsevierExpanded((v) => !v)} className="text-[11px] font-semibold text-accent-600 dark:text-accent-400 hover:underline shrink-0">
                    {elsevierExpanded ? 'Hide' : 'Show'}
                  </button>
                </div>
                {elsevierExpanded && (
                  <div className="ml-2 pl-3 border-l border-amber-200 dark:border-amber-800/30 space-y-1">
                    {elsevierPublishers.map((p) => (
                      <CheckboxItem key={p} label={p} checked={isElsevierGroupChecked || selectedPublishers.includes(p)} onChange={() => handlePublisherCheck(p)} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {elsevierPublishers.length > 0 && otherPublishers.length > 0 && <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />}
            {otherPublishers.length === 0 && elsevierPublishers.length === 0 && <p className="text-[11px] text-neutral-400">No matches</p>}
            {otherPublishers.map((p) => (
              <CheckboxItem key={p} label={p} checked={selectedPublishers.includes(p)} onChange={() => handlePublisherCheck(p)} />
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="SJR Range"
          active={filters.min_sjr > 0 || filters.max_sjr > 0}
          badge={(filters.min_sjr > 0 || filters.max_sjr > 0) ? `${filters.min_sjr || '0'}–${filters.max_sjr || '∞'}` : undefined}
          isOpen={activeDropdown === 'sjr'}
          onToggle={() => toggleDropdown('sjr')}
        >
          <DropdownLabel>SJR Score Range</DropdownLabel>
          <div className="flex items-center gap-2">
            <input type="number" min="0" step="0.01" value={filters.min_sjr || ''} onChange={(e) => onChange({ min_sjr: e.target.value ? parseFloat(e.target.value) : 0 })} placeholder="Min" className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500" />
            <span className="text-neutral-400 text-xs">–</span>
            <input type="number" min="0" step="0.01" value={filters.max_sjr || ''} onChange={(e) => onChange({ max_sjr: e.target.value ? parseFloat(e.target.value) : 0 })} placeholder="Max" className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500" />
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="H-Index"
          active={filters.min_h_index > 0 || filters.max_h_index > 0}
          badge={(filters.min_h_index > 0 || filters.max_h_index > 0) ? `${filters.min_h_index || '0'}–${filters.max_h_index || '∞'}` : undefined}
          isOpen={activeDropdown === 'hindex'}
          onToggle={() => toggleDropdown('hindex')}
        >
          <DropdownLabel>H-Index Range</DropdownLabel>
          <div className="flex items-center gap-2">
            <input type="number" min="0" value={filters.min_h_index || ''} onChange={(e) => onChange({ min_h_index: e.target.value ? parseInt(e.target.value) : 0 })} placeholder="Min" className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500" />
            <span className="text-neutral-400 text-xs">–</span>
            <input type="number" min="0" value={filters.max_h_index || ''} onChange={(e) => onChange({ max_h_index: e.target.value ? parseInt(e.target.value) : 0 })} placeholder="Max" className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-accent-500" />
          </div>
        </FilterDropdown>

        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer select-none transition-colors ${
          filters.has_apc
            ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
            : 'bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:border-slate-300'
        }`}>
          <input type="checkbox" checked={filters.has_apc} onChange={(e) => onChange({ has_apc: e.target.checked, without_apc: false })} className="rounded border-slate-300 text-accent-600 focus:ring-accent-500 w-3.5 h-3.5" />
          Has APC
        </label>
        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer select-none transition-colors ${
          filters.without_apc
            ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
            : 'bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:border-slate-300'
        }`}>
          <input type="checkbox" checked={filters.without_apc} onChange={(e) => onChange({ without_apc: e.target.checked, has_apc: false })} className="rounded border-slate-300 text-accent-600 focus:ring-accent-500 w-3.5 h-3.5" />
          Without APC
        </label>
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

            {selectedCountries.map((c) => (
              <Chip key={c} label={`Country: ${c}`} onRemove={() => handleCountryCheck(c)} />
            ))}

            {selectedPublishers.map((p) => (
              <Chip key={p} label={`Publisher: ${p === 'ELSEVIER_GROUP' ? 'ELSEVIER (All 29)' : p}`} onRemove={() => handlePublisherCheck(p)} />
            ))}

            {(filters.min_sjr > 0 || filters.max_sjr > 0) && (
              <Chip
                label={`SJR: ${filters.min_sjr || '0'}–${filters.max_sjr || '∞'}`}
                onRemove={() => onChange({ min_sjr: 0, max_sjr: 0 })}
              />
            )}

            {(filters.min_h_index > 0 || filters.max_h_index > 0) && (
              <Chip
                label={`H-Index: ${filters.min_h_index || '0'}–${filters.max_h_index || '∞'}`}
                onRemove={() => onChange({ min_h_index: 0, max_h_index: 0 })}
              />
            )}
            {filters.has_apc && (
              <Chip label="Has APC" onRemove={() => onChange({ has_apc: false })} />
            )}
            {filters.without_apc && (
              <Chip label="Without APC" onRemove={() => onChange({ without_apc: false })} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

  function FilterDropdown({ label, active, badge, isOpen, onToggle, wide, children }: {
  label: string;
  active: boolean;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 sm:flex-none min-w-[calc(50%-6px)] sm:min-w-0">
      <button
        onClick={onToggle}
        className={`w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between sm:justify-center gap-1.5 ${
          active
            ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
            : 'bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600 shadow-sm dark:shadow-none'
        }`}
      >
        <span className="truncate">{label} {badge && <span className="opacity-80 hidden sm:inline">({badge})</span>}</span>
        <svg className="w-3.5 h-3.5 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop — leaves space around dropdown to click to close */}
            <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] sm:hidden z-40" onClick={onToggle} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={`fixed sm:absolute bottom-4 sm:bottom-auto left-4 right-4 sm:left-0 sm:right-auto sm:top-full sm:mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 space-y-2 w-auto sm:w-56 ${
                wide ? 'sm:w-72' : ''
              } max-h-[60vh] sm:max-h-96 overflow-y-auto`}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
      {children}
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 rounded border-neutral-300 text-accent-600 focus:ring-accent-500 shrink-0"
      />
      <span className="font-semibold break-words leading-tight">{label}</span>
    </label>
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
