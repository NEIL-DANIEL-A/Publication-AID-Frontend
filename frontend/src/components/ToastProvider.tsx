import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--toast-bg, rgba(255,255,255,0.85))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 4px 24px -1px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.06)',
          color: 'var(--toast-color, #171717)',
          fontSize: '13px',
          fontWeight: '500',
          borderRadius: '12px',
          padding: '10px 14px',
        },
        success: {
          iconTheme: { primary: '#6366f1', secondary: 'white' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: 'white' },
        },
      }}
    />
  );
}
