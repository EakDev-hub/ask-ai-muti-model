# ⚙️ Configuration Guide

This guide explains all configuration options for your AI Chat application.

## 📁 Configuration Files

### 1. Backend Configuration

**File:** `backend/.env`

This is where you configure the backend server:

```env
# OpenRouter API Configuration (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Server Configuration (OPTIONAL)
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | None | Your OpenRouter API key from https://openrouter.ai/ |
| `PORT` | ❌ No | 3001 | Port for backend server |
| `FRONTEND_URL` | ❌ No | http://localhost:5173 | Frontend URL for CORS |
| `NODE_ENV` | ❌ No | development | Environment (development/production) |

### 2. Frontend Configuration

**File:** `frontend/src/config.js`

Controls frontend behavior and defaults:

```javascript
const config = {
  api: {
    baseUrl: 'http://localhost:3001/api',  // Backend API URL
    timeout: 30000,                         // Request timeout (ms)
  },
  
  ai: {
    defaultModel: 'google/gemini-pro-vision',  // Default AI model
    defaultSystemPrompt: 'You are a helpful AI assistant...',
  },
  
  upload: {
    maxImageSize: 5 * 1024 * 1024,  // 5MB max
    allowedTypes: ['image/jpeg', 'image/png', ...],
  },
  
  ui: {
    autoScrollToNewMessage: true,
    showTimestamps: false,
    showModelInMessage: true,
  }
};
```

### 3. Backend Config Module

**File:** `backend/src/config.js`

Centralized backend configuration (reads from `.env`):

```javascript
const config = {
  server: { port, host, nodeEnv },
  openrouter: { apiKey, baseUrl, defaultModel },
  cors: { origin, credentials },
  upload: { maxFileSize, allowedMimeTypes },
};
```

## 🔧 Common Configuration Tasks

### Change Backend Port

**Edit:** `backend/.env`
```env
PORT=4000
```

**Then restart backend:**
```bash
cd backend
npm run dev
```

### Change Default AI Model

**Edit:** `frontend/src/config.js`
```javascript
ai: {
  defaultModel: 'anthropic/claude-3-opus',  // Changed from gemini
}
```

### Adjust Image Upload Limits

**Frontend limit (user-facing):**

**Edit:** `frontend/src/config.js`
```javascript
upload: {
  maxImageSize: 10 * 1024 * 1024,  // Change to 10MB
}
```

**Backend limit (server-side):**

**Edit:** `backend/src/config.js`
```javascript
upload: {
  maxFileSize: '10mb',  // Change to 10mb
}
```

### Change API Timeout

**Edit:** `frontend/src/config.js`
```javascript
api: {
  timeout: 60000,  // Change to 60 seconds
}
```

### Customize UI Behavior

**Edit:** `frontend/src/config.js`
```javascript
ui: {
  autoScrollToNewMessage: false,  // Disable auto-scroll
  showTimestamps: true,           // Show message times
  showModelInMessage: false,      // Hide model names
}
```

## 🌍 Environment-Specific Configuration

### Development (Local)

**Backend:** `backend/.env`
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend:** `frontend/src/config.js`
```javascript
api: {
  baseUrl: 'http://localhost:3001/api',
}
```

### Production

**Backend:** `backend/.env`
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend:** `frontend/src/config.js`
```javascript
api: {
  baseUrl: 'https://your-backend-domain.com/api',
}
```

## 🔒 Security Configuration

### API Key Security

✅ **DO:**
- Store API key in `backend/.env`
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys regularly

❌ **DON'T:**
- Commit `.env` to Git
- Share API keys publicly
- Store keys in frontend code
- Use same key for dev and prod

### CORS Configuration

**Edit:** `backend/src/config.js`

```javascript
cors: {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

For multiple origins:
```javascript
cors: {
  origin: [
    'http://localhost:5173',
    'https://your-domain.com'
  ],
  credentials: true
}
```

## 🎨 Customization Examples

### Example 1: Use Different Default Model

**Goal:** Start with Claude instead of Gemini

**Edit:** `frontend/src/config.js`
```javascript
ai: {
  defaultModel: 'anthropic/claude-3-sonnet',
  defaultSystemPrompt: 'You are Claude, a helpful AI assistant.',
}
```

### Example 2: Increase Upload Limit

**Goal:** Allow 10MB images

**Frontend:** `frontend/src/config.js`
```javascript
upload: {
  maxImageSize: 10 * 1024 * 1024,  // 10MB
}
```

**Backend:** `backend/src/app.js`
```javascript
app.use(express.json({ limit: '15mb' }));  // Extra buffer
```

### Example 3: Custom System Prompt

**Goal:** Make AI behave like a photographer

**Edit:** `frontend/src/config.js`
```javascript
ai: {
  defaultSystemPrompt: 'You are a professional photographer with 20 years of experience. Analyze images with technical detail about composition, lighting, and technique.',
}
```

### Example 4: Production API URL

**Goal:** Point to production backend

**Edit:** `frontend/src/config.js`
```javascript
api: {
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.yourapp.com/api',
}
```

Then create `frontend/.env.production`:
```env
VITE_API_URL=https://api.yourapp.com/api
```

## 📊 Configuration Priority

Configuration is loaded in this order (later overrides earlier):

1. **Default values** in config files
2. **Environment variables** from `.env`
3. **Runtime overrides** (if any)

Example:
```javascript
// Default
port: 3001

// Can be overridden by .env
PORT=4000

// Final result: 4000
```

## 🔍 Validation

### Check Current Configuration

**Backend:**
```javascript
// Add to backend/server.js
console.log('Config:', require('./src/config'));
```

**Frontend:**
```javascript
// In browser console
import config from './src/config.js';
console.log(config);
```

### Verify Environment Variables

```bash
# In backend directory
cd backend
node -e "require('dotenv').config(); console.log(process.env.OPENROUTER_API_KEY)"
```

## 🐛 Troubleshooting

### "API key not found"

**Problem:** Backend can't read API key

**Solution:**
1. Check `backend/.env` exists
2. Verify `OPENROUTER_API_KEY=sk-or-v1-...`
3. No extra spaces or quotes
4. Restart backend server

### "CORS error"

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check `FRONTEND_URL` in `backend/.env`
2. Verify it matches frontend URL
3. Check backend `src/config.js` CORS settings
4. Restart backend

### "File too large"

**Problem:** Image upload fails

**Solution:**
1. Check `maxImageSize` in `frontend/src/config.js`
2. Check `maxFileSize` in `backend/src/config.js`
3. Verify `express.json({ limit: '10mb' })` in `backend/src/app.js`

### "Timeout error"

**Problem:** Requests taking too long

**Solution:**
1. Increase `timeout` in `frontend/src/config.js`
2. Check `openrouter.timeout` in `backend/src/config.js`
3. Try a faster AI model

## 📝 Configuration Checklist

Before running the app:

- [ ] Created `backend/.env` from `.env.example`
- [ ] Added OpenRouter API key to `backend/.env`
- [ ] Verified `PORT` and `FRONTEND_URL` are correct
- [ ] Reviewed `frontend/src/config.js` defaults
- [ ] Customized `defaultModel` if desired
- [ ] Adjusted `maxImageSize` if needed
- [ ] Set `defaultSystemPrompt` for your use case
- [ ] Configured CORS for your domains
- [ ] Added both `.env` files to `.gitignore`

## 🚀 Quick Configuration Examples

### Minimal Setup (Just to Test)

`backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

That's it! Everything else uses defaults.

### Recommended Setup

`backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

`frontend/src/config.js`:
```javascript
// Keep defaults or customize as needed
```

### Production Setup

`backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-production-key
PORT=3001
FRONTEND_URL=https://yourapp.com
NODE_ENV=production
```

`frontend/.env.production`:
```env
VITE_API_URL=https://api.yourapp.com/api
```

## 📚 Related Documentation

- [Setup Guide](SETUP_GUIDE.md) - Getting started
- [README](README.md) - Complete documentation
- [Architecture](ARCHITECTURE.md) - System design
- [Technical Specs](TECHNICAL_SPECS.md) - Implementation details

---

**Need help?** Check the troubleshooting section or review the example configurations above!