import { useState, useEffect } from 'react';
import { getModels, processBatch } from '../services/api';
import { validateFile, fileToBase64, resizeImageTo720p, generateFileId, validateBatch, formatFileSize } from '../utils/fileHandler';
import { exportToCSV } from '../utils/csvExport';
import BatchFileUploader from './BatchFileUploader';
import BatchProgressTracker from './BatchProgressTracker';
import BatchResultsTable from './BatchResultsTable';
import './BatchPhotoAnalysis.css';

function BatchPhotoAnalysis() {
  // State management
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    failed: 0
  });

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const fetchedModels = await getModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0 && !selectedModel) {
        setSelectedModel(fetchedModels[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
      setError('Failed to load AI models');
    }
  };

  const handleFilesSelected = async (files) => {
    // Validate batch
    const validation = validateBatch(files, 100);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setTimeout(() => setError(null), 5000);
      return;
    }

    // Process each file
    const newPhotos = [];
    for (const file of files) {
      const fileValidation = validateFile(file);
      if (fileValidation.valid) {
        try {
          // Resize image to 720p if needed
          const resizedBase64 = await resizeImageTo720p(file);
          
          newPhotos.push({
            id: generateFileId(),
            file: file,
            name: file.name,
            preview: resizedBase64,
            size: file.size,
            status: 'pending',
            response: null,
            error: null
          });
        } catch (err) {
          console.error(`Failed to process ${file.name}:`, err);
        }
      } else {
        setError(`${file.name}: ${fileValidation.errors.join(', ')}`);
        setTimeout(() => setError(null), 5000);
      }
    }

    setSelectedPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (photoId) => {
    setSelectedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleClearAll = () => {
    setSelectedPhotos([]);
    setResults([]);
    setProgress({ total: 0, completed: 0, failed: 0 });
  };

  const handleStartAnalysis = async () => {
    // Validation
    if (selectedPhotos.length === 0) {
      setError('Please select at least one photo');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!selectedModel) {
      setError('Please select an AI model');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setProcessing(true);
    setError(null);
    setResults([]);
    setProgress({
      total: selectedPhotos.length,
      completed: 0,
      failed: 0
    });

    try {
      // Prepare photos for API
      const photosData = selectedPhotos.map(photo => ({
        name: photo.name,
        data: photo.preview
      }));

      // Call batch API
      const response = await processBatch(
        photosData,
        selectedModel,
        prompt,
        systemPrompt || undefined
      );

      // Update results
      setResults(response.results);
      setProgress({
        total: response.summary.total,
        completed: response.summary.successful,
        failed: response.summary.failed
      });

      // Update photo statuses
      const updatedPhotos = selectedPhotos.map(photo => {
        const result = response.results.find(r => r.photoName === photo.name);
        if (result) {
          return {
            ...photo,
            status: result.success ? 'completed' : 'error',
            response: result.response,
            error: result.error
          };
        }
        return photo;
      });
      setSelectedPhotos(updatedPhotos);

    } catch (err) {
      console.error('Batch processing error:', err);
      setError(err.message || 'Failed to process batch');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportCSV = () => {
    try {
      if (results.length === 0) {
        setError('No results to export');
        setTimeout(() => setError(null), 3000);
        return;
      }
      exportToCSV(results);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export CSV');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="batch-analysis-container">
      <div className="batch-content">
        <div className="batch-header">
          <h2>📊 Batch Photo Analysis</h2>
          <p>Upload multiple photos and analyze them with AI</p>
        </div>

        {/* Configuration Section */}
        <div className="config-section">
          <h3>⚙️ Configuration</h3>
          <div className="config-grid">
            <div className="form-group">
              <label htmlFor="model-select">AI Model</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={processing}
                className="model-select"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="prompt-input">Analysis Prompt</label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt (e.g., 'Describe this image in detail')"
                disabled={processing}
                className="prompt-input"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <button
                type="button"
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="system-prompt-toggle"
                disabled={processing}
              >
                {showSystemPrompt ? '▼' : '▶'} Advanced: System Prompt (Optional)
              </button>
              {showSystemPrompt && (
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt (optional)"
                  disabled={processing}
                  className="system-prompt-input"
                  rows="2"
                />
              )}
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <BatchFileUploader
          photos={selectedPhotos}
          onFilesSelected={handleFilesSelected}
          onRemovePhoto={handleRemovePhoto}
          onClearAll={handleClearAll}
          disabled={processing}
        />

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-section">
          <button
            onClick={handleStartAnalysis}
            disabled={processing || selectedPhotos.length === 0 || !prompt.trim()}
            className="btn btn-primary btn-large"
          >
            {processing ? '⏳ Processing...' : '🚀 Start Analysis'}
          </button>
          
          {results.length > 0 && !processing && (
            <button
              onClick={handleExportCSV}
              className="btn btn-success btn-large"
            >
              📥 Export to CSV
            </button>
          )}
        </div>

        {/* Progress Tracker */}
        {(processing || results.length > 0) && (
          <BatchProgressTracker
            progress={progress}
            processing={processing}
          />
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <BatchResultsTable
            results={results}
            onExport={handleExportCSV}
          />
        )}
      </div>
    </div>
  );
}

export default BatchPhotoAnalysis;