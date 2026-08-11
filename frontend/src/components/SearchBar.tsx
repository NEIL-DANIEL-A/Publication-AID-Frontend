import { useId } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ value, onChange, isLoading = false, placeholder = 'Search journals, publishers, subject areas…' }: SearchBarProps) {
  const inputId = useId();

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search icon — always visible on the left */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none z-10">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      {/* type="text" avoids the browser-native × button that duplicates our custom one */}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search journals"
        autoComplete="off"
        spellCheck={false}
        className="input-glass h-11 text-sm shadow-sm"
        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
      />

      {/* Right side: loading dots OR single clear button — never both */}
      {isLoading ? (
        <span
          className="absolute right-3.5 top-1/2 -translate-y-1/2 flex gap-0.5 items-center"
          aria-label="Searching…"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-accent-500 animate-bounce"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </span>
      ) : value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
