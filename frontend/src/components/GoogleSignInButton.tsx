import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';

interface GoogleSignInButtonProps {
  label?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ label = 'Sign in with Google' }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            hd: 'rajalakshmi.edu.in', // hosted domain hint — Google shows only @rajalakshmi.edu.in accounts
          },
        },
      });
      if (error) {
        console.error('[Google Sign-In] OAuth initiation error:', error.message);
      }
      // Browser will redirect — no further action needed here.
    } catch (err) {
      console.error('[Google Sign-In] Unexpected error:', err);
      setLoading(false);
    }
    // Note: setLoading(false) not called on success; page redirects away.
  };

  return (
    <motion.button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className="google-btn"
      aria-label="Sign in with Google"
    >
      {loading ? (
        <svg className="google-btn__spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" />
        </svg>
      ) : (
        <svg className="google-btn__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{loading ? 'Redirecting…' : label}</span>
    </motion.button>
  );
};

export default GoogleSignInButton;
