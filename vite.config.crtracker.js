import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/content_scripts/crunchyroll',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content_scripts/crunchyroll/crTracker.js'),
      name: 'crTracker',
      formats: ['iife'],
      fileName: () => 'crTracker.js',
    },
  },
});
