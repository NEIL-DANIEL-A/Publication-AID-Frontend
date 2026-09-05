import { motion } from 'framer-motion';
import type { PipelineRun } from '../types/journal';

interface PipelineStatusCardProps {
  run: PipelineRun;
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusColors: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  running: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  failed: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50',
};

export function PipelineStatusCard({ run }: PipelineStatusCardProps) {
  const totalNew = run.new_records ?? 0;
  const totalUpdated = run.updated_records ?? 0;
  const totalUnchanged = run.unchanged_records ?? 0;
  const totalFailed = run.failed_records ?? 0;
  const totalSkipped = run.duplicate_skipped ?? 0;

  const statusClass = statusColors[run.status] ?? 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Latest Pipeline Run
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClass}`}>
            {run.status}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {formatDate(run.started_at)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox label="New" value={totalNew} color="text-emerald-600 dark:text-emerald-400" />
        <StatBox label="Updated" value={totalUpdated} color="text-blue-600 dark:text-blue-400" />
        <StatBox label="Unchanged" value={totalUnchanged} color="text-neutral-600 dark:text-neutral-400" />
        <StatBox label="Failed" value={totalFailed} color="text-red-600 dark:text-red-400" />
        <StatBox label="Skipped (dup)" value={totalSkipped} color="text-amber-600 dark:text-amber-400" />
        <StatBox label="Duration" value={formatDuration(run.duration_seconds)} color="text-accent-600 dark:text-accent-400" isText />
      </div>

      {(run.total_cfr != null || run.total_scopus_active != null) && (
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          {run.total_cfr != null && <span>CFR: {run.total_cfr}</span>}
          {run.total_scopus_active != null && <span>Scopus Active: {run.total_scopus_active}</span>}
          {run.total_mjl_processed != null && <span>MJL: {run.total_mjl_processed}</span>}
          {run.total_scimago_processed != null && <span>SCImago: {run.total_scimago_processed}</span>}
        </div>
      )}
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  color,
  isText = false,
}: {
  label: string;
  value: number | string;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center">
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
        {label}
      </span>
      <span className={`block ${isText ? 'text-sm' : 'text-xl'} font-bold ${color}`}>
        {isText ? value : Number(value).toLocaleString()}
      </span>
    </div>
  );
}
