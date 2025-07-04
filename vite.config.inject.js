import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist/content_scripts/crunchyroll",
 emptyOutDir: false,
    lib: {
      entry: resolve(
        __dirname,
        "src/content_scripts/crunchyroll/injectIntoCR.js"
      ),
      name: "injectIntoCR",
      formats: ["iife"],
      fileName: () => "injectIntoCR.js",
    },
  },
});
