import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist/background",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/background/background.js"),
      name: "background",
      formats: ["iife"],
      fileName: () => "background.js",
    },
  },
});
