const express = require('express');
const router = express.Router();
const idCardController = require('../controllers/idCardController');

// Process ID cards endpoint
router.post('/process', idCardController.processIDCards);

// Get recommended models
router.get('/recommended-models', idCardController.getRecommendedModels);

module.exports = router;