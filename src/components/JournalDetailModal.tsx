import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Event } from '../types/event';
import type { JournalWithRelations, JournalChange } from '../types/journal';
import { useJournalChanges } from '../hooks/useEvents';
import { Badge } from './Badge';

const MJL_FULL_FORM: Record<string, string> = {
  SCIE: 'Science Citation Index Expanded',
  SSCI: 'Social Sciences Citation Index',
  AHCI: 'Arts & Humanities Citation Index',
  ESCI: 'Emerging Sources Citation Index',
};

function mjlIndexFull(val: string | null | undefined): string {
  if (!val) return 'Not checked';
  return MJL_FULL_FORM[val] ?? val;
}

interface JournalDetailModalProps {
  journal: Event | null;
  onClose: () => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({ journal, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (journal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [journal, onClose]);

  if (!journal) return null;

  const j = journal._journal as JournalWithRelations | undefined;
  const scopus = j?.scopus_results;
  const mjl = j?.mjl_results;
  const scimago = j?.scimago_results;
  const cfr = j?.cfr_results;

  const searchUrl = scimago?.url || `https://www.google.com/search?q=${encodeURIComponent(journal.title)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 z-10 space-y-5 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="space-y-3 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              {journal.quartile && (
                <Badge variant="neutral">
                  {journal.quartile}
                </Badge>
              )}
              {journal.platform && <Badge variant="platform">{journal.platform}</Badge>}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
              {journal.title}
            </h2>

            {(journal.organizer || cfr?.publisher) && (
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Publisher: <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{journal.organizer || cfr?.publisher}</span>
              </p>
            )}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricBox label="SJR 2025" value={scimago?.sjr ?? journal.sjr_2025 ?? 'N/A'} />
            <MetricBox label="H-Index" value={scimago?.h_index ?? journal.h_index ?? 'N/A'} />
            <MetricBox label="Quartile" value={scimago?.quartile ?? journal.quartile ?? 'N/A'} />
            <MetricBox label="Coverage" value={scimago?.coverage ?? journal.coverage ?? 'N/A'} />
          </div>

          {/* Source Breakdown with inline changes */}
          <DetailRowSection journalId={j?.id} journal={journal} scopus={scopus ?? null} mjl={mjl ?? null} scimago={scimago ?? null} cfr={cfr ?? null} />

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex-1 justify-center py-2.5 text-sm font-semibold shadow-sm"
            >
              {scimago?.url ? 'View on SCImago' : 'Search Journal'}
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function DetailRowSection({
  journalId,
  journal,
  scopus,
  mjl,
  scimago,
  cfr,
}: {
  journalId: string | undefined;
  journal: Event;
  scopus: JournalWithRelations['scopus_results'];
  mjl: JournalWithRelations['mjl_results'];
  scimago: JournalWithRelations['scimago_results'];
  cfr: JournalWithRelations['cfr_results'];
}) {
  const { data: changes } = useJournalChanges(journalId ?? null);

  const latestChanges = useMemo(() => {
    if (!changes) return {};
    const map: Record<string, JournalChange> = {};
    changes.forEach((c) => {
      if (c.field_name === 'data_hash') return;
      if (!map[c.field_name]) map[c.field_name] = c;
    });
    return map;
  }, [changes]);

  function ChangeIndicator({ fieldName }: { fieldName: string }) {
    const change = latestChanges[fieldName];
    if (!change) return null;
    return (
      <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
        <span className="line-through text-red-400 dark:text-red-500">{change.old_value ?? '—'}</span>
        <span className="text-neutral-400">→</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{change.new_value ?? '—'}</span>
        <span className="text-neutral-300 dark:text-neutral-600">
          {new Date(change.changed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Source Verification Breakdown
      </h3>

      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden text-xs">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <DetailRow
            label="ISSN / E-ISSN"
            value={`${journal.issn || 'N/A'}${journal.e_issn ? ` / ${journal.e_issn}` : ''}`}
            mono
          />

          <DetailRow
            label="Scopus Status"
            value={scopus?.scopus_status ?? 'Not checked'}
            highlight={scopus?.scopus_status?.includes('Active') ?? false}
            change={<ChangeIndicator fieldName="scopus_status" />}
          />

          <DetailRow
            label="MJL Index"
            value={mjlIndexFull(mjl?.mjl_index)}
            highlight={!!mjl?.mjl_index}
            change={<ChangeIndicator fieldName="mjl_index" />}
          />

          <DetailRow
            label="SCImago SJR"
            value={scimago?.sjr ?? '—'}
            change={<ChangeIndicator fieldName="sjr" />}
          />
          <DetailRow
            label="SCImago H-Index"
            value={scimago?.h_index ?? '—'}
            change={<ChangeIndicator fieldName="h_index" />}
          />
          <DetailRow
            label="SCImago Coverage"
            value={scimago?.coverage ?? '—'}
            change={<ChangeIndicator fieldName="coverage" />}
          />

          <DetailRow
            label="Country"
            value={cfr?.country ?? '—'}
            change={<ChangeIndicator fieldName="country" />}
          />
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center space-y-1">
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </span>
      <span className="block text-base font-bold text-accent-600 dark:text-accent-400 truncate">
        {value}
      </span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  highlight = false,
  change,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  change?: React.ReactNode;
}) {
  return (
    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
      <div>
        <span className="font-semibold text-neutral-500 dark:text-neutral-400">{label}</span>
        {change}
      </div>
      <span className={`font-medium sm:text-right ${
        highlight ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-800 dark:text-neutral-200'
      } ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
