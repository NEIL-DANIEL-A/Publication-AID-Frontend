import { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { CategoryEventCard } from '../components/CategoryEventCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { getEvents, paginate } from '../services/eventService';
import type { Category } from '../types/categoryEvent';

const META: Record<Category, { title: string; desc: string; placeholder: string }> = {
  hackathon: { title: 'Hackathons', desc: 'Discover hackathons, coding challenges and innovation competitions.', placeholder: 'Search hackathons...' },
  symposium: { title: 'Symposiums', desc: 'Explore academic symposiums, research discussions and knowledge-sharing events.', placeholder: 'Search symposiums...' },
  conference: { title: 'Conferences', desc: 'Find academic and professional conferences across different fields and locations.', placeholder: 'Search conferences...' },
  workshop: { title: 'Workshops', desc: 'Discover workshops, hands-on sessions and technical learning opportunities.', placeholder: 'Search workshops...' },
};

export function CategoryPage({ category }: { category: Category }) {
  const meta = META[category];
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const filtered = useMemo(() => getEvents(category, search, { mode, status }), [category, search, mode, status]);
  const { data, total } = useMemo(() => paginate(filtered, page, limit), [filtered, page]);

  return (
    <div className="min-h-screen bg-mesh">
      <main className="px-4 sm:px-6 max-w-7xl mx-auto pb-16 pt-20 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">{meta.title}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">{meta.desc}</p>
        </div>

        <div className="flex justify-center">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} isLoading={false} />
        </div>

        <div className="glass-card p-3 flex flex-wrap gap-2">
          <select value={mode} onChange={(e) => { setMode(e.target.value); setPage(1); }} className="px-3 py-1.5 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <option value="">All Modes</option><option>Online</option><option>Offline</option><option>Hybrid</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-1.5 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <option value="">All Status</option><option>Open</option><option>Upcoming</option><option>Closed</option>
          </select>
          {(mode || status || search) && <button onClick={() => { setMode(''); setStatus(''); setSearch(''); setPage(1); }} className="text-xs text-accent-600 hover:underline">Reset</button>}
          <span className="ml-auto text-xs text-neutral-400">{total} events</span>
        </div>

        {data.length === 0 ? (
          <EmptyState hasFilters={!!(search || mode || status)} onClearFilters={() => { setSearch(''); setMode(''); setStatus(''); setPage(1); }} />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((e) => <CategoryEventCard key={e.id} event={e} />)}
            </div>
            <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}
