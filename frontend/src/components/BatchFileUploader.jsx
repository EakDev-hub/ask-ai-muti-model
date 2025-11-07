import { useRef } from 'react';
import { formatFileSize } from '../utils/fileHandler';
import './BatchFileUploader.css';

function BatchFileUploader({ photos, onFilesSelected, onRemovePhoto, onClearAll, disabled }) {
  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-section">
      <div className="upload-header">
        <h3>📁 Upload Photos</h3>
        {photos.length > 0 && (
          <div className="upload-stats">
            <span className="photo-count">{photos.length} / 100 photos</span>
            {photos.length > 0 && !disabled && (
              <button onClick={onClearAll} className="btn-clear-all">
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!disabled ? handleBrowseClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <div className="drop-zone-content">
          <div className="drop-icon">📸</div>
          <p className="drop-text">
            {disabled ? 'Processing...' : 'Drag & drop photos here or click to browse'}
          </p>
          <p className="drop-hint">
            Supported: JPG, PNG, GIF, WebP • Max 5MB per file • Up to 100 files • Auto-resize to 720p
          </p>
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map(photo => (
            <div key={photo.id} className={`photo-card ${photo.status}`}>
              <div className="photo-preview">
                <img src={photo.preview} alt={photo.name} />
                {!disabled && (
                  <button
                    className="remove-btn"
                    onClick={() => onRemovePhoto(photo.id)}
                    title="Remove photo"
                  >
                    ✕
                  </button>
                )}
                {photo.status === 'completed' && (
                  <div className="status-badge success">✓</div>
                )}
                {photo.status === 'error' && (
                  <div className="status-badge error">✗</div>
                )}
                {photo.status === 'processing' && (
                  <div className="status-badge processing">⏳</div>
                )}
              </div>
              <div className="photo-info">
                <div className="photo-name" title={photo.name}>
                  {photo.name}
                </div>
                <div className="photo-size">
                  {formatFileSize(photo.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BatchFileUploader;