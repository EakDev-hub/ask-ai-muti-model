# 🤖 AI Chat Assistant

A full-stack Node.js application that integrates with OpenRouter API to provide AI chat functionality with image upload capabilities, model selection, and custom prompt configuration.

![AI Chat Application](https://img.shields.io/badge/Status-Ready-success)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 💬 **Chat with AI** - Send text messages to AI models and get intelligent responses
- 🖼️ **Image Analysis** - Upload images and have AI analyze and describe them
- 🎯 **Model Selection** - Choose from various AI models available through OpenRouter
- 🔀 **Multi-Model Queries** - Query 2-4 AI models simultaneously and compare responses
- 📋 **AI Summarization** - Synthesize multiple model responses into one comprehensive answer
- 📝 **Custom System Prompts** - Define how the AI should behave
- 🎨 **Modern UI** - Clean, responsive interface with gradient design
- ⚡ **Real-time Responses** - Fast API integration with loading states
- 📱 **Mobile Responsive** - Works seamlessly on all device sizes

## 🏗️ Architecture

```
idcardread/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # OpenRouter integration
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Error handling
│   └── server.js         # Server entry point
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   └── App.jsx       # Main app component
│   └── index.html        # HTML entry point
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenRouter API Key** - [Get one here](https://openrouter.ai/)


## 🐳 Docker Quick Start (Recommended)

The easiest way to run the application is using Docker. This method requires only Docker and your OpenRouter API key.

### Prerequisites
- **Docker** and **Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **OpenRouter API Key** - [Get one here](https://openrouter.ai/)

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd idcardread
   ```

2. **Create environment file**
   ```bash
   cp .env.docker.example .env
   ```

3. **Edit `.env` and add your OpenRouter API key**
   ```bash
   # Open .env in your editor and replace:
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Build and start the application**
   ```bash
   docker-compose up -d
   ```

5. **Open your browser**
   
   Navigate to: **http://localhost**

🎉 **That's it!** Your AI Chat application is now running in Docker.

### Docker Management Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop the application
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View running containers
docker-compose ps

# Remove all containers and volumes
docker-compose down -v
```

For detailed Docker documentation, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

---

## 🚀 Manual Setup (Without Docker)

If you prefer to run the application without Docker, follow these steps:
## 🚀 Quick Start

### 1. Clone or Navigate to Project Directory

```bash
cd idcardread
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# OPENROUTER_API_KEY=your_api_key_here
```

**Important:** Open the `.env` file and replace `your_openrouter_api_key_here` with your actual OpenRouter API key.

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Running the Application

You'll need two terminal windows:

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 AI Chat Backend Server started successfully!
📡 Server running on: http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 5. Open Your Browser

Navigate to: **http://localhost:5173**

🎉 You're ready to chat with AI!

## 🔑 Getting an OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to your API Keys section
4. Create a new API key
5. Copy the key and paste it in your `backend/.env` file

## 💻 Usage Guide

### Basic Chat

1. Type a message in the input field
2. Click the send button (📤) or press Enter
3. Wait for the AI response

### Image Analysis

1. Click the upload button (📎)
2. Select an image (JPG, PNG, WebP, or GIF)
3. Add a message (optional) like "What's in this image?"
4. Click send
5. The AI will analyze and describe the image

### Model Selection

1. Click the dropdown at the top
2. Select your preferred AI model
3. Different models have different capabilities and pricing

### Custom System Prompts

1. Click "📋 System Prompt" button
2. Edit the system prompt to define AI behavior
3. Examples:
   - "You are a professional photographer analyzing images"
   - "You are an expert in OCR and text extraction"
   - "You are a helpful coding assistant"

### Multi-Model Queries (NEW!)

Query multiple AI models simultaneously and compare their responses:

1. Click the **🔀 Multi-Model** button in the header
2. Select 2-4 AI models from the checkbox list
3. Send your message or upload an image
4. View stacked responses from all models
5. Click **📝 Summarize** to synthesize all responses into one answer

**Benefits:**
- Get diverse perspectives from different AI models
- Compare quality and accuracy of responses
- Leverage strengths of multiple models
- Create comprehensive summaries combining all insights

**Example Use Cases:**
- Complex technical questions requiring verification
- Image analysis from multiple vision models
- Code review from different AI perspectives
- Research questions needing diverse viewpoints

For detailed instructions, see [Multi-Model Guide](./MD_file/MULTI_MODEL_GUIDE.md)

## 🌐 API Endpoints

### Backend API

**Base URL:** `http://localhost:3001/api`

#### 1. Send Chat Message
```
POST /api/chat

Request Body:
{
  "message": "What's in this image?",
  "image": "data:image/jpeg;base64,...",
  "model": "google/gemini-pro-vision",
  "systemPrompt": "You are a helpful assistant"
}

Response:
{
  "response": "I can see...",
  "model": "google/gemini-pro-vision",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 75,
    "total_tokens": 225
  }
}
```

#### 2. Send Multi-Model Query (NEW!)
```
POST /api/chat/multi-model

Request Body:
{
  "message": "Analyze this code",
  "image": "data:image/jpeg;base64,... (optional)",
  "models": ["google/gemini-pro-vision", "anthropic/claude-3-opus"],
  "systemPrompt": "You are a helpful assistant (optional)"
}

Response:
{
  "responses": [
    {
      "model": "google/gemini-pro-vision",
      "response": "Response text...",
      "usage": {...},
      "success": true
    },
    {
      "model": "anthropic/claude-3-opus",
      "response": "Response text...",
      "usage": {...},
      "success": true
    }
  ],
  "requestId": "unique-id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 3. Summarize Multi-Model Responses (NEW!)
```
POST /api/chat/summarize

Request Body:
{
  "responses": [
    {
      "model": "model-id",
      "response": "Response text"
    }
  ],
  "summaryModel": "anthropic/claude-3-opus",
  "systemPrompt": "Custom prompt (optional)"
}

Response:
{
  "summary": "Comprehensive summary text...",
  "model": "anthropic/claude-3-opus",
  "usage": {...},
  "sourceModels": ["model1", "model2"]
}
```

#### 4. Get Available Models
```
GET /api/models

Response:
{
  "models": [
    {
      "id": "google/gemini-pro-vision",
      "name": "Gemini Pro Vision",
      "description": "Google's multimodal model"
    }
  ]
}
```

#### 5. Health Check
```
GET /health

Response:
{
  "status": "OK",
  "message": "AI Chat Backend Server is running"
}
```

## 🎨 Recommended AI Models

The application works with various OpenRouter models. Here are some recommendations:

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| **google/gemini-pro-vision** | Image analysis, general chat | Fast | Low |
| **anthropic/claude-3-opus** | Complex reasoning, long context | Medium | High |
| **openai/gpt-4-vision-preview** | Detailed image analysis | Medium | High |
| **anthropic/claude-3-sonnet** | Balanced performance | Fast | Medium |

## 🛠️ Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Required
OPENROUTER_API_KEY=your_api_key_here

# Optional (defaults shown)
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend API Configuration

Edit `frontend/src/services/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 📸 Screenshots

(Add screenshots here after testing)

## 🔒 Security Notes

- ✅ API key is stored in backend environment variables only
- ✅ Never exposed to frontend or client
- ✅ CORS configured for trusted origins
- ✅ File size limits on image uploads (5MB)
- ✅ Image type validation

## 🐛 Troubleshooting

### Backend won't start

**Problem:** `OPENROUTER_API_KEY is not set`

**Solution:** Make sure you've created `backend/.env` and added your API key:
```bash
cd backend
cp .env.example .env
# Edit .env and add your API key
```

### Frontend can't connect to backend

**Problem:** Network errors or CORS issues

**Solution:** 
1. Ensure backend is running on port 3001
2. Check `backend/.env` has correct `FRONTEND_URL`
3. Verify CORS settings in `backend/src/app.js`

### Image upload fails

**Problem:** "Image size must be less than 5MB"

**Solution:** Resize your image or use a smaller file

### Model not responding

**Problem:** Timeout or API errors

**Solution:**
1. Check your OpenRouter API key is valid
2. Verify you have credits on OpenRouter
3. Try a different model
4. Check OpenRouter status page

## 📦 Production Deployment

### Backend Deployment (Heroku/Render)

1. Set environment variables in your hosting platform
2. Deploy backend code
3. Note the production URL

### Frontend Deployment (Vercel/Netlify)

1. Update `frontend/src/services/api.js` with production backend URL
2. Deploy frontend code
3. Configure environment variables if needed

## 🧪 Testing

### Manual Testing Checklist

- [ ] Send text-only message
- [ ] Upload and analyze image
- [ ] Change AI model
- [ ] Modify system prompt
- [ ] Test error handling
- [ ] Verify responsive design on mobile
- [ ] Check different image formats
- [ ] Enable multi-model mode
- [ ] Query 2-4 models simultaneously
- [ ] Verify stacked response display
- [ ] Test summarization feature
- [ ] Check error handling for failed models

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) - AI model API provider
- [React](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Express](https://expressjs.com/) - Backend framework

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the [MD_file/ARCHITECTURE.md](MD_file/ARCHITECTURE.md) for technical details
3. Check [MD_file/TECHNICAL_SPECS.md](MD_file/TECHNICAL_SPECS.md) for implementation details
4. Read the [Multi-Model Guide](MD_file/MULTI_MODEL_GUIDE.md) for multi-model feature help
5. Open an issue on the project repository

## 🔮 Future Enhancements

- [x] Multi-model query support
- [x] AI-powered response summarization
- [ ] Streaming responses for multi-model queries
- [ ] Response comparison view (side-by-side)
- [ ] Conversation history persistence
- [ ] Multiple chat threads
- [ ] Export chat functionality
- [ ] Voice input
- [ ] File attachment support
- [ ] User authentication
- [ ] Cost tracking and analytics
- [ ] Model performance statistics
- [ ] Saved model combinations

---

**Made with ❤️ using Node.js, React, and OpenRouter**