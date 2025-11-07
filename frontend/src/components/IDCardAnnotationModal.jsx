import { useState, useEffect, useRef } from 'react';
import { drawBoundingBoxes, FIELD_COLOR_SCHEME, FIELD_CATEGORIES, formatFieldName } from '../utils/boundingBoxRenderer';
import './IDCardAnnotationModal.css';

function IDCardAnnotationModal({ result, onClose }) {
  const canvasRef = useRef(null);
  const [highlightedField, setHighlightedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!result || !result.originalImage || !result.boundingBoxes) {
      setLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(null);
    
    drawBoundingBoxes(
      canvas,
      result.originalImage,
      result.boundingBoxes,
      FIELD_COLOR_SCHEME,
      highlightedField
    ).then(() => {
      setLoading(false);
    }).catch(err => {
      console.error('Failed to draw bounding boxes:', err);
      setError('Failed to render annotations');
      setLoading(false);
    });
  }, [result, highlightedField]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!result) return null;

  const hasValidBBoxes = result.boundingBoxes && 
    Object.keys(result.boundingBoxes).length > 0;

  const getFieldColor = (fieldName) => {
    if (fieldName === 'identityNumber') return FIELD_COLOR_SCHEME.id;
    if (fieldName.includes('Name')) return FIELD_COLOR_SCHEME.name;
    if (fieldName.includes('title')) return FIELD_COLOR_SCHEME.title;
    if (fieldName.includes('dateOfBirth')) return FIELD_COLOR_SCHEME.dob;
    return FIELD_COLOR_SCHEME.other;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔍 Field Localization - {result.imageName}</h3>
          <button className="modal-close" onClick={onClose} title="Close (ESC)">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Rendering annotations...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}

          {!hasValidBBoxes && !loading && !error && (
            <div className="no-bbox-message">
              <p>⚠️ No bounding box data available for this image</p>
              <p className="sub-message">
                The AI may have failed to localize fields during processing
              </p>
            </div>
          )}

          {hasValidBBoxes && !error && (
            <div className="annotation-container">
              <div className="canvas-wrapper">
                <canvas ref={canvasRef} className="annotation-canvas" />
              </div>

              <div className="field-legend">
                <h4>Detected Fields</h4>
                <p className="legend-hint">Hover over fields to highlight them on the image</p>
                
                {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => {
                  // Filter to only show fields that exist in the result
                  const existingFields = fields.filter(fieldName => {
                    const fieldData = result.boundingBoxes[fieldName];
                    return fieldData && fieldData.bbox;
                  });

                  if (existingFields.length === 0) return null;

                  return (
                    <div key={category} className="legend-category">
                      <h5>{category}</h5>
                      {existingFields.map(fieldName => {
                        const fieldData = result.boundingBoxes[fieldName];
                        const color = getFieldColor(fieldName);

                        return (
                          <div
                            key={fieldName}
                            className={`legend-item ${highlightedField === fieldName ? 'highlighted' : ''}`}
                            onMouseEnter={() => setHighlightedField(fieldName)}
                            onMouseLeave={() => setHighlightedField(null)}
                          >
                            <div
                              className="legend-color"
                              style={{ backgroundColor: color }}
                            />
                            <div className="legend-details">
                              <span className="legend-name">
                                {formatFieldName(fieldName)}
                              </span>
                              <span className="legend-confidence">
                                {Math.round(fieldData.confidence)}%
                              </span>
                            </div>
                            {fieldData.text && (
                              <span className="legend-text" title={fieldData.text}>
                                "{fieldData.text}"
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <span className="key-hint">Press ESC to close</span>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default IDCardAnnotationModal;