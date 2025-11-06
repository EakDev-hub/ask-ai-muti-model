import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendMessage = async (message, image, model, systemPrompt) => {
  try {
    const response = await api.post('/chat', {
      message,
      image,
      model,
      systemPrompt
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to send message';
  }
};

export const getModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data.models;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to fetch models';
  }
};

export const sendMultiModelMessage = async (message, image, models, systemPrompt) => {
  try {
    const response = await api.post('/chat/multi-model', {
      message,
      image,
      models,
      systemPrompt
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to send multi-model message';
  }
};

export const processBatch = async (photos, model, prompt, systemPrompt) => {
  try {
    const response = await api.post('/chat/batch', {
      photos,
      model,
      prompt,
      systemPrompt
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to process batch';
  }
};

export default api;