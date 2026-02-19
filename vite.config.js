import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_DEV_PORT || env.PORT || '5173', 10) || 5173;
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: true,           // bind to 0.0.0.0
      port,
      strictPort: false,
      allowedHosts: true,   // allow any host
      watch: {
        usePolling: true,
      },
    },
    preview: {
      allowedHosts: true,   // needed if using `vite preview`
    },
  };
});