import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004, // Меняем порт
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5004', // Меняем порт
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
      overlay: false,
      clientPort: 3004 // Меняем порт
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  }
});
