const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat endpoint - send message to AI
router.post('/chat', chatController.sendMessage);

// Multi-model endpoint - send message to multiple models
router.post('/chat/multi-model', chatController.sendMultiModelMessage);

// Summarization endpoint - summarize multiple model responses
router.post('/chat/summarize', chatController.summarizeResponses);

// Batch processing endpoint - process multiple photos
router.post('/chat/batch', chatController.processBatch);

// Models endpoint - get available models
router.get('/models', chatController.getModels);

module.exports = router;