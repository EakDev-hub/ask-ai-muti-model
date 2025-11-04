/**
 * Frontend Configuration
 * Centralized configuration for the React application
 */

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 30000, // 30 seconds
  },

  // Default AI Settings
  ai: {
    defaultModel: 'google/gemini-pro-vision',
    defaultSystemPrompt: 'You are a helpful AI assistant that can analyze images and answer questions.',
    
    // Alternative model options
    recommendedModels: [
      'google/gemini-pro-vision',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'openai/gpt-4-vision-preview'
    ]
  },

  // Upload Configuration
  upload: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },

  // UI Configuration
  ui: {
    theme: 'gradient-purple',
    autoScrollToNewMessage: true,
    showTimestamps: false,
    showModelInMessage: true,
    animationsEnabled: true
  },

  // Feature Flags
  features: {
    imageUpload: true,
    modelSelection: true,
    systemPromptEdit: true,
    markdownSupport: true
  }
};

export default config;