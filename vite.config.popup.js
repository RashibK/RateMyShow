import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
