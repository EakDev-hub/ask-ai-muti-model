import { useState, useEffect } from 'react';
import { getModels, getRecommendedModels } from '../services/api';
import './ModelSelectorTriple.css';

function ModelSelectorTriple({ models, onChange, disabled }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [recommendedModels, setRecommendedModels] = useState({
    detection: [],
    localization: [],
    ocr: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelsData();
  }, []);

  const fetchModelsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all available models
      const allModels = await getModels();
      setAvailableModels(allModels);
      
      // Fetch recommended models for each step
      const recommended = await getRecommendedModels();
      setRecommendedModels(recommended);
      
      // Auto-select first recommended model for each step if not set
      if (!models.detection && recommended.detection.length > 0) {
        onChange({
          ...models,
          detection: recommended.detection[0]
        });
      }
      if (!models.localization && recommended.localization.length > 0) {
        onChange({
          ...models,
          localization: recommended.localization[0]
        });
      }
      if (!models.ocr && recommended.ocr.length > 0) {
        onChange({
          ...models,
          ocr: recommended.ocr[0]
        });
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (step, modelId) => {
    onChange({
      ...models,
      [step]: modelId
    });
  };

  const isRecommended = (step, modelId) => {
    return recommendedModels[step]?.includes(modelId);
  };

  if (loading) {
    return (
      <div className="model-selector-triple">
        <div className="loading-state">Loading models...</div>
      </div>
    );
  }

  return (
    <div className="model-selector-triple">
      <div className="model-selector-header">
        <h3>🤖 AI Model Selection</h3>
        <p>Choose specialized models for each processing step</p>
      </div>

      <div className="model-selectors-grid">
        {/* Step 1: Detection */}
        <div className="model-selector-item">
          <label htmlFor="detection-model">
            <span className="step-number">1</span>
            <span className="step-name">Detection Model</span>
          </label>
          <p className="step-description">Identifies if image contains an ID card</p>
          <select
            id="detection-model"
            value={models.detection}
            onChange={(e) => handleModelChange('detection', e.target.value)}
            disabled={disabled}
            className="model-select"
          >
            <option value="">Select model...</option>
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} {isRecommended('detection', model.id) && '⭐'}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Localization */}
        <div className="model-selector-item">
          <label htmlFor="localization-model">
            <span className="step-number">2</span>
            <span className="step-name">Localization Model</span>
          </label>
          <p className="step-description">Finds field locations with bounding boxes</p>
          <select
            id="localization-model"
            value={models.localization}
            onChange={(e) => handleModelChange('localization', e.target.value)}
            disabled={disabled}
            className="model-select"
          >
            <option value="">Select model...</option>
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} {isRecommended('localization', model.id) && '⭐'}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: OCR */}
        <div className="model-selector-item">
          <label htmlFor="ocr-model">
            <span className="step-number">3</span>
            <span className="step-name">OCR Model</span>
          </label>
          <p className="step-description">Extracts text from cropped regions</p>
          <select
            id="ocr-model"
            value={models.ocr}
            onChange={(e) => handleModelChange('ocr', e.target.value)}
            disabled={disabled}
            className="model-select"
          >
            <option value="">Select model...</option>
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} {isRecommended('ocr', model.id) && '⭐'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="recommended-note">
        ⭐ = Recommended for this step
      </div>
    </div>
  );
}

export default ModelSelectorTriple;