/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Design tokens via CSS variables ── */
        base:    "var(--color-base)",
        surface: "var(--color-surface)",
        raised:  "var(--color-raised)",
        line:    "var(--color-line)",
        ink:     "var(--color-ink)",
        muted:   "var(--color-muted)",

        /* ── PRIMARY ACCENT: Indigo/Violet ── */
        accent: {
          DEFAULT: "#4f46e5",
          hover:   "#4338ca",
          light:   "#eef2ff",
          muted:   "#c7d2fe",
          dark:    "#3730a3",
        },
        accentInk: "#FFFFFF",

        /* ── SECONDARY: Violet ── */
        accent2: {
          DEFAULT: "#7c3aed",
          light:   "#ede9fe",
        },

        /* ── Campus scale (indigo) ── */
        campus: {
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
          950: '#1e1b4b',
        },

        /* ── Status colors ── */
        success: {
          DEFAULT: '#059669',
          light:   '#d1fae5',
        },
        warning: {
          DEFAULT: '#d97706',
          light:   '#fef3c7',
        },
        danger: {
          DEFAULT: '#dc2626',
          light:   '#fee2e2',
        },

        /* ── Category accent colors ── */
        cat: {
          technical: '#7c3aed',
          cultural:  '#d97706',
          sports:    '#059669',
          workshop:  '#2563eb',
          seminar:   '#db2777',
          club:      '#ea580c',
          other:     '#6b7280',
        },
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
        'card-sm': '10px',
      },
      boxShadow: {
        card:          '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.06)',
        'card-hover':  '0 8px 32px -4px rgba(79,70,229,0.15), 0 2px 8px -2px rgba(0,0,0,0.06)',
        glow:          '0 4px 14px rgba(79,70,229,0.35)',
        'glow-sm':     '0 2px 8px rgba(79,70,229,0.25)',
        nav:           '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)',
        modal:         '0 20px 60px -10px rgba(0,0,0,0.2)',
        sidebar:       '2px 0 12px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in':         'fadeIn 0.3s ease-out both',
        'fade-in-up':      'fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':        'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right':  'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-dot':       'pulseDot 2s ease-in-out infinite',
        'shimmer':         'shimmer 1.5s infinite',
        'scale-in':        'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'spin-slow':       'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: 0 },                            to: { opacity: 1 } },
        fadeInUp:     { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp:      { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseDot:     { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(0.85)' } },
        scaleIn:      { from: { opacity: 0, transform: 'scale(0.92)' },  to: { opacity: 1, transform: 'scale(1)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        'gradient-hero':    'linear-gradient(135deg, #0f1117 0%, #1e1b4b 50%, #312e81 100%)',
        'gradient-card':    'linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
