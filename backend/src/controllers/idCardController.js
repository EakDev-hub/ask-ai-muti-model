const idCardService = require('../services/idCardService');
const config = require('../config');

/**
 * Process ID card images through 3-step pipeline
 */
exports.processIDCards = async (req, res, next) => {
  try {
    const { photos, models } = req.body;

    // Validation - photos array
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({
        error: 'Photos array is required and must not be empty'
      });
    }

    // Validation - max photos
    if (photos.length > config.idCard.maxPhotos) {
      return res.status(400).json({
        error: `Maximum ${config.idCard.maxPhotos} photos allowed per batch`
      });
    }

    // Validation - models object
    if (!models || typeof models !== 'object') {
      return res.status(400).json({
        error: 'Models object is required'
      });
    }

    // Validation - all three models required
    if (!models.detection || !models.localization || !models.ocr) {
      return res.status(400).json({
        error: 'All three models (detection, localization, ocr) are required'
      });
    }

    // Validate each photo has name and data
    for (const photo of photos) {
      if (!photo.name || !photo.data) {
        return res.status(400).json({
          error: 'Each photo must have name and data fields'
        });
      }
    }

    console.log(`Processing ${photos.length} ID card images with models:`, {
      detection: models.detection,
      localization: models.localization,
      ocr: models.ocr
    });

    // Process ID cards
    const result = await idCardService.processIDCards(photos, models);

    res.json(result);
  } catch (error) {
    console.error('ID card processing error:', error);
    next(error);
  }
};

/**
 * Get recommended models for ID card processing
 */
exports.getRecommendedModels = async (req, res, next) => {
  try {
    res.json({
      detection: [
        'google/gemini-pro-vision',
        'google/gemini-flash-1.5',
        'anthropic/claude-3-haiku'
      ],
      localization: [
        'anthropic/claude-3-opus',
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4-vision-preview',
        'google/gemini-pro-vision'
      ],
      ocr: [
        'google/gemini-pro-vision',
        'google/gemini-flash-1.5',
        'anthropic/claude-3-sonnet',
        'openai/gpt-4o'
      ]
    });
  } catch (error) {
    next(error);
  }
};