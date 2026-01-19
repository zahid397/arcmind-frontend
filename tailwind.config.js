/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f3ff',
        'neon-green': '#00ff88',
        'neon-blue': '#0088ff',
        'neon-purple': '#aa00ff',
        'compost': {
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
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
