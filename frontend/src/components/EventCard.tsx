import { useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Event } from '../types/event';
import { Badge, getModeVariant, getFeeVariant, getTypeVariant, getTypeIcon } from './Badge';
import { CountdownPill } from './CountdownPill';

// ── Icons (inline SVG, no icon lib dependency) ────────────────
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function truncate(str: string | null, max: number): string {
  if (!str) return '—';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ── Card component ────────────────────────────────────────────
interface EventCardProps {
  event: Event;
  onViewDetail?: (id: string) => void;
}

export function EventCard({ event, onViewDetail }: EventCardProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const showVenue = (event.mode === 'Offline' || event.mode === 'Hybrid') && event.venue;

  const teamSize =
    event.min_team_size && event.max_team_size
      ? event.min_team_size === event.max_team_size
        ? `${event.min_team_size} members`
        : `${event.min_team_size}–${event.max_team_size} members`
      : event.min_team_size
      ? `${event.min_team_size}+ members`
      : event.max_team_size
      ? `Up to ${event.max_team_size}`
      : null;

  function handleRegister() {
    if (!event.registration_url) return;
    window.open(event.registration_url, '_blank', 'noopener,noreferrer');
  }

  function handleCopyLink() {
    if (!event.registration_url) return;
    navigator.clipboard.writeText(event.registration_url).then(() => {
      toast.success('Link copied to clipboard!');
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass-card p-5 flex flex-col gap-4 cursor-default group hover:shadow-card-hover dark:hover:shadow-card-hover-dark hover:border-accent-200 dark:hover:border-accent-800 transition-all duration-300"
      onClick={() => onViewDetail?.(event.id)}
      role={onViewDetail ? 'button' : 'article'}
      tabIndex={onViewDetail ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail?.(event.id)}
      aria-label={`${event.title} event card`}
    >
      {/* ── Badges row ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {event.type && (
          <Badge variant={getTypeVariant(event.type)} icon={getTypeIcon(event.type)}>
            {event.type}
          </Badge>
        )}
        {event.platform && (
          <Badge variant="platform">{event.platform}</Badge>
        )}
        {event.mode && (
          <Badge variant={getModeVariant(event.mode)}>{event.mode}</Badge>
        )}
        {event.registration_fee && (
          <Badge variant={getFeeVariant(event.registration_fee)}>
            {event.registration_fee}
          </Badge>
        )}
      </div>

      {/* ── Title ── */}
      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 text-base leading-snug group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
          {event.title}
        </h3>
        {event.organizer && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {truncate(event.organizer, 50)}
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-neutral-100 dark:border-neutral-800" />

      {/* ── Meta grid ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        {/* Event Date */}
        <div className="flex flex-col gap-0.5">
          <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium text-[10px] flex items-center gap-1">
            <CalendarIcon /> Event Date
          </span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {formatDate(event.hackathon_date)}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-0.5">
          <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium text-[10px]">
            Deadline
          </span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {formatDate(event.deadline)}
          </span>
        </div>

        {/* Team Size */}
        {teamSize && (
          <div className="flex flex-col gap-0.5">
            <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium text-[10px] flex items-center gap-1">
              <UsersIcon /> Team Size
            </span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              {teamSize}
            </span>
          </div>
        )}

        {/* Eligibility */}
        {event.eligibility && (
          <div className="flex flex-col gap-0.5 col-span-2">
            <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium text-[10px]">
              Eligibility
            </span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate" title={event.eligibility}>
              {truncate(event.eligibility, 40)}
            </span>
          </div>
        )}

        {/* Venue (conditional) */}
        {showVenue && (
          <div className="flex flex-col gap-0.5 col-span-2">
            <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wide font-medium text-[10px] flex items-center gap-1">
              <MapPinIcon /> Venue
            </span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate" title={event.venue ?? ''}>
              {truncate(event.venue, 45)}
            </span>
          </div>
        )}
      </div>

      {/* ── Countdown pill ── */}
      <div className="flex items-center justify-between">
        <CountdownPill deadline={event.deadline} />
        {event.registration_url && (
          <button
            onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
            className="btn-ghost text-xs p-1.5"
            title="Copy registration link"
            aria-label="Copy registration link"
          >
            <CopyIcon />
          </button>
        )}
      </div>

      {/* ── Register button ── */}
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); handleRegister(); }}
        disabled={!event.registration_url}
        className="btn-accent w-full justify-center mt-auto disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        aria-label={`Register for ${event.title}`}
      >
        Register
        <ExternalLinkIcon />
      </button>
    </motion.article>
  );
}
