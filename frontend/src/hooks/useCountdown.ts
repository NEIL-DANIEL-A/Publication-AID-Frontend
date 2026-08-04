import { useEffect, useState } from 'react';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalMs: number;
}

/**
 * Live countdown to a given deadline string (ISO timestamp).
 * Updates every minute by default (set `tickSeconds` for finer granularity).
 */
export function useCountdown(deadline: string | null, tickSeconds = 60): CountdownParts {
  const compute = (): CountdownParts => {
    if (!deadline) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMs: 0 };
    }
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMs: diff };
    }
    const totalSeconds = Math.floor(diff / 1000);
    return {
      days:    Math.floor(totalSeconds / 86400),
      hours:   Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isPast:  false,
      totalMs: diff,
    };
  };

  const [parts, setParts] = useState<CountdownParts>(compute);

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => setParts(compute()), tickSeconds * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline, tickSeconds]);

  return parts;
}

/** Returns urgency level based on ms remaining */
export function getUrgency(totalMs: number): 'high' | 'medium' | 'low' | 'none' {
  if (totalMs <= 0)                   return 'none';
  if (totalMs < 24 * 60 * 60 * 1000) return 'high';   // < 24h
  if (totalMs < 3 * 24 * 60 * 60 * 1000) return 'medium'; // < 3 days
  if (totalMs < 7 * 24 * 60 * 60 * 1000) return 'low';    // < 7 days
  return 'none';
}
