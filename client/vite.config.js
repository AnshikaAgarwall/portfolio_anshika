// Vite build/dev config.
// - React plugin and an "@" alias pointing to src/.
// - Vendor code split into long-cacheable chunks: react, router, framer-motion.
// - `npm run build:analyze` (mode "analyze") writes dist/stats.html, an
//   interactive treemap of the bundle (rollup-plugin-visualizer).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';

const VENDOR_CHUNKS = {
  react: ['/node_modules/react/', '/node_modules/react-dom/', '/node_modules/scheduler/'],
  router: ['/node_modules/react-router/', '/node_modules/react-router-dom/'],
  motion: ['/node_modules/framer-motion/', '/node_modules/motion-dom/', '/node_modules/motion-utils/'],
};

function manualChunks(id) {
  const path = id.replace(/\\/g, '/');
  return Object.keys(VENDOR_CHUNKS).find((name) => VENDOR_CHUNKS[name].some((dir) => path.includes(dir)));
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true, template: 'treemap' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks },
    },
  },
}));
