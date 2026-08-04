import { useId } from 'react';
import type { SortOption } from '../types/event';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'deadline_asc',  label: '⏰ Deadline (Soonest first)' },
  { value: 'deadline_desc', label: '📅 Deadline (Latest first)'  },
  { value: 'newest',        label: '✨ Newest added'             },
  { value: 'oldest',        label: '🕰️ Oldest added'            },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="select-glass text-sm min-w-[200px]"
        aria-label="Sort events by"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
