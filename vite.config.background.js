import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/background/background.js"),
      name: "background",
      formats: ["iife"],
      fileName: () => "background.js",
    },
    rollupOptions: {
      output: {
        dir: "dist",
        entryFileNames: "background.js",
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    target: "es2020",
  },
});
