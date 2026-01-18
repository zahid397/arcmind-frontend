import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}', // ✅ FIXED: safest glob for App Router
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        /* ===== CSS VAR COLORS ===== */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        /* ===== NEON COLORS ===== */
        'neon-cyan': '#00f3ff',
        'neon-green': '#00ff88',
        'neon-blue': '#0088ff',
        'neon-purple': '#aa00ff',
        'neon-pink': '#ff00ff',
        'neon-yellow': '#ffff00',

        /* ===== COMPOST ===== */
        compost: {
          50: '#f8f6f4',
          100: '#e8e4dd',
          200: '#d1c9bc',
          300: '#b5a896',
          400: '#9f8d78',
          500: '#8d7c68',
          600: '#7a6754',
          700: '#655344',
          800: '#554639',
          900: '#483c32',
          950: '#271f1a',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      animation: {
        /* Skeleton */
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-fast': 'pulse-fast 1s cubic-bezier(0.4,0,0.6,1) infinite',

        /* Text shimmer */
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
        'text-shimmer-slow': 'text-shimmer 5s ease-in-out infinite',
        'text-shimmer-fast': 'text-shimmer 1.5s linear infinite',

        /* Gradient mesh */
        'gradient-mesh': 'gradient-mesh 30s ease-in-out infinite',
        'gradient-mesh-slow': 'gradient-mesh 60s ease-in-out infinite',
        'gradient-mesh-fast': 'gradient-mesh 15s ease-in-out infinite',

        /* Neon grid */
        'neon-grid': 'neon-grid-shift 20s linear infinite',
        'neon-grid-slow': 'neon-grid-shift 40s linear infinite',
        'neon-grid-fast': 'neon-grid-shift 10s linear infinite',

        /* Scanlines */
        'scanlines': 'scanlines-scroll 1s linear infinite',
        'scanlines-slow': 'scanlines-scroll-slow 2s linear infinite',
        'scanlines-fast': 'scanlines-scroll-fast 0.5s linear infinite',
      },

      keyframes: {
        'pulse-slow': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'pulse-fast': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },

        'text-shimmer': {
          '0%,100%': { backgroundPosition: '-200% center' },
          '50%': { backgroundPosition: '200% center' },
        },

        'gradient-mesh': {
          '0%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },

        'neon-grid-shift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': {
            backgroundPosition:
              'var(--neon-grid-size,48px) var(--neon-grid-size,48px)',
          },
        },

        'scanlines-scroll': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 20px' },
        },
        'scanlines-scroll-slow': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 10px' },
        },
        'scanlines-scroll-fast': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 40px' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities, theme }) {
      addUtilities({
        '.text-shadow-neon': {
          textShadow: theme('textShadow.neon'),
        },
      })
    },
  ],
}

export default config
