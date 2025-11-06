import './BatchProgressTracker.css';

function BatchProgressTracker({ progress, processing }) {
  const percentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div className="progress-section">
      <h3>⚡ Progress</h3>
      <div className="progress-content">
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{progress.total}</span>
          </div>
          <div className="stat success">
            <span className="stat-label">✓ Completed:</span>
            <span className="stat-value">{progress.completed}</span>
          </div>
          <div className="stat error">
            <span className="stat-label">✗ Failed:</span>
            <span className="stat-value">{progress.failed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">{percentage}%</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div 
            className={`progress-bar ${processing ? 'processing' : 'complete'}`}
            style={{ width: `${percentage}%` }}
          >
            <span className="progress-text">{percentage}%</span>
          </div>
        </div>

        {processing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Processing photos...</span>
          </div>
        )}

        {!processing && progress.total > 0 && (
          <div className="completion-message">
            {progress.failed === 0 ? (
              <span className="success-message">✓ All photos processed successfully!</span>
            ) : (
              <span className="warning-message">
                ⚠️ Processing complete with {progress.failed} failure{progress.failed !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchProgressTracker;