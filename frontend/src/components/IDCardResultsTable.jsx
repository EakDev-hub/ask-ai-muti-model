import { useState } from 'react';
import { exportIDCardToCSV } from '../utils/idCardCsvExport';
import IDCardAnnotationModal from './IDCardAnnotationModal';
import './IDCardResultsTable.css';

function IDCardResultsTable({ results, onExport }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedResult, setSelectedResult] = useState(null);

  const toggleRowExpansion = (imageName) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(imageName)) {
      newExpanded.delete(imageName);
    } else {
      newExpanded.add(imageName);
    }
    setExpandedRows(newExpanded);
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
  };

  const handleExport = () => {
    try {
      exportIDCardToCSV(results);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV: ' + error.message);
    }
  };

  if (!results || results.length === 0) {
    return null;
  }

  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);

  return (
    <div className="idcard-results-table">
      <div className="results-header">
        <div className="results-title">
          <h3>📊 Processing Results</h3>
          <div className="results-summary">
            <span className="success-count">
              ✓ {successfulResults.length} Successful
            </span>
            {failedResults.length > 0 && (
              <span className="failed-count">
                ✗ {failedResults.length} Failed
              </span>
            )}
          </div>
        </div>
        <button onClick={handleExport} className="btn btn-success">
          📥 Export to CSV
        </button>
      </div>

      {/* Successful Results */}
      {successfulResults.length > 0 && (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Image</th>
                <th>ID Card %</th>
                <th>Title EN</th>
                <th>Title EN %</th>
                <th>Title TH</th>
                <th>Title TH %</th>
                <th>First Name EN</th>
                <th>First Name EN %</th>
                <th>First Name TH</th>
                <th>First Name TH %</th>
                <th>Last Name EN</th>
                <th>Last Name EN %</th>
                <th>Last Name TH</th>
                <th>Last Name TH %</th>
                <th>ID Number</th>
                <th>ID Number %</th>
                <th>Date of Birth</th>
                <th>DOB %</th>
              </tr>
            </thead>
            <tbody>
              {successfulResults.map((result) => (
                <tr key={result.imageName} className="data-row">
                  <td>
                    <button
                      className="btn-view-annotations"
                      onClick={() => setSelectedResult(result)}
                      title="View field annotations"
                    >
                      🔍 View
                    </button>
                  </td>
                  <td className="image-name">{result.imageName}</td>
                  <td className={getConfidenceClass(result.idcardConfidentailPercent)}>
                    {result.idcardConfidentailPercent}%
                  </td>
                  <td>{result.titleEn || '-'}</td>
                  <td className={getConfidenceClass(result.titleEnConfidentailPercent)}>
                    {result.titleEnConfidentailPercent}%
                  </td>
                  <td>{result.titleTh || '-'}</td>
                  <td className={getConfidenceClass(result.titleThConfidentailPercent)}>
                    {result.titleThConfidentailPercent}%
                  </td>
                  <td>{result.firstNameEn || '-'}</td>
                  <td className={getConfidenceClass(result.firstNameEnConfidentailPercent)}>
                    {result.firstNameEnConfidentailPercent}%
                  </td>
                  <td>{result.firstNameTh || '-'}</td>
                  <td className={getConfidenceClass(result.firstNameThConfidentailPercent)}>
                    {result.firstNameThConfidentailPercent}%
                  </td>
                  <td>{result.lastNameEn || '-'}</td>
                  <td className={getConfidenceClass(result.lastNameEnConfidentailPercent)}>
                    {result.lastNameEnConfidentailPercent}%
                  </td>
                  <td>{result.lastNameTh || '-'}</td>
                  <td className={getConfidenceClass(result.lastNameThConfidentailPercent)}>
                    {result.lastNameThConfidentailPercent}%
                  </td>
                  <td>{result.identityNumber || '-'}</td>
                  <td className={getConfidenceClass(result.identityNumberConfidentailPercent)}>
                    {result.identityNumberConfidentailPercent}%
                  </td>
                  <td>{result.dateOfBirth || '-'}</td>
                  <td className={getConfidenceClass(result.dateOfBirthConfidentailPercent)}>
                    {result.dateOfBirthConfidentailPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Failed Results */}
      {failedResults.length > 0 && (
        <div className="failed-results">
          <h4>⚠️ Failed to Process</h4>
          <div className="failed-list">
            {failedResults.map((result) => (
              <div key={result.imageName} className="failed-item">
                <span className="failed-name">{result.imageName}</span>
                <span className="failed-error">{result.error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Annotation Modal */}
      {selectedResult && (
        <IDCardAnnotationModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}

export default IDCardResultsTable;