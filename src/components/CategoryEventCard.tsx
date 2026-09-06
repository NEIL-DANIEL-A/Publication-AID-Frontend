import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { CategoryEvent } from '../types/categoryEvent';

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function CategoryEventCard({ event }: { event: CategoryEvent }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="badge bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px]">{event.mode}</span>
        <span className={`badge text-[10px] ${event.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : event.status === 'Upcoming' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-neutral-100 text-neutral-500'}`}>{event.status}</span>
        {event.tags.slice(0, 2).map((t) => (
          <span key={t} className="badge bg-accent-50 text-accent-600 text-[10px]">{t}</span>
        ))}
      </div>

      <h3 className="font-bold text-neutral-900 dark:text-neutral-50 leading-snug line-clamp-2">{event.title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{event.organizer}{event.institution ? ` • ${event.institution}` : ''}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400"><span>📅</span> {fmt(event.startDate)} {event.endDate !== event.startDate ? `– ${fmt(event.endDate)}` : ''}</span>
        <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 truncate"><span>📍</span> {event.location}</span>
        {event.teamSize && <span className="text-neutral-600 dark:text-neutral-400">👥 Team: {event.teamSize}</span>}
        {event.prize && <span className="text-neutral-600 dark:text-neutral-400">🏆 {event.prize}</span>}
        {event.duration && <span className="text-neutral-600 dark:text-neutral-400">⏱ {event.duration}</span>}
        {event.fee && <span className="text-neutral-600 dark:text-neutral-400">💰 {event.fee}</span>}
        {event.level && <span className="text-neutral-600 dark:text-neutral-400">Level: {event.level}</span>}
        {event.researchArea && <span className="text-neutral-600 dark:text-neutral-400 col-span-2">🔬 {event.researchArea}</span>}
      </div>

      <p className="text-[11px] text-neutral-400">Registration closes: {fmt(event.registrationDeadline)}</p>

      <Link to={`/${event.category}s/${event.id}`} className="btn-accent justify-center py-2 text-xs mt-auto">View Details</Link>
    </motion.article>
  );
}
