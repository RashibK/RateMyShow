import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/content_scripts/crunchyroll/crTracker.js"),
      name: "crTracker",
      formats: ["iife"],
      fileName: () => "content_scripts/crunchyroll/crTracker.js",
    },
    rollupOptions: {
      output: {
        dir: "dist",
        entryFileNames: "content_scripts/crunchyroll/crTracker.js",
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    target: "es2020",
  },
});
