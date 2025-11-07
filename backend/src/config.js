/**
 * Backend Configuration
 * Centralized configuration for the Express server
 */

require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // OpenRouter API Configuration
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-pro-vision',
    timeout: 30000 // 30 seconds
  },

  // Multi-Model Configuration
  multiModel: {
    maxModels: 4,
    minModels: 2,
    timeout: 45000, // 45 seconds
    defaultSummaryPrompt: 'Compare and synthesize these responses into a comprehensive answer. Provide a unified, coherent response that captures the key insights from all models.'
  },

  // Batch Processing Configuration
  batch: {
    maxPhotos: 100,
    maxConcurrent: 5,
    timeout: 120000, // 2 minutes per photo
    maxTotalSize: 100 * 1024 * 1024 // 100MB total
  },

  // ID Card Processing Configuration
  idCard: {
    maxPhotos: 50,
    maxConcurrent: 5,
    timeout: 180000, // 3 minutes per photo (3 steps)
    
    // Step timeouts
    detectionTimeout: 30000,
    localizationTimeout: 60000,
    ocrTimeout: 90000,
    
    // Confidence thresholds
    minDetectionConfidence: 70,
    minLocalizationConfidence: 60,
    minOCRConfidence: 50,
    
    // Supported fields
    supportedFields: [
      'identityNumber',
      'titleTh',
      'firstNameTh',
      'lastNameTh',
      'titleEn',
      'firstNameEn',
      'lastNameEn',
      'dateOfBirthEn',
      'dateOfBirthTh'
    ]
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Upload Configuration
  upload: {
    maxFileSize: '10mb',
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ]
  },

  // Rate Limiting (optional - not yet implemented)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'simple'
  }
};

// Validation
if (!config.openrouter.apiKey && config.server.nodeEnv !== 'test') {
  console.error('⚠️  WARNING: OPENROUTER_API_KEY is not set in environment variables');
}

module.exports = config;