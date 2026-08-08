import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import GoogleSignInButton from '../components/GoogleSignInButton';

export function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !rollNumber.trim() || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        rollNumber: rollNumber.trim(),
        password,
      });

      toast.success('Account created successfully!');
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
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
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-accent-600 items-center justify-center text-white font-bold text-lg shadow-md mb-1">
            OH
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Join OpportunityHub to track opportunities and register
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="input-glass"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex99"
                className="input-glass"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="21CS104"
                className="input-glass"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@college.edu"
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="input-glass"
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
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="auth-divider">
          <span className="auth-divider__line" />
          <span className="auth-divider__text">or sign up with</span>
          <span className="auth-divider__line" />
        </div>

        {/* Google sign-in — for @rajalakshmi.edu.in only */}
        <GoogleSignInButton label="Sign up with Google" />
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 -mt-1">
          Google sign-in is restricted to{' '}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">@rajalakshmi.edu.in</span>{' '}accounts
        </p>

        {/* Footer link */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-600 dark:text-accent-400 font-semibold hover:underline">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
