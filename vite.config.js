import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,           // bind to 0.0.0.0
    port: 5173,
    strictPort: false,
    allowedHosts: true,   // allow any host
    watch: {
      usePolling: true,
    },
  },
  preview: {
    allowedHosts: true,   // needed if using `vite preview`
  },
});