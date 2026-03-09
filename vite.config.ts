import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('@google/generative-ai') || id.includes('openai')) return 'ai-vendor';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('@radix-ui') || id.includes('lucide-react')) return 'ui-vendor';
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  }
}));
