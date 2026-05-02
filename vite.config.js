import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Raise warning limit — firebase SDK is large by design
    chunkSizeWarningLimit: 1000,
    // Disable sourcemaps in production (smaller output)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Manual chunk splitting: keeps vendor/firebase out of main bundle
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
        },
        // Consistent asset naming
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})

