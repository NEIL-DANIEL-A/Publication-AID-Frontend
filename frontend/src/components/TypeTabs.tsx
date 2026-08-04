import { motion } from 'framer-motion';
import type { EventType } from '../types/event';

// Minimal icons per type
const TrophyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12M6 3h12l-1 7a5 5 0 01-10 0L6 3z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MicIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const MedalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

interface TypeTabItem {
  id: string; // '' for All
  label: string;
  icon: React.ReactNode;
}

const TABS: TypeTabItem[] = [
  { id: '', label: 'All Opportunities', icon: <GridIcon /> },
  { id: 'Hackathon', label: 'Hackathons', icon: <TrophyIcon /> },
  { id: 'Workshop', label: 'Workshops', icon: <BookIcon /> },
  { id: 'Conference', label: 'Conferences', icon: <MicIcon /> },
  { id: 'Competition', label: 'Competitions', icon: <MedalIcon /> },
];

interface TypeTabsProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  counts?: Record<EventType, number>;
}

export function TypeTabs({ selectedType, onSelectType, counts }: TypeTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-card border border-white/40 dark:border-white/10 no-scrollbar">
      {TABS.map((tab) => {
        const active = selectedType === tab.id;
        const count = tab.id ? counts?.[tab.id as EventType] : undefined;

        return (
          <button
            key={tab.id || 'all'}
            onClick={() => onSelectType(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 select-none ${
              active
                ? 'text-accent-600 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            aria-selected={active}
            role="tab"
          >
            {active && (
              <motion.div
                layoutId="type-tab-indicator"
                className="absolute inset-0 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={`transition-colors ${active ? 'text-accent-600 dark:text-accent-400' : 'text-neutral-400'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  active ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/60 dark:text-accent-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
