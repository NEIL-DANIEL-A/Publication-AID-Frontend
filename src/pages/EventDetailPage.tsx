import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvent } from '../hooks/useEvents';
import { mapJournalToEvent } from '../hooks/useEvents';
import { SkeletonCard } from '../components/SkeletonCard';
import type { JournalWithRelations } from '../types/journal';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: journal, isLoading, isError } = useEvent(id ?? null);

  const event = journal ? mapJournalToEvent(journal as JournalWithRelations) : null;

  return (
    <div className="min-h-screen bg-mesh pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
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
            Failed to load journal. <button onClick={() => navigate(-1)} className="text-accent-600 underline">Go back</button>
          </div>
        )}

        {event && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {event.platform && (
                <span className="badge bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  {event.platform}
                </span>
              )}
              {event.quartile && (
                <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {event.quartile}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 leading-snug">
                {event.title}
              </h1>
              {event.organizer && (
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  Publisher: <span className="font-medium text-neutral-700 dark:text-neutral-300">{event.organizer}</span>
                </p>
              )}
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800" />

            <dl className="grid sm:grid-cols-2 gap-5 text-sm">
              {[
                { label: 'SJR 2025', value: event.sjr_2025 },
                { label: 'H-Index', value: event.h_index },
                { label: 'Quartile', value: event.quartile },
                { label: 'Coverage', value: event.coverage },
                { label: 'ISSN', value: event.issn },
                { label: 'E-ISSN', value: event.e_issn },
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

            {event.registration_url ? (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center text-base py-3"
              >
                View on SCImago
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-sm text-neutral-400 text-center">No SCImago URL available.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
