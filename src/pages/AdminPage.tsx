import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePipelineRun, useAllPipelineRuns, useAllChanges } from '../hooks/useEvents';
import { PipelineStatusCard } from '../components/PipelineStatusCard';
import { Pagination } from '../components/Pagination';

type Tab = 'pipeline' | 'changes';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const { data: latestRun } = usePipelineRun();

  return (
    <div className="min-h-screen bg-mesh">
      <main className="px-4 sm:px-6 max-w-7xl mx-auto pb-16 pt-20 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-600 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Admin</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Pipeline & change history</p>
          </div>
        </div>

        {/* Latest run */}
        {latestRun && <PipelineStatusCard run={latestRun} />}

        {/* Tabs */}
        <div className="glass-card p-1.5 flex gap-1.5 w-fit">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Pipeline History
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'changes'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            All Changes
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'pipeline' ? <PipelineHistoryTab /> : <ChangesHistoryTab />}
      </main>
    </div>
  );
}

function PipelineHistoryTab() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useAllPipelineRuns(page, limit);
  const runs = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading) return <div className="glass-card p-8 text-center text-sm text-neutral-400">Loading...</div>;
  if (runs.length === 0) return <div className="glass-card p-8 text-center text-sm text-neutral-400">No pipeline runs yet</div>;

  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <th className="px-4 py-2.5 text-left font-semibold">Started</th>
                <th className="px-4 py-2.5 text-left font-semibold">Status</th>
                <th className="px-4 py-2.5 text-center font-semibold">New</th>
                <th className="px-4 py-2.5 text-center font-semibold">Updated</th>
                <th className="px-4 py-2.5 text-center font-semibold">Unchanged</th>
                <th className="px-4 py-2.5 text-center font-semibold">Failed</th>
                <th className="px-4 py-2.5 text-center font-semibold">Skipped</th>
                <th className="px-4 py-2.5 text-center font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                    {new Date(run.started_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                      run.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      run.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{run.new_records}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">{run.updated_records}</td>
                  <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">{run.unchanged_records}</td>
                  <td className="px-4 py-3 text-center font-semibold text-red-600 dark:text-red-400">{run.failed_records}</td>
                  <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">{run.duplicate_skipped}</td>
                  <td className="px-4 py-3 text-center text-neutral-500 whitespace-nowrap">
                    {run.duration_seconds != null ? `${Math.floor(run.duration_seconds / 60)}m ${Math.round(run.duration_seconds % 60)}s` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
    </div>
  );
}

function ChangesHistoryTab() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useAllChanges(page, limit);
  const navigate = useNavigate();
  const changes = data?.data ?? [];
  const total = data?.total ?? 0;

  if (isLoading) return <div className="glass-card p-8 text-center text-sm text-neutral-400">Loading...</div>;
  if (changes.length === 0) return <div className="glass-card p-8 text-center text-sm text-neutral-400">No changes yet</div>;

  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {changes.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 flex items-start gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/events/${c.journal_id}?highlight=${c.field_name}`)}
            >
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase shrink-0 mt-0.5">
                {c.source}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{c.journal_title ?? c.journal_id.slice(0, 8)}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium">{c.field_name}</span>
                  <span className="line-through text-red-400 dark:text-red-500">{c.old_value ?? '—'}</span>
                  <span>→</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{c.new_value ?? '—'}</span>
                </p>
              </div>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 whitespace-nowrap">
                {new Date(c.changed_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}
