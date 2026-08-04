import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-accent-600 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Checking permissions…</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Admins only');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
