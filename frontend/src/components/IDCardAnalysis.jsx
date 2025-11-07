import { useState, useEffect } from 'react';
import { processIDCards } from '../services/api';
import { validateFile, fileToBase64, resizeImageTo720p, generateFileId, formatFileSize } from '../utils/fileHandler';
import ModelSelectorTriple from './ModelSelectorTriple';
import BatchFileUploader from './BatchFileUploader';
import ProcessingSteps from './ProcessingSteps';
import IDCardResultsTable from './IDCardResultsTable';
import './IDCardAnalysis.css';

function IDCardAnalysis() {
  // State management
  const [models, setModels] = useState({
    detection: '',
    localization: '',
    ocr: ''
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    failed: 0
  });

  const handleFilesSelected = async (files) => {
    // Validate batch size
    if (selectedPhotos.length + files.length > 50) {
      setError('Maximum 50 ID cards allowed per batch');
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
            status: 'pending'
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

  const handleStartProcessing = async () => {
    // Validation
    if (selectedPhotos.length === 0) {
      setError('Please select at least one ID card image');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!models.detection || !models.localization || !models.ocr) {
      setError('Please select all three AI models');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setProcessing(true);
    setError(null);
    setResults([]);
    setCurrentStep(1);
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

      // Call ID card processing API
      console.log('Starting ID card processing with models:', models);
      const response = await processIDCards(photosData, models);

      // Update results
      setResults(response.results);
      setProgress({
        total: response.summary.total,
        completed: response.summary.successful,
        failed: response.summary.failed
      });
      setCurrentStep('complete');

      console.log('Processing complete:', response.summary);

    } catch (err) {
      console.error('ID card processing error:', err);
      setError(err.message || 'Failed to process ID cards');
      setCurrentStep(1);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="idcard-analysis-container">
      <div className="idcard-content">
        <div className="idcard-header">
          <h2>🪪 ID Card Analysis</h2>
          <p>Upload ID card images and extract information with AI-powered 3-step processing</p>
        </div>

        {/* Model Selection */}
        <ModelSelectorTriple
          models={models}
          onChange={setModels}
          disabled={processing}
        />

        {/* Processing Steps Indicator */}
        {(processing || results.length > 0) && (
          <ProcessingSteps
            currentStep={currentStep}
            processing={processing}
          />
        )}

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
            onClick={handleStartProcessing}
            disabled={processing || selectedPhotos.length === 0 || !models.detection || !models.localization || !models.ocr}
            className="btn btn-primary btn-large"
          >
            {processing ? '⏳ Processing ID Cards...' : '🚀 Start Processing'}
          </button>
          
          {results.length > 0 && !processing && (
            <div className="results-info">
              ✓ Processed {progress.completed} of {progress.total} ID cards
              {progress.failed > 0 && ` (${progress.failed} failed)`}
            </div>
          )}
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <IDCardResultsTable results={results} />
        )}

        {/* Info Section */}
        {!processing && selectedPhotos.length === 0 && (
          <div className="info-section">
            <h3>📋 How It Works</h3>
            <div className="steps-info">
              <div className="info-step">
                <div className="info-number">1</div>
                <div className="info-content">
                  <h4>Detection</h4>
                  <p>AI verifies if images contain valid ID cards</p>
                </div>
              </div>
              <div className="info-step">
                <div className="info-number">2</div>
                <div className="info-content">
                  <h4>Localization</h4>
                  <p>AI locates specific fields with bounding boxes</p>
                </div>
              </div>
              <div className="info-step">
                <div className="info-number">3</div>
                <div className="info-content">
                  <h4>OCR</h4>
                  <p>AI extracts text from each field region</p>
                </div>
              </div>
            </div>
            <div className="supported-fields">
              <h4>Supported Fields:</h4>
              <ul>
                <li>Identification Number</li>
                <li>Names (Thai & English)</li>
                <li>Titles (Thai & English)</li>
                <li>Date of Birth</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IDCardAnalysis;