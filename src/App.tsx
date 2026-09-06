import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BackToTop } from './components/BackToTop';
import { ToastProvider } from './components/ToastProvider';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { AdminPage } from './pages/AdminPage';

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
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />

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
    </QueryClientProvider>
  );
}
