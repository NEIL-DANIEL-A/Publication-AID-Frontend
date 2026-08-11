import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Event } from '../types/event';
import { Badge, getModeVariant, getFeeVariant, getTypeVariant, getTypeIcon } from './Badge';

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

  const searchUrl = journal.registration_url || `https://www.google.com/search?q=${encodeURIComponent(journal.title)}`;

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
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
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
              {journal.type && (
                <Badge variant={getTypeVariant(journal.type)} icon={getTypeIcon(journal.type)}>
                  Quartile {journal.type}
                </Badge>
              )}
              {journal.platform && <Badge variant="platform">{journal.platform}</Badge>}
              {journal.mode && <Badge variant={getModeVariant(journal.mode)}>{journal.mode}</Badge>}
              {journal.registration_fee && (
                <Badge variant={getFeeVariant(journal.registration_fee)}>{journal.registration_fee}</Badge>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
              {journal.title}
            </h2>

            {journal.organizer && (
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Publisher: <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{journal.organizer}</span>
              </p>
            )}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Impact Factor */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Impact Factor
              </span>
              <span className="block text-xl font-bold text-accent-600 dark:text-accent-400">
                {journal.min_team_size ?? 'N/A'}
              </span>
            </div>

            {/* CiteScore Year */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                CiteScore Year
              </span>
              <span className="block text-base font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {journal.deadline ?? 'N/A'}
              </span>
            </div>

            {/* SJR 2025 */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                SJR 2025
              </span>
              <span className="block text-base font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {journal.sjr_2025 || journal.venue || 'N/A'}
              </span>
            </div>

            {/* H-Index */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                H-Index
              </span>
              <span className="block text-base font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {journal.h_index ?? 'N/A'}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden text-xs">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {/* Subject Area */}
              <div className="p-3 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Subject Area / Scope</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 sm:text-right">
                  {journal.eligibility || 'Multidisciplinary'}
                </span>
              </div>

              {/* Coverage */}
              <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Coverage Years</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {journal.coverage || journal.hackathon_date || 'N/A'}
                </span>
              </div>

              {/* ISSN / E-ISSN */}
              <div className="p-3 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">ISSN / E-ISSN</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">
                  {journal.issn || 'N/A'} {journal.e_issn ? `/ ${journal.e_issn}` : ''}
                </span>
              </div>

              {/* APC / Fee */}
              <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">APC Fee Details</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {journal.registration_fee || 'Subscription / Standard APC'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex-1 justify-center py-2.5 text-sm font-semibold shadow-sm"
            >
              Search Journal Web Page
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
