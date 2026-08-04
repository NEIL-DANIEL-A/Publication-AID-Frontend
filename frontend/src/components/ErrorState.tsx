import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'Something went wrong loading events.', onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-5 py-20 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-4xl select-none">
        ⚠️
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Failed to load events
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
      </div>

      <button onClick={onRetry} className="btn-accent">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try again
      </button>
    </motion.div>
  );
}
