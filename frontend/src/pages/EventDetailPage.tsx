import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvent } from '../hooks/useEvents';
import { Badge, getModeVariant, getFeeVariant } from '../components/Badge';
import { CountdownPill } from '../components/CountdownPill';
import { SkeletonCard } from '../components/SkeletonCard';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEvent(id ?? null);

  const event = data?.data;

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-6 -ml-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {isLoading && <SkeletonCard />}

        {isError && (
          <div className="glass-card p-8 text-center text-neutral-500">
            Failed to load event. <button onClick={() => navigate(-1)} className="text-accent-600 underline">Go back</button>
          </div>
        )}

        {event && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {event.platform && <Badge variant="platform">{event.platform}</Badge>}
              {event.mode     && <Badge variant={getModeVariant(event.mode)}>{event.mode}</Badge>}
              {event.registration_fee && <Badge variant={getFeeVariant(event.registration_fee)}>{event.registration_fee}</Badge>}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 leading-snug">
                {event.title}
              </h1>
              {event.organizer && (
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  Organized by <span className="font-medium text-neutral-700 dark:text-neutral-300">{event.organizer}</span>
                </p>
              )}
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800" />

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Time remaining:</span>
              <CountdownPill deadline={event.deadline} />
            </div>

            {/* Detail grid */}
            <dl className="grid sm:grid-cols-2 gap-5 text-sm">
              {[
                { label: 'Event Date', value: formatDate(event.hackathon_date) },
                { label: 'Registration Deadline', value: formatDate(event.deadline) },
                { label: 'Eligibility', value: event.eligibility },
                { label: 'Registration Fee', value: event.registration_fee },
                {
                  label: 'Team Size',
                  value: event.min_team_size || event.max_team_size
                    ? `${event.min_team_size ?? '?'} – ${event.max_team_size ?? '?'} members`
                    : null,
                },
                ...(event.mode !== 'Online' && event.venue
                  ? [{ label: 'Venue', value: event.venue }]
                  : []),
              ]
                .filter((item) => item.value)
                .map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">{label}</dt>
                    <dd className="text-neutral-800 dark:text-neutral-200 font-medium">{value}</dd>
                  </div>
                ))}
            </dl>

            <div className="border-t border-neutral-100 dark:border-neutral-800" />

            {/* Register CTA */}
            {event.registration_url ? (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center text-base py-3"
              >
                Register Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-sm text-neutral-400 text-center">No registration URL available.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
