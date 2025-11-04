import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Development server configuration
    server: {
      port: 5173,
      host: true, // Listen on all addresses
      open: true, // Auto-open browser
      cors: true, // Enable CORS
      proxy: {
        // Proxy API requests to backend during development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      // Optimize chunk sizes
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'markdown': ['react-markdown']
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    
    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
      }
    },
    
    // Environment variables prefix
    envPrefix: 'VITE_',
    
    // Preview server configuration (for production build preview)
    preview: {
      port: 4173,
      host: true,
      open: true
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'axios', 'react-markdown']
    }
  }
})