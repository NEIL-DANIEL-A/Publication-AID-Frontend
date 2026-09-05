/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Accent: Indigo ─────────────────────────────────
        accent: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // ── Urgency: Amber ─────────────────────────────────
        urgency: {
          low:    '#f59e0b',
          medium: '#f97316',
          high:   '#ef4444',
        },
        // ── Neutral base ───────────────────────────────────
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1a1a1a',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      backgroundImage: {
        'gradient-mesh-light':
          'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)',
        'gradient-mesh-dark':
          'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(79,70,229,0.08) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':      'shimmer 2s infinite',
        'fade-in':      'fadeIn 0.3s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'float':        'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'glass':       '0 4px 24px -1px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.06)',
        'glass-dark':  '0 4px 24px -1px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06)',
        'accent-glow': '0 0 20px rgba(99,102,241,0.25)',
        'card-hover':  '0 20px 60px -10px rgba(0,0,0,0.15)',
        'card-hover-dark': '0 20px 60px -10px rgba(0,0,0,0.60)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
