import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RequireAdmin } from './components/RequireAdmin';
import { Navbar } from './components/Navbar';
import { BackToTop } from './components/BackToTop';
import { ToastProvider } from './components/ToastProvider';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Google OAuth callback — must be public, user is not yet logged in */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Route */}
            <Route
              path="/admin/users"
              element={
                <RequireAdmin>
                  <AdminUsersPage />
                </RequireAdmin>
              }
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
                  <span className="text-6xl">🌀</span>
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Page not found</h2>
                  <a href="/" className="btn-accent">Go home</a>
                </div>
              }
            />
          </Routes>
          <BackToTop />
          <ToastProvider />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
