# 🔑 How to Get Your OpenRouter API Key

The error you're seeing is **expected** because you need to add your own OpenRouter API key to the backend configuration.

## Quick Fix (5 minutes)

### Step 1: Get Your API Key

1. **Go to OpenRouter:** https://openrouter.ai/
2. **Sign Up/Login:**
   - Click "Sign In" (top right)
   - You can use Google, GitHub, or email
   - It's **free** to sign up!

3. **Create an API Key:**
   - After logging in, click on your profile
   - Go to "Keys" section
   - Click "Create Key"
   - Give it a name like "AI Chat App"
   - Copy the key (it starts with `sk-or-v1-...`)

4. **Add Credits (Optional):**
   - Go to "Credits" section
   - Add $5-$10 to get started
   - Most requests cost $0.001-$0.01

### Step 2: Add Key to Your Project

1. **Open the backend/.env file**
   ```bash
   # In your text editor, open:
   backend/.env
   ```

2. **Replace the placeholder:**
   
   **BEFORE:**
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   
   **AFTER:**
   ```env
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   (Replace with your actual key!)

3. **Save the file**

### Step 3: Restart Backend

In Terminal 1, restart the backend:
```bash
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

You should now see:
```
🔑 OpenRouter API Key: ✓ Configured
```

### Step 4: Test It!

1. Go to http://localhost:5173
2. Type a message: "Hello, who are you?"
3. Click Send
4. The AI should respond!

## 💡 Alternative: Free API Testing

If you want to test without adding credits immediately:

1. OpenRouter gives you **free credits** when you sign up
2. You can also use their **free models** (limited features)
3. Some models are as low as $0.0001 per request

## ⚠️ Important Security Notes

- ✅ Never share your API key publicly
- ✅ Never commit `.env` file to Git (it's in `.gitignore`)
- ✅ The key is only stored in backend, never exposed to frontend
- ✅ If leaked, regenerate it immediately on OpenRouter

## 🧪 Testing Your Setup

After adding your key, test these:

1. **Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"OK"}`

2. **Models List:**
   ```bash
   curl http://localhost:3001/api/models
   ```
   Should return a list of available models

3. **Send Test Message:**
   - Open http://localhost:5173
   - Type "Hello"
   - Click send
   - Should get AI response

## 🆘 Troubleshooting

### "Invalid API key"
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Key should start with `sk-or-v1-`

### "Insufficient credits"
- Add credits on OpenRouter dashboard
- Or use free models

### Still seeing "No cookie auth credentials found"
- Make sure you saved the `.env` file
- Restart the backend server
- Check the key is on line 2 of `backend/.env`

## 📊 Pricing Information

Typical costs per request:
- GPT-4 Vision: $0.01 - $0.03
- Claude 3 Opus: $0.015 - $0.075
- Gemini Pro Vision: $0.00025 - $0.0005

Most users spend $1-5 per month for moderate use.

## ✅ Verification Checklist

- [ ] Created OpenRouter account
- [ ] Generated API key
- [ ] Copied key to `backend/.env`
- [ ] No placeholder text remains
- [ ] Saved the file
- [ ] Restarted backend server
- [ ] Backend shows "✓ Configured"
- [ ] Frontend can connect
- [ ] AI responds to messages

---

**Need Help?** Check the [README.md](README.md) troubleshooting section!