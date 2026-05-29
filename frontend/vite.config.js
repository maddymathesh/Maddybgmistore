import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ── Image Optimization ───────────────────────────────────────
    ViteImageOptimizer({
      png:  { quality: 82 },
      jpeg: { quality: 82 },
      webp: { quality: 82 },
      avif: { quality: 72 },
    }),

    // ── Compression (Brotli primary, Gzip fallback) ──────────────
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
    viteCompression({ algorithm: 'gzip',            ext: '.gz', deleteOriginFile: false }),

    // ── Progressive Web App ──────────────────────────────────────
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'robots.txt', 'sitemap.xml'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif,woff2}'],
        // Skip large page chunks from precache — they'll be runtime cached
        globIgnores: ['**/node_modules/**', '**/dist/**'],
        runtimeCaching: [
          {
            // Google Fonts — cache-first (essentially never changes)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365, maxEntries: 10 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365, maxEntries: 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Firebase Storage images — stale-while-revalidate
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-images',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30, maxEntries: 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase API — network-first with cache fallback
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxAgeSeconds: 60 * 5, maxEntries: 20 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
      manifest: {
        name: 'Maddy BGMI Store',
        short_name: 'MaddyStore',
        description: "South India's most trusted BGMI marketplace.",
        theme_color: '#0a0c14',
        background_color: '#0a0c14',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'logo.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],

  // ── Dev Server Security Headers ──────────────────────────────
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  // ── Build Optimizations ──────────────────────────────────────
  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2022',
    chunkSizeWarningLimit: 800,
    sourcemap: false,          // Never expose source maps in production
    cssCodeSplit: true,
    reportCompressedSize: false, // Speeds up build (Brotli stats not needed in CI)
    minify: 'esbuild',
    assetsInlineLimit: 4096,   // Inline assets < 4KB as base64 (reduces HTTP requests)
    rollupOptions: {
      output: {
        // Fine-grained vendor splitting — each lazy-loaded separately
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'vendor-react';
          if (id.includes('firebase'))      return 'vendor-firebase';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('gsap'))          return 'vendor-gsap';
          if (id.includes('lenis'))         return 'vendor-lenis';
          if (id.includes('lucide-react'))  return 'vendor-lucide';
          if (id.includes('supabase'))      return 'vendor-supabase';
          if (id.includes('@tanstack'))     return 'vendor-table';
          return 'vendor-misc';
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // ── esbuild — strip logs in production ──────────────────────
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },

  // ── Dependency Pre-bundling (faster cold starts) ─────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'lucide-react',
      'sonner',
    ],
  },
})
