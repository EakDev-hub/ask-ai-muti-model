# 🚀 Quick Setup Guide

Follow these steps to get your AI Chat application running in 5 minutes!

## Step 1: Set Up OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys** section
4. Click **Create Key**
5. Copy your API key

## Step 2: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Create .env file from example
cp .env.example .env

# Open .env file and add your API key
nano .env  # or use any text editor
```

Your `.env` file should look like this:
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Important:** Replace `sk-or-v1-xxxxxxxxxxxxxxxxxxxxx` with your actual API key!

## Step 3: Start the Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
npm run dev
```

✅ You should see:
```
🚀 AI Chat Backend Server started successfully!
📡 Server running on: http://localhost:3001
🔑 OpenRouter API Key: ✓ Configured
```

Keep this terminal running!

## Step 4: Start the Frontend

Open a **new terminal** and run:

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

✅ You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 5: Open the Application

Open your browser and go to: **http://localhost:5173**

🎉 **You're ready!** Start chatting with AI!

## 🧪 Quick Test

1. **Text Chat:**
   - Type "Hello, who are you?" in the message box
   - Click send (📤)
   - Wait for AI response

2. **Image Analysis:**
   - Click the upload button (📎)
   - Select an image from your computer
   - Type "What's in this image?"
   - Click send

3. **Change Model:**
   - Click the dropdown at the top
   - Select a different AI model
   - Send a message

4. **Custom Prompt:**
   - Click "📋 System Prompt"
   - Change the prompt to: "You are a friendly assistant"
   - Send a message and notice the different behavior

## ❌ Troubleshooting

### Backend Error: "OPENROUTER_API_KEY is not set"
**Solution:** Make sure you created `backend/.env` and added your API key

### Frontend Can't Connect
**Solution:** Make sure backend is running on port 3001

### "No response from OpenRouter API"
**Solution:** 
- Check your API key is valid
- Verify you have credits on OpenRouter account
- Check your internet connection

### Port Already in Use
**Backend (3001):**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Frontend (5173):**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 📁 Project Structure Overview

```
idcardread/
├── backend/           # Express API (Port 3001)
│   ├── .env          # ⚠️ Your API key goes here
│   └── src/
├── frontend/         # React App (Port 5173)
│   └── src/
└── README.md
```

## 🔄 Restart Everything

If something goes wrong:

1. **Stop both servers** (Ctrl+C in both terminals)
2. **Clear node_modules** (optional):
   ```bash
   cd backend && rm -rf node_modules && npm install
   cd ../frontend && rm -rf node_modules && npm install
   ```
3. **Start both servers again**

## 💡 Tips

- Keep both terminals open while using the app
- Check terminal output for errors
- Use Chrome DevTools Console (F12) to debug frontend issues
- Backend logs show all API requests

## 🎯 Next Steps

Once everything is working:
1. Explore different AI models
2. Try custom system prompts
3. Upload various types of images
4. Read the full [README.md](README.md) for advanced features
5. Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the code

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Verify your OpenRouter API key is valid
3. Make sure ports 3001 and 5173 are available
4. Check [README.md](README.md) troubleshooting section
5. Review [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md) for details

---

**Happy Chatting! 🤖💬**