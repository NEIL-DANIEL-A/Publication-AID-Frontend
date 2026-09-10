import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEvent, useJournalChanges } from '../hooks/useEvents';
import { mapJournalToEvent } from '../hooks/useEvents';
import { SkeletonCard } from '../components/SkeletonCard';
import type { JournalWithRelations, JournalChange } from '../types/journal';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightField = searchParams.get('highlight');
  const { data: journal, isLoading, isError } = useEvent(id ?? null);
  const { data: changes } = useJournalChanges(id ?? null);

  const event = journal ? mapJournalToEvent(journal as JournalWithRelations) : null;

  const latestChanges = useMemo(() => {
    if (!changes) return {} as Record<string, JournalChange>;
    const map: Record<string, JournalChange> = {};
    changes.forEach((c) => {
      if (c.field_name === 'data_hash') return;
      if (!map[c.field_name]) map[c.field_name] = c;
    });
    return map;
  }, [changes]);

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
                { label: 'SJR 2025', value: event.sjr_2025, field: 'sjr' },
                { label: 'H-Index', value: event.h_index, field: 'h_index' },
                { label: 'Quartile', value: event.quartile, field: 'quartile' },
                { label: 'Coverage', value: event.coverage, field: 'coverage' },
                { label: 'ISSN', value: event.issn, field: 'print_issn' },
                { label: 'E-ISSN', value: event.e_issn, field: 'e_issn' },
              ]
                .filter((item) => item.value)
                .map(({ label, value, field }) => {
                  const change = latestChanges[field];
                  const isHighlighted = highlightField === field;
                  return (
                    <div
                      key={label}
                      className={`flex flex-col gap-0.5 rounded-lg p-2 -m-2 transition-colors ${
                        isHighlighted ? 'bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-300 dark:ring-amber-700' : ''
                      }`}
                    >
                      <dt className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">{label}</dt>
                      <dd className="text-neutral-800 dark:text-neutral-200 font-medium">{value}</dd>
                      {change && (
                        <span className="flex items-center gap-1 text-[11px] mt-0.5">
                          <span className="line-through text-red-400 dark:text-red-500">{change.old_value ?? '—'}</span>
                          <span className="text-neutral-400">→</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{change.new_value ?? '—'}</span>
                          <span className="text-neutral-400 ml-1">{new Date(change.changed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      )}
                    </div>
                  );
                })}
            </dl>

            {(event.apc_results?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">APC — Article Processing Charges</h3>
                {(() => {
                  const apcCs = (changes ?? []).filter((c) => c.source === 'apc');
                  return apcCs.length > 0 ? (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-2 space-y-1 text-[11px]">
                      {apcCs.map((c) => (
                        <div key={c.id} className="flex flex-wrap gap-1 items-center">
                          <span className="font-semibold text-amber-800 dark:text-amber-300">{c.field_name}</span>
                          <span className="line-through text-red-500">{c.old_value || '—'}</span>
                          <span>→</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold break-all">{c.new_value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
                <div className="hidden sm:block rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-neutral-800/60 text-[11px] uppercase tracking-wider text-neutral-500">
                      <tr><th className="px-3 py-2 text-left">Publisher</th><th className="px-3 py-2 text-left">Cost</th><th className="px-3 py-2 text-left">Currency</th><th className="px-3 py-2 text-left">Mode</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {event.apc_results!.map((a) => (
                        <tr key={a.id}>
                          <td className="px-3 py-2 font-medium">{a.publisher}</td>
                          <td className="px-3 py-2 font-bold text-accent-600 dark:text-accent-400">{a.apc_value ?? '—'}</td>
                          <td className="px-3 py-2"><span className="badge bg-violet-50 text-violet-700 text-[10px]">{a.apc_currency ?? '—'}</span></td>
                          <td className="px-3 py-2"><span className="badge bg-amber-50 text-amber-700 text-[10px]">{a.apc_mode_normalized ?? a.apc_mode_raw ?? '—'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden space-y-2">
                  {event.apc_results!.map((a) => (
                    <div key={a.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 space-y-2 bg-slate-50/50 dark:bg-neutral-800/30">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Publisher</span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{a.publisher}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-white dark:bg-neutral-900 p-2 border border-neutral-100 dark:border-neutral-800">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Cost</div>
                          <div className="text-sm font-bold text-accent-600 dark:text-accent-400">{a.apc_value ?? '—'}</div>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-neutral-900 p-2 border border-neutral-100 dark:border-neutral-800">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Currency</div>
                          <div className="text-xs font-bold text-violet-700 dark:text-violet-300">{a.apc_currency ?? '—'}</div>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-neutral-900 p-2 border border-neutral-100 dark:border-neutral-800">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Mode</div>
                          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 truncate">{a.apc_mode_normalized ?? a.apc_mode_raw ?? '—'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
