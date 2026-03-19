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
    target: "esnext", // Leverage modern browser features for smaller/faster code
    minify: "terser", // Use terser for advanced minification options
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    assetsInlineLimit: 4096, // Inline assets under 4kb as base64 to reduce requests
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'router';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('@google/generative-ai') || id.includes('openai')) return 'ai-vendor';
            return 'vendor'; // Merge react, react-dom, and other core libs
          }
        }
      }
    }
  }
}));
