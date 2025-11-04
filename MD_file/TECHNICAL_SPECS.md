# Technical Specifications

## Backend Implementation Details

### 1. Project Setup

#### Dependencies
```json
{
  "name": "ai-chat-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2. File Structure Details

#### server.js
```javascript
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
```

#### src/app.js
```javascript
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

module.exports = app;
```

### 3. OpenRouter Service Implementation

#### src/services/openRouterService.js
```javascript
const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'AI Chat Application'
      }
    });
  }

  async sendChatRequest(message, image, model, systemPrompt) {
    const messages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Build user message content
    const userContent = [];
    
    if (message) {
      userContent.push({
        type: 'text',
        text: message
      });
    }

    if (image) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: image // base64 data URL
        }
      });
    }

    messages.push({
      role: 'user',
      content: userContent.length === 1 ? userContent[0].text : userContent
    });

    try {
      const response = await this.axiosInstance.post('/chat/completions', {
        model: model || 'google/gemini-pro-vision',
        messages: messages
      });

      return {
        response: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAvailableModels() {
    try {
      const response = await this.axiosInstance.get('/models');
      
      // Filter for vision-capable models
      const visionModels = response.data.data.filter(model => 
        model.id.includes('vision') || 
        model.id.includes('gemini') ||
        model.context_length > 100000 ||
        model.architecture?.modality?.includes('image')
      );

      return visionModels.map(model => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || '',
        pricing: model.pricing
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(
        `OpenRouter API Error: ${error.response.data.error?.message || error.response.statusText}`
      );
    } else if (error.request) {
      return new Error('No response from OpenRouter API');
    } else {
      return new Error(`Request setup error: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();
```

### 4. Controller Implementation

#### src/controllers/chatController.js
```javascript
const openRouterService = require('../services/openRouterService');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, image, model, systemPrompt } = req.body;

    // Validation
    if (!message && !image) {
      return res.status(400).json({
        error: 'Either message or image is required'
      });
    }

    const result = await openRouterService.sendChatRequest(
      message,
      image,
      model,
      systemPrompt
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getModels = async (req, res, next) => {
  try {
    const models = await openRouterService.getAvailableModels();
    res.json({ models });
  } catch (error) {
    next(error);
  }
};
```

### 5. Routes Implementation

#### src/routes/chatRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.sendMessage);
router.get('/models', chatController.getModels);

module.exports = router;
```

### 6. Error Handler Middleware

#### src/middleware/errorHandler.js
```javascript
module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 7. Environment Configuration

#### .env.example
```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Server Configuration
PORT=3001

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

## Frontend Implementation Details

### 1. Project Setup

#### package.json
```json
{
  "name": "ai-chat-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-markdown": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### 2. Component Specifications

#### src/services/api.js
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendMessage = async (message, image, model, systemPrompt) => {
  const response = await api.post('/chat', {
    message,
    image,
    model,
    systemPrompt
  });
  return response.data;
};

export const getModels = async () => {
  const response = await api.get('/models');
  return response.data.models;
};

export default api;
```

#### Component State Management

**ChatInterface.jsx State:**
```javascript
const [messages, setMessages] = useState([]);
const [inputMessage, setInputMessage] = useState('');
const [selectedImage, setSelectedImage] = useState(null);
const [selectedModel, setSelectedModel] = useState('google/gemini-pro-vision');
const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant');
const [models, setModels] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**Message Object Structure:**
```javascript
{
  id: Date.now(),
  role: 'user' | 'assistant',
  content: 'message text',
  image: 'data:image/jpeg;base64,...', // optional
  timestamp: new Date().toISOString()
}
```

### 3. Image Handling

#### Image Upload Process
1. User selects image file
2. Read file as DataURL using FileReader
3. Store base64 string in state
4. Display preview to user
5. Include in API request when sending message

#### ImageUpload Component Logic
```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('Please select an image file');
    return;
  }
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size must be less than 5MB');
    return;
  }
  
  // Convert to base64
  const reader = new FileReader();
  reader.onloadend = () => {
    setSelectedImage(reader.result);
  };
  reader.readAsDataURL(file);
};
```

### 4. Styling Approach

#### CSS Structure
- Use CSS modules or scoped styles
- Responsive design with flexbox/grid
- Mobile-first approach
- Color scheme: modern, clean, accessible

#### Layout Breakpoints
```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 768px) {
  /* Stack components vertically */
  /* Reduce padding/margins */
  /* Adjust font sizes */
}
```

### 5. Error Handling Strategy

#### Frontend Error Display
```javascript
const handleError = (error) => {
  let errorMessage = 'An error occurred';
  
  if (error.response) {
    errorMessage = error.response.data.error || 'Server error';
  } else if (error.request) {
    errorMessage = 'No response from server';
  } else {
    errorMessage = error.message;
  }
  
  setError(errorMessage);
  
  // Clear error after 5 seconds
  setTimeout(() => setError(null), 5000);
};
```

## API Request/Response Examples

### Send Message Request
```javascript
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "message": "What do you see in this image?",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "model": "google/gemini-pro-vision",
  "systemPrompt": "You are an expert image analyzer"
}
```

### Send Message Response
```javascript
{
  "response": "I can see a beautiful landscape with mountains...",
  "model": "google/gemini-pro-vision",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 75,
    "total_tokens": 225
  }
}
```

### Get Models Request
```javascript
GET http://localhost:3001/api/models
```

### Get Models Response
```javascript
{
  "models": [
    {
      "id": "google/gemini-pro-vision",
      "name": "Gemini Pro Vision",
      "description": "Google's multimodal model",
      "pricing": {
        "prompt": "0.00025",
        "completion": "0.0005"
      }
    },
    {
      "id": "anthropic/claude-3-opus",
      "name": "Claude 3 Opus",
      "description": "Anthropic's most capable model",
      "pricing": {
        "prompt": "0.015",
        "completion": "0.075"
      }
    }
  ]
}
```

## Performance Optimization

### Backend
1. Implement request caching for model list
2. Use compression middleware for responses
3. Set appropriate timeout values
4. Implement rate limiting

### Frontend
1. Lazy load components
2. Optimize image preview rendering
3. Debounce input handlers
4. Use React.memo for expensive components
5. Implement virtual scrolling for long message lists

## Security Best Practices

### Backend Security
1. Validate all input data
2. Sanitize user messages
3. Implement file size limits
4. Use helmet middleware for HTTP headers
5. Enable CORS only for trusted origins
6. Never expose API keys in responses

### Frontend Security
1. Validate image files before upload
2. Sanitize rendered markdown
3. Use HTTPS in production
4. Implement CSP headers
5. Validate API responses

## Testing Checklist

### Backend Tests
- [ ] Server starts successfully
- [ ] Environment variables loaded correctly
- [ ] Health check endpoint responds
- [ ] Chat endpoint accepts valid requests
- [ ] Chat endpoint rejects invalid requests
- [ ] Models endpoint returns data
- [ ] Error handling works correctly
- [ ] CORS configured properly

### Frontend Tests
- [ ] App renders without errors
- [ ] Can send text messages
- [ ] Can upload images
- [ ] Image preview displays correctly
- [ ] Can select different models
- [ ] Can set system prompt
- [ ] Messages display properly
- [ ] Loading states work
- [ ] Error messages display
- [ ] Responsive on mobile devices

## Recommended Default Models

```javascript
const DEFAULT_MODELS = [
  {
    id: 'google/gemini-pro-vision',
    name: 'Gemini Pro Vision',
    description: 'Fast and accurate vision model'
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable multimodal model'
  },
  {
    id: 'openai/gpt-4-vision-preview',
    name: 'GPT-4 Vision',
    description: 'OpenAI vision model'
  }
];
```

## Git Configuration

### .gitignore
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.production

# Build output
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log
npm-debug.log*
```

## Documentation Requirements

### README.md Sections
1. Project Overview
2. Features List
3. Prerequisites
4. Installation Steps
5. Configuration Guide
6. Running the Application
7. Usage Examples
8. API Documentation
9. Troubleshooting
10. Contributing Guidelines
11. License

## Development Timeline Estimate

### Phase 1: Backend Setup (1-2 hours)
- Initialize project
- Install dependencies
- Create server structure
- Implement OpenRouter service
- Test API endpoints

### Phase 2: Frontend Setup (1-2 hours)
- Initialize Vite + React
- Create component structure
- Implement API service
- Create basic UI layout

### Phase 3: Feature Implementation (2-3 hours)
- Image upload functionality
- Model selection
- System prompt configuration
- Message rendering
- Error handling

### Phase 4: Testing & Refinement (1 hour)
- Manual testing
- Bug fixes
- UI/UX improvements
- Documentation

**Total Estimated Time: 5-8 hours**