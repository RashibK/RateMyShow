import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/background.js'),
        crTracker: resolve(__dirname, 'src/content_scripts/crunchyroll/crTracker.js'), 
        injectIntoCR: resolve(__dirname, 'src/content_scripts/crunchyroll/injectIntoCR.js'), 
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'background') return 'background/[name].js';
          if (assetInfo.name === 'crTracker') return 'content_scripts/crunchyroll/[name].js'; 
          if (assetInfo.name === 'injectIntoCR') return 'content_scripts/crunchyroll/[name].js'; 
          return 'assets/[name].js';
        },
      },
    },
  },
});
