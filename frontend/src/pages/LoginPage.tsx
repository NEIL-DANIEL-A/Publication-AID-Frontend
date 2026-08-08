import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import GoogleSignInButton from '../components/GoogleSignInButton';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to intended page or home
  const from = (location.state as { from?: { pathname: string; search: string } })?.from;
  const targetUrl = from ? `${from.pathname}${from.search}` : '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error('Please enter your email/username and password');
      return;
    }

    setLoading(true);
    try {
      await login({ identifier: identifier.trim(), password });
      toast.success('Welcome back!');
      navigate(targetUrl, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-card p-8 shadow-card-hover dark:shadow-card-hover-dark"
      >
        {/* Brand header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-accent-600 items-center justify-center text-white font-bold text-lg shadow-md mb-2">
            OH
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Log in to OpportunityHub
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Access hackathons, workshops, conferences, and competitions
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. alex@college.edu or alex99"
              className="input-glass"
              autoComplete="username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glass"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full justify-center py-3 text-sm font-semibold shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="auth-divider">
          <span className="auth-divider__line" />
          <span className="auth-divider__text">or continue with</span>
          <span className="auth-divider__line" />
        </div>

        {/* Google sign-in */}
        <GoogleSignInButton label="Sign in with Google" />

        {/* Footer link */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent-600 dark:text-accent-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
