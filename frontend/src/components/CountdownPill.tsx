import { useCountdown, getUrgency } from '../hooks/useCountdown';

interface CountdownPillProps {
  deadline: string | null;
  showLabel?: boolean;
}

export function CountdownPill({ deadline, showLabel = true }: CountdownPillProps) {
  const { days, hours, minutes, isPast, totalMs } = useCountdown(deadline);
  const urgency = getUrgency(totalMs);

  if (!deadline) return null;

  if (isPast) {
    return (
      <span className="badge bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 text-xs">
        Deadline passed
      </span>
    );
  }

  const urgencyStyles = {
    high:   'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
    medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
    low:    'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    none:   'bg-neutral-50 text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-400',
  };

  const dotStyles = {
    high:   'bg-red-500',
    medium: 'bg-amber-500',
    low:    'bg-yellow-500',
    none:   'bg-neutral-400',
  };

  const label = days > 0
    ? `${days}d ${hours}h left`
    : hours > 0
    ? `${hours}h ${minutes}m left`
    : `${minutes}m left`;

  return (
    <span
      className={`badge gap-1.5 font-medium text-xs ${urgencyStyles[urgency]}`}
      title={deadline ? new Date(deadline).toLocaleString() : ''}
    >
      <span
        className={`dot-pulse w-1.5 h-1.5 rounded-full ${dotStyles[urgency]} ${urgency === 'high' ? 'animate-pulse' : ''}`}
      />
      {showLabel && label}
    </span>
  );
}
