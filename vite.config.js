import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ REQUIRED for Cloudflare Pages

  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    }
  },

  server: {
    port: 3000,
    host: true
  }
})
