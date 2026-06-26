import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, el dev server de Vite (5173) proxya las rutas del backend
// FastAPI (8000): así el front llama a /api, /img y /output con el mismo
// origen relativo que en producción, sin necesidad de CORS.
const BACKEND = 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: BACKEND, changeOrigin: true },
      '/img': { target: BACKEND, changeOrigin: true },
      '/output': { target: BACKEND, changeOrigin: true },
    },
  },
  build: {
    // FastAPI sirve este directorio como estáticos en producción.
    outDir: 'dist',
    emptyOutDir: true,
  },
});
