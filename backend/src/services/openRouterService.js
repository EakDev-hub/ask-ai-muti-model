const axios = require('axios');
const config = require('../config');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'AI Chat Application',
        'Content-Type': 'application/json'
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

    // If only text, send as string instead of array
    messages.push({
      role: 'user',
      content: userContent.length === 1 && !image ? message : userContent
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
        model.id.includes('claude-3') ||
        model.id.includes('gpt-4') ||
        (model.architecture && model.architecture.modality && 
         model.architecture.modality.includes('image'))
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

  async sendMultiModelRequest(message, image, models, systemPrompt) {
    // Validate models array
    if (!Array.isArray(models) || models.length < config.multiModel.minModels || models.length > config.multiModel.maxModels) {
      throw new Error(`Please select between ${config.multiModel.minModels} and ${config.multiModel.maxModels} models`);
    }

    // Create promises for all model requests
    const modelPromises = models.map(async (model) => {
      try {
        const result = await this.sendChatRequest(message, image, model, systemPrompt);
        return {
          model: model,
          response: result.response,
          usage: result.usage,
          success: true
        };
      } catch (error) {
        return {
          model: model,
          response: null,
          error: error.message,
          success: false
        };
      }
    });

    // Execute all requests in parallel with timeout
    try {
      const responses = await Promise.allSettled(modelPromises);
      
      // Transform settled promises to response format
      const transformedResponses = responses.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            model: models[index],
            response: null,
            error: result.reason?.message || 'Request failed',
            success: false
          };
        }
      });

      // Check if at least one model succeeded
      const successCount = transformedResponses.filter(r => r.success).length;
      if (successCount === 0) {
        throw new Error('All models failed to respond. Please try again.');
      }

      return {
        responses: transformedResponses,
        requestId: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async summarizeResponses(responses, summaryModel, systemPrompt) {
    // Validate inputs
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error('No responses provided for summarization');
    }

    if (!summaryModel) {
      throw new Error('Summary model is required');
    }

    // Filter only successful responses
    const successfulResponses = responses.filter(r => r.success && r.response);

    if (successfulResponses.length === 0) {
      throw new Error('No successful responses to summarize');
    }

    // Build summary prompt
    let summaryPrompt = systemPrompt || config.multiModel.defaultSummaryPrompt;
    summaryPrompt += '\n\nHere are the responses from different AI models:\n\n';

    successfulResponses.forEach((resp, index) => {
      summaryPrompt += `**Model ${index + 1} (${resp.model}):**\n${resp.response}\n\n`;
    });

    summaryPrompt += '\nPlease provide a comprehensive synthesis of these responses.';

    try {
      const result = await this.sendChatRequest(summaryPrompt, null, summaryModel, null);
      
      return {
        summary: result.response,
        model: summaryModel,
        usage: result.usage,
        sourceModels: successfulResponses.map(r => r.model)
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async processBatchPhotos(photos, model, prompt, systemPrompt) {
    // Validate inputs
    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error('Photos array is required');
    }

    if (photos.length > config.batch.maxPhotos) {
      throw new Error(`Maximum ${config.batch.maxPhotos} photos allowed per batch`);
    }

    if (!model) {
      throw new Error('Model is required');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Process photos in batches with concurrency limit
    const processPhoto = async (photo) => {
      const startTime = Date.now();
      
      try {
        const result = await this.sendChatRequest(
          prompt,
          photo.data,
          model,
          systemPrompt
        );

        return {
          photoName: photo.name,
          prompt: prompt,
          response: result.response,
          success: true,
          model: result.model,
          usage: result.usage,
          processingTime: Date.now() - startTime
        };
      } catch (error) {
        return {
          photoName: photo.name,
          prompt: prompt,
          response: null,
          success: false,
          error: error.message,
          processingTime: Date.now() - startTime
        };
      }
    };

    // Process in batches with concurrency limit
    const batchSize = config.batch.maxConcurrent;
    const results = [];
    
    for (let i = 0; i < photos.length; i += batchSize) {
      const batch = photos.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(photo => processPhoto(photo))
      );
      
      // Transform settled promises to results
      const transformedResults = batchResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            photoName: batch[index].name,
            prompt: prompt,
            response: null,
            success: false,
            error: result.reason?.message || 'Processing failed'
          };
        }
      });
      
      results.push(...transformedResults);
    }

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      results: results,
      summary: {
        total: photos.length,
        successful: successful,
        failed: failed,
        processingTime: results.reduce((sum, r) => sum + (r.processingTime || 0), 0)
      }
    };
  }

  handleError(error) {
    if (error.response) {
      const errorMessage = error.response.data.error?.message ||
                          error.response.data.message ||
                          error.response.statusText;
      return new Error(`OpenRouter API Error: ${errorMessage}`);
    } else if (error.request) {
      return new Error('No response from OpenRouter API. Please check your connection.');
    } else {
      return new Error(`Request setup error: ${error.message}`);
    }
  }
}

module.exports = new OpenRouterService();