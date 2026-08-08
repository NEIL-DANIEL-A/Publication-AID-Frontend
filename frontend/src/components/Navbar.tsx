import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// ── Dark mode logic ───────────────────────────────────────────
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

// ── Sun / Moon SVG icons ─────────────────────────────────────
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

const ShieldCheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ── Navbar ────────────────────────────────────────────────────
export function Navbar() {
  const [dark, setDark] = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
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
        {/* Logo / brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none"
          aria-label="OpportunityHub AI home"
        >
          <motion.div
            className="w-8 h-8 rounded-xl bg-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            OH
          </motion.div>
          <span className="font-bold text-neutral-900 dark:text-neutral-50 text-base tracking-tight">
            Opportunity<span className="gradient-text">Hub</span>
          </span>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-2">
          {/* Admin link shortcut in navbar for quick access */}
          {isAdmin && (
            <Link
              to="/admin/users"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                         bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300
                         border border-amber-200/60 dark:border-amber-800/40
                         hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all"
            >
              <ShieldCheckIcon /> Admin
            </Link>
          )}

          {/* Dark mode toggle */}
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

          {/* User profile dropdown / Login button */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl text-sm font-medium
                           bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60
                           hover:border-accent-400 dark:hover:border-accent-500 transition-all shadow-sm"
                aria-expanded={menuOpen}
              >
                <div className="w-6 h-6 rounded-lg bg-accent-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-medium text-xs text-neutral-800 dark:text-neutral-200">
                  {user.name}
                </span>
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-card-hover dark:shadow-card-hover-dark z-50 divide-y divide-neutral-100 dark:divide-neutral-800"
                  >
                    {/* User summary */}
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                        {user.username ? `@${user.username}` : user.email}
                        {user.roll_number ? ` · ${user.roll_number}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {/* Role badge */}
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}>
                          {user.role}
                        </span>
                        {/* User Type badge (Faculty / Student) */}
                        {user.user_type && (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.user_type === 'faculty'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}>
                            {user.user_type}
                          </span>
                        )}
                        {/* Auth provider indicator */}
                        {user.auth_provider === 'google' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/80 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin/users"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <ShieldCheckIcon /> User Management
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                      >
                        <LogoutIcon /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-xs">Log in</Link>
              <Link to="/signup" className="btn-accent text-xs px-3 py-1.5">Sign up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Active page indicator line */}
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
