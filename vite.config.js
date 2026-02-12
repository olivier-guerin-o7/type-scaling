import { defineConfig } from 'vite';
import fonts from './src/data/fonts.json' with { type: 'json' };

// Pre-optimize all curated font metrics so Vite doesn't trigger
// page reloads on first dynamic import
const fontMetricsDeps = fonts.map(f => `@capsizecss/metrics/${f.slug}`);

export default defineConfig({
  base: '/type-scaling/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: fontMetricsDeps,
  },
  server: {
    open: true,
  },
});
