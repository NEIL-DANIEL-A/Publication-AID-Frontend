import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center pt-20">
        <div className="glass-card p-8 text-center">Event not found. <Link to="/" className="text-accent-600 underline">Go home</Link></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto glass-card p-6 sm:p-8 space-y-4">
        <Link to={`/${event.category}s`} className="text-xs text-accent-600 hover:underline">← Back to {event.category}s</Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{event.title}</h1>
        <p className="text-sm text-neutral-500">{event.organizer}{event.institution ? ` • ${event.institution}` : ''}</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <div><span className="text-neutral-400 text-xs uppercase">Location</span><p className="font-medium">{event.location} ({event.mode})</p></div>
          <div><span className="text-neutral-400 text-xs uppercase">Dates</span><p className="font-medium">{event.startDate} – {event.endDate}</p></div>
          <div><span className="text-neutral-400 text-xs uppercase">Registration Deadline</span><p className="font-medium">{event.registrationDeadline}</p></div>
          {event.submissionDeadline && <div><span className="text-neutral-400 text-xs uppercase">Submission Deadline</span><p className="font-medium">{event.submissionDeadline}</p></div>}
          {event.teamSize && <div><span className="text-neutral-400 text-xs uppercase">Team Size</span><p className="font-medium">{event.teamSize}</p></div>}
          {event.prize && <div><span className="text-neutral-400 text-xs uppercase">Prize</span><p className="font-medium">{event.prize}</p></div>}
          {event.duration && <div><span className="text-neutral-400 text-xs uppercase">Duration</span><p className="font-medium">{event.duration}</p></div>}
          {event.fee && <div><span className="text-neutral-400 text-xs uppercase">Fee</span><p className="font-medium">{event.fee}</p></div>}
        </div>
        <div className="flex gap-2 flex-wrap">{event.tags.map((t) => <span key={t} className="badge bg-accent-50 text-accent-600 text-xs">{t}</span>)}</div>
      </div>
    </div>
  );
}
