import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(
        __dirname,
        "src/content_scripts/crunchyroll/injectIntoCR.js"
      ),
      name: "injectIntoCR",
      formats: ["iife"],
      fileName: () => "content_scripts/crunchyroll/injectIntoCR.js",
    },
    rollupOptions: {
      output: {
        dir: "dist",
        entryFileNames: "content_scripts/crunchyroll/injectIntoCR.js",
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    target: "es2020",
  },
});
