import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Configuration pour GitHub Pages
  base: '/Lounol72/',
  // Point d'entrée dans le dossier react
  root: 'react',
  publicDir: '../public',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
})