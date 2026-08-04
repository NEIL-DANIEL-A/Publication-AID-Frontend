import React from 'react';
import type { EventType } from '../types/event';

type BadgeVariant =
  | 'accent'
  | 'neutral'
  | 'online'
  | 'offline'
  | 'hybrid'
  | 'free'
  | 'paid'
  | 'platform'
  | 'hackathon'
  | 'workshop'
  | 'conference'
  | 'competition';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent:      'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  neutral:     'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  online:      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  offline:     'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  hybrid:      'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  free:        'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  paid:        'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  platform:    'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400',
  hackathon:   'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40',
  workshop:    'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40',
  conference:  'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40',
  competition: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40',
};

export function Badge({ children, variant = 'neutral', className = '', icon }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {icon && <span className="opacity-80">{icon}</span>}
      {children}
    </span>
  );
}

/** Helper: map mode string → badge variant */
export function getModeVariant(mode: string | null): BadgeVariant {
  if (mode === 'Online')  return 'online';
  if (mode === 'Offline') return 'offline';
  if (mode === 'Hybrid')  return 'hybrid';
  return 'neutral';
}

/** Helper: map fee string → badge variant */
export function getFeeVariant(fee: string | null): BadgeVariant {
  if (!fee) return 'neutral';
  return fee.toLowerCase().includes('free') ? 'free' : 'paid';
}

/** Helper: map event type → badge variant */
export function getTypeVariant(type: EventType | string | null): BadgeVariant {
  if (type === 'Hackathon')   return 'hackathon';
  if (type === 'Workshop')    return 'workshop';
  if (type === 'Conference')  return 'conference';
  if (type === 'Competition') return 'competition';
  return 'neutral';
}

export function getTypeIcon(type: EventType | string | null): React.ReactNode {
  if (type === 'Hackathon') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12M6 3h12l-1 7a5 5 0 01-10 0L6 3z" />
      </svg>
    );
  }
  if (type === 'Workshop') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  if (type === 'Conference') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  }
  if (type === 'Competition') {
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  }
  return null;
}
