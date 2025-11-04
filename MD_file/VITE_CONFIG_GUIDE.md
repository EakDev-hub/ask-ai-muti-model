# 🚀 Vite Configuration Guide

This guide explains the Vite configuration for your AI Chat frontend application.

## 📁 Configuration Files

### 1. `frontend/vite.config.js`
Main Vite configuration file with enhanced features.

### 2. Environment Files
- `frontend/.env.example` - Template for local development
- `frontend/.env.production` - Production environment variables

## ⚙️ Key Features

### 1. **Development Server**

```javascript
server: {
  port: 5173,              // Development server port
  host: true,              // Listen on all network interfaces
  open: true,              // Auto-open browser
  cors: true,              // Enable CORS
  proxy: {                 // Proxy API requests to backend
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }
  }
}
```

**Benefits:**
- Auto-opens browser on start
- API requests can use `/api` instead of `http://localhost:3001/api`
- Accessible from other devices on network

### 2. **Path Aliases**

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@services': path.resolve(__dirname, './src/services'),
  }
}
```

**Usage in code:**
```javascript
// Instead of:
import ChatInterface from '../../components/ChatInterface'

// You can use:
import ChatInterface from '@components/ChatInterface'
```

### 3. **Build Optimization**

```javascript
build: {
  outDir: 'dist',
  sourcemap: mode === 'development',
  minify: 'esbuild',
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'markdown': ['react-markdown']
      }
    }
  }
}
```

**Benefits:**
- Smaller bundle sizes
- Better caching with split chunks
- Faster production builds with esbuild

### 4. **Environment Variables**

```javascript
// vite.config.js
const env = loadEnv(mode, process.cwd(), '')

// Access in your code
const apiUrl = import.meta.env.VITE_API_URL
```

**Available in:**
- Development: `.env` or `.env.local`
- Production: `.env.production`

### 5. **Preview Server**

```javascript
preview: {
  port: 4173,
  host: true,
  open: true
}
```

**Used for:** Testing production builds locally

## 🔧 Environment Variables

### Frontend Variables (VITE_ prefix)

Create `frontend/.env` for local development:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Info
VITE_APP_NAME=AI Chat Assistant
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### Using Environment Variables

**In JavaScript:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true'
```

**In config.js:**
```javascript
const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  }
}
```

## 📝 Common Tasks

### Change Development Port

**Method 1: vite.config.js**
```javascript
server: {
  port: 3000,  // Change to any port
}
```

**Method 2: Command line**
```bash
npm run dev -- --port 3000
```

### Change Backend API URL

**Development (.env):**
```env
VITE_API_URL=http://localhost:4000/api
```

**Production (.env.production):**
```env
VITE_API_URL=https://api.yourapp.com/api
```

### Add Path Alias

**vite.config.js:**
```javascript
resolve: {
  alias: {
    '@utils': path.resolve(__dirname, './src/utils'),
  }
}
```

**Usage:**
```javascript
import { helper } from '@utils/helper'
```

### Enable Source Maps in Production

**vite.config.js:**
```javascript
build: {
  sourcemap: true,  // Always generate source maps
}
```

### Customize Build Output

**vite.config.js:**
```javascript
build: {
  outDir: 'build',           // Change output directory
  assetsDir: 'static',       // Assets subdirectory
  emptyOutDir: true,         // Clean before build
}
```

## 🚀 npm Scripts

### Development
```bash
npm run dev
# Starts dev server at http://localhost:5173
```

### Build for Production
```bash
npm run build
# Outputs to frontend/dist/
```

### Preview Production Build
```bash
npm run preview
# Serves production build at http://localhost:4173
```

## 🌐 API Proxy

The proxy configuration allows you to make API requests without CORS issues during development.

**Without Proxy:**
```javascript
// Need full URL
fetch('http://localhost:3001/api/chat', { ... })
```

**With Proxy:**
```javascript
// Can use relative URL
fetch('/api/chat', { ... })
```

**Configuration:**
```javascript
proxy: {
  '/api': {
    target: env.VITE_API_URL || 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }
}
```

## 🎯 Build Performance

### Chunk Strategy

```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'markdown': ['react-markdown']
}
```

**Benefits:**
- React cached separately (rarely changes)
- Better long-term caching
- Parallel loading

### Optimize Dependencies

```javascript
optimizeDeps: {
  include: ['react', 'react-dom', 'axios', 'react-markdown']
}
```

**Benefits:**
- Pre-bundles dependencies
- Faster dev server startup
- Consistent caching

## 🔒 Production Best Practices

### 1. Environment Variables

**✅ DO:**
```env
VITE_API_URL=https://api.yourapp.com/api
```

**❌ DON'T:**
```env
# Never put secrets in VITE_ variables
VITE_API_KEY=secret123  # ❌ Will be exposed to client!
```

### 2. Build Analysis

```bash
# Analyze bundle size
npm run build -- --report
```

### 3. Test Production Build

```bash
# Always test before deploying
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Change port
npm run dev -- --port 3000

# Or kill existing process
lsof -ti:5173 | xargs kill -9
```

### Path Alias Not Working

**Error:** `Cannot find module '@components/...'`

**Solution:**
1. Check `vite.config.js` has alias defined
2. Restart dev server
3. Clear cache: `rm -rf node_modules/.vite`

### Environment Variables Not Loading

**Error:** `import.meta.env.VITE_API_URL is undefined`

**Solutions:**
1. Ensure variable starts with `VITE_`
2. Restart dev server
3. Check `.env` file exists
4. Verify no syntax errors in `.env`

### Build Fails

**Common causes:**
1. Type errors in code
2. Missing dependencies
3. Large bundle size

**Solutions:**
```bash
# Clear cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstall
npm install

# Try again
npm run build
```

## 📊 Performance Tips

### 1. Lazy Load Routes
```javascript
const ChatInterface = lazy(() => import('@components/ChatInterface'))
```

### 2. Optimize Images
- Use WebP format
- Compress before upload
- Use appropriate sizes

### 3. Code Splitting
```javascript
// Dynamic imports
const module = await import('./module.js')
```

### 4. Tree Shaking
```javascript
// Import only what you need
import { useState } from 'react'  // ✅
import React from 'react'         // ❌ (imports everything)
```

## 🔄 Hot Module Replacement (HMR)

Vite uses fast HMR by default:

- Changes reflected instantly
- Preserves component state
- No full page reload needed

**Configure HMR:**
```javascript
server: {
  hmr: {
    overlay: true,  // Show errors as overlay
  }
}
```

## 📦 Deployment

### Build for Production

```bash
npm run build
```

Output: `frontend/dist/`

### Deploy to Various Platforms

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

**Static Hosting:**
Upload `dist/` folder contents

### Environment Variables in Production

**Vercel/Netlify:**
Add in dashboard:
- `VITE_API_URL` = `https://api.yourapp.com/api`

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

## 📚 Related Documentation

- [Vite Official Docs](https://vitejs.dev/)
- [Vite Config Reference](https://vitejs.dev/config/)
- [`CONFIGURATION.md`](CONFIGURATION.md) - App configuration
- [`README.md`](README.md) - Complete guide

---

**Ready to build!** Run `npm run dev` to start developing! 🚀