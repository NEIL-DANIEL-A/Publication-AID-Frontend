import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecentChanges } from '../hooks/useEvents';

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark] as const;
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export function Navbar() {
  const [dark, setDark] = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: recentChanges } = useRecentChanges(20);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasUpdates = (recentChanges?.length ?? 0) > 0;

  function handleNotifClick(journalId: string, fieldName: string) {
    setNotifOpen(false);
    navigate(`/events/${journalId}?highlight=${fieldName}`);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'h-14' : 'h-16'
      }`}>
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none"
          aria-label="Publication-AID home"
        >
          <motion.div
            className="w-8 h-8 rounded-xl bg-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PA
          </motion.div>
          <span className="font-bold text-neutral-900 dark:text-neutral-50 text-base tracking-tight">
            Publication<span className="gradient-text">AID</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex items-center gap-1">
            {([
              { to: '/hackathons', label: 'Hackathons' },
              { to: '/symposiums', label: 'Symposiums' },
              { to: '/conferences', label: 'Conferences' },
              { to: '/workshops', label: 'Workshops' },
            ] as const).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname.startsWith(item.to)
                    ? 'bg-accent-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              location.pathname === '/admin'
                ? 'bg-accent-600 text-white border-accent-600'
                : 'bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin
          </Link>

          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <motion.button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center
                         text-neutral-500 dark:text-neutral-400
                         hover:bg-neutral-100 dark:hover:bg-neutral-800
                         transition-colors duration-150"
              aria-label="Updates"
              whileTap={{ scale: 0.9 }}
            >
              <BellIcon />
              {hasUpdates && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900" />
              )}
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">Updates</span>
                    <span className="text-[11px] text-neutral-400">{recentChanges?.length ?? 0} changes</span>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {!recentChanges || recentChanges.length === 0 ? (
                      <div className="p-8 text-center text-sm text-neutral-400 dark:text-neutral-500">
                        No recent updates
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {recentChanges.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleNotifClick(c.journal_id, c.field_name)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex flex-col gap-1"
                          >
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                              {c.journal_title ?? c.journal_id.slice(0, 8)}
                            </span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                                {c.source}
                              </span>
                              <span className="font-medium">{c.field_name}</span>
                              <span className="line-through text-red-400">{c.old_value ?? '—'}</span>
                              <span>→</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{c.new_value ?? '—'}</span>
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(c.changed_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={() => setDark((d) => !d)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center
                       text-neutral-500 dark:text-neutral-400
                       hover:bg-neutral-100 dark:hover:bg-neutral-800
                       transition-colors duration-150"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={dark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {location.pathname === '/' && (
        <motion.div
          className="h-0.5 bg-gradient-to-r from-accent-500 to-violet-500 absolute bottom-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </header>
  );
}
