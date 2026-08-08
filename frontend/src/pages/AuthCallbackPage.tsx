import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { googleAuthApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Google sign-in…');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        // Supabase detects the OAuth callback from the URL hash/query automatically.
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData.session) {
          console.error('[AuthCallback] No session found:', sessionError?.message);
          setStatus('error');
          setMessage('Google sign-in failed — no session found. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        const supabaseAccessToken = sessionData.session.access_token;

        // Exchange Supabase token for our own app JWT
        const response = await googleAuthApi(supabaseAccessToken);

        // Store app JWT and log the user in via AuthContext
        loginWithToken(response.token, response.user);

        setStatus('success');
        setMessage(`Welcome, ${response.user.name}! Redirecting…`);
        setTimeout(() => navigate('/', { replace: true }), 1500);
      } catch (err: any) {
        console.error('[AuthCallback] Error:', err);
        const detail: string =
          err?.response?.data?.message ?? err?.message ?? 'Unknown error occurred.';
        setStatus('error');
        setMessage(detail);
        // Redirect back to login after a delay so the user can read the error.
        setTimeout(() => navigate('/login', { replace: true }), 4000);
      }
    };

    handleCallback();
  }, [navigate, loginWithToken]);

  const isError = status === 'error';

  return (
    <div className="auth-callback-page">
      <motion.div
        className="auth-callback-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {status === 'processing' && (
          <div className="auth-callback-spinner-wrap">
            <svg className="auth-callback-spinner" viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
                stroke="url(#spinnerGrad)"
                strokeLinecap="round"
                strokeDasharray="80 120"
              />
              <defs>
                <linearGradient id="spinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            className="auth-callback-icon auth-callback-icon--success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}

        {isError && (
          <motion.div
            className="auth-callback-icon auth-callback-icon--error"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        <p className={`auth-callback-message ${isError ? 'auth-callback-message--error' : ''}`}>
          {message}
        </p>

        {isError && (
          <p className="auth-callback-hint">
            Only <strong>@rajalakshmi.edu.in</strong> accounts are allowed.
            <br />
            Redirecting to login…
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallbackPage;
