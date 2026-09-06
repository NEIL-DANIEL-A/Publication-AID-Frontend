import { motion } from 'framer-motion';
import type { Event } from '../types/event';
import { Badge } from './Badge';

function truncate(str: string | null, max: number): string {
  if (!str) return '—';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

interface EventCardProps {
  event: Event;
  onViewDetail?: (id: string) => void;
}

export function EventCard({ event, onViewDetail }: EventCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="glass-card flex flex-col cursor-default group hover:shadow-card-hover dark:hover:shadow-card-hover-dark hover:border-accent-200 dark:hover:border-accent-800 transition-all duration-300 overflow-hidden"
      style={{ height: '380px' }}
      onClick={() => onViewDetail?.(event.id)}
      role={onViewDetail ? 'button' : 'article'}
      tabIndex={onViewDetail ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail?.(event.id)}
      aria-label={`${event.title} journal card`}
    >
      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-h-0">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 overflow-hidden shrink-0 flex-nowrap" style={{ height: '22px' }}>
          {event.platform && <Badge variant="platform">{event.platform}</Badge>}
          {event.quartile && (
            <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-bold ${
              event.quartile === 'Q1' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50' :
              event.quartile === 'Q2' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50' :
              event.quartile === 'Q3' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50' :
              'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
            }`}>
              {event.quartile}
            </span>
          )}
          {event.mode && (
            <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 shrink-0">
              {event.mode}
            </span>
          )}
        </div>

        {/* Title block */}
        <div className="shrink-0" style={{ height: '72px' }}>
          <h3
            className="font-bold text-neutral-900 dark:text-neutral-50 text-[15px] leading-snug group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              maxHeight: '2.6em',
            }}
            title={event.title}
          >
            {event.title}
          </h3>
          <p
            className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mt-1 truncate"
            title={event.organizer ?? ''}
          >
            {event.organizer || '—'}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-neutral-800 shrink-0" />

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 shrink-0">
          <MetaRow label="ISSN" value={event.issn ? truncate(event.issn, 14) : '—'} mono />
          <MetaRow label="E-ISSN" value={event.e_issn ? truncate(event.e_issn, 14) : '—'} mono />
          <MetaRow label="SJR 2025" value={truncate(event.sjr_2025 ?? event.venue, 16)} />
          <MetaRow label="H-Index" value={event.h_index ?? '—'} />
        </div>

        {/* Coverage */}
        <div className="shrink-0" style={{ height: '32px' }}>
          <MetaRow label="Coverage" value={truncate(event.coverage ?? event.hackathon_date, 30)} />
        </div>
      </div>

      {/* Footer pinned to bottom */}
      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2.5">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetail?.(event.id); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-700 font-semibold text-xs transition-colors border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Details
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (event.registration_url) window.open(event.registration_url, '_blank', 'noopener,noreferrer'); }}
            disabled={!event.registration_url}
            className="btn-accent justify-center py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            SCImago
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function MetaRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </span>
      <span className={`text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate ${mono ? 'font-mono' : ''}`} title={value}>
        {value}
      </span>
    </div>
  );
}
