// localStorage utility for caching user preferences
const STORAGE_KEY = 'ai-chat-preferences';
const VERSION = '1.0';

// Default preferences
const DEFAULT_PREFERENCES = {
  systemPrompt: 'You are a helpful AI assistant that can analyze images and answer questions.',
  selectedModel: 'google/gemini-pro-vision',
  selectedModels: [],
  multiModelMode: false,
  version: VERSION
};

/**
 * Load preferences from localStorage
 * @returns {Object} User preferences or defaults if not found/invalid
 */
export const loadPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);
    
    // Validate version compatibility
    if (parsed.version !== VERSION) {
      console.log('Preferences version mismatch, using defaults');
      return DEFAULT_PREFERENCES;
    }

    // Merge with defaults to handle missing keys
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      selectedModels: Array.isArray(parsed.selectedModels) ? parsed.selectedModels : []
    };
  } catch (error) {
    console.error('Failed to load preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Save preferences to localStorage
 * @param {Object} preferences - Preferences to save
 */
export const savePreferences = (preferences) => {
  try {
    const toSave = {
      ...preferences,
      version: VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save preferences to localStorage:', error);
  }
};

/**
 * Clear preferences from localStorage
 */
export const clearPreferences = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preferences from localStorage:', error);
  }
};

/**
 * Validate and filter model selections against available models
 * @param {Array} selectedModels - Currently selected model IDs
 * @param {Array} availableModels - Available model objects
 * @returns {Array} Filtered valid model IDs
 */
export const validateModelSelections = (selectedModels, availableModels) => {
  if (!Array.isArray(selectedModels) || !Array.isArray(availableModels)) {
    return [];
  }

  const availableModelIds = availableModels.map(m => m.id);
  return selectedModels.filter(modelId => availableModelIds.includes(modelId));
};