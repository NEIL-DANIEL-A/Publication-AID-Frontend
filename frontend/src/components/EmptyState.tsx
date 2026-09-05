import { motion } from 'framer-motion';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-5 py-20 text-center"
    >
      {/* Illustration */}
      <div className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-4xl select-none">
        {hasFilters ? '🔍' : '📭'}
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {hasFilters ? 'No matching journals' : 'No journals found'}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {hasFilters
            ? "Try adjusting your filters or search terms to find what you&apos;re looking for."
            : "Journals will appear here once the pipeline runs."}
        </p>
      </div>

      {hasFilters && (
        <button onClick={onClearFilters} className="btn-accent">
          Clear all filters
        </button>
      )}
    </motion.div>
  );
}
