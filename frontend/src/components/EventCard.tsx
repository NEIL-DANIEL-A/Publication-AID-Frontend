import { useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Event } from '../types/event';
import { Badge, getFeeVariant } from './Badge';

// ── Icons ──────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function truncate(str: string | null, max: number): string {
  if (!str) return '—';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ── MetaRow ────────────────────────────────────────────────────
function MetaRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {icon}{label}
      </span>
      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

// ── Card component ─────────────────────────────────────────────
interface EventCardProps {
  event: Event;
  onViewDetail?: (id: string) => void;
}

export function EventCard({ event, onViewDetail }: EventCardProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleRegister() {
    if (!event.registration_url) return;
    window.open(event.registration_url, '_blank', 'noopener,noreferrer');
  }

  function handleCopyLink() {
    if (!event.registration_url) return;
    navigator.clipboard.writeText(event.registration_url).then(() => {
      toast.success('Link copied!');
    });
  }

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
      style={{ height: '420px' }}
      onClick={() => onViewDetail?.(event.id)}
      role={onViewDetail ? 'button' : 'article'}
      tabIndex={onViewDetail ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail?.(event.id)}
      aria-label={`${event.title} journal card`}
    >
      {/* ── Body (scrolls if needed, flex-grow) ── */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-h-0">

        {/* ── Badges row ── single line, no wrapping */}
        <div className="flex items-center gap-1.5 overflow-hidden shrink-0 flex-nowrap" style={{ height: '22px' }}>
          {event.platform && <Badge variant="platform">{event.platform}</Badge>}
          {event.mode && (
            <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 shrink-0">
              {event.mode}
            </span>
          )}
          {event.registration_fee && (
            <Badge variant={getFeeVariant(event.registration_fee)}>
              {event.registration_fee}
            </Badge>
          )}
        </div>

        {/* ── Title block ── fixed 72px = 2 lines of title + 1 line publisher */}
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

        {/* ── Divider ── */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 shrink-0" />

        {/* ── Meta grid ── fixed 4 rows: Coverage, CiteScore, Impact Factor, Subject Area */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 shrink-0">
          <MetaRow icon={<CalendarIcon />} label="Coverage"      value={formatDate(event.hackathon_date)} />
          <MetaRow                         label="CiteScore Yr"  value={formatDate(event.deadline)} />
          <MetaRow icon={<UsersIcon />}    label="Impact Factor" value={event.min_team_size ? `${event.min_team_size}` : '—'} />
          <MetaRow                         label="Subject Area"  value={truncate(event.eligibility, 26)} />
        </div>

        {/* ── SJR row (always rendered, blank if missing) ── */}
        <div className="shrink-0" style={{ height: '32px' }}>
          {event.venue ? (
            <MetaRow icon={<MapPinIcon />} label="SJR 2025" value={truncate(event.venue, 30)} />
          ) : (
            <MetaRow icon={<MapPinIcon />} label="SJR 2025" value="—" />
          )}
        </div>

      </div>

      {/* ── Footer pinned to bottom ── */}
      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2.5">
        {/* Quartile + copy */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            Quartile: {event.type || '—'}
          </span>
          {event.registration_url && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
              className="btn-ghost p-1.5"
              title="Copy link"
              aria-label="Copy journal link"
            >
              <CopyIcon />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetail?.(event.id); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold text-xs transition-colors"
            aria-label={`View details for ${event.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
          <button
            ref={btnRef}
            onClick={(e) => { e.stopPropagation(); handleRegister(); }}
            disabled={!event.registration_url}
            className="btn-accent justify-center py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            aria-label={`Search for ${event.title}`}
          >
            Search Journal
          </button>
        </div>
      </div>
    </motion.article>
  );
}
