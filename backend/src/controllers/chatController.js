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

    // Call OpenRouter service
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
    
    // Sort models alphabetically by name (ascending)
    const sortedModels = models.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    res.json({ models: sortedModels });
  } catch (error) {
    next(error);
  }
};

exports.sendMultiModelMessage = async (req, res, next) => {
  try {
    const { message, image, models, systemPrompt } = req.body;

    // Validation
    if (!message && !image) {
      return res.status(400).json({
        error: 'Either message or image is required'
      });
    }

    if (!models || !Array.isArray(models) || models.length < 2 || models.length > 4) {
      return res.status(400).json({
        error: 'Please select between 2 and 4 models'
      });
    }

    // Call OpenRouter service for multi-model request
    const result = await openRouterService.sendMultiModelRequest(
      message,
      image,
      models,
      systemPrompt
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.summarizeResponses = async (req, res, next) => {
  try {
    const { responses, summaryModel, systemPrompt } = req.body;

    // Validation
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        error: 'Responses array is required'
      });
    }

    if (!summaryModel) {
      return res.status(400).json({
        error: 'Summary model is required'
      });
    }

    // Call OpenRouter service for summarization
    const result = await openRouterService.summarizeResponses(
      responses,
      summaryModel,
      systemPrompt
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};