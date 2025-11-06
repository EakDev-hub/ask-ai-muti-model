import { useState } from 'react';
import './BatchResultsTable.css';

function BatchResultsTable({ results, onExport }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const filteredResults = results.filter(result => 
    result.photoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (result.response && result.response.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="results-section">
      <div className="results-header">
        <h3>📊 Results</h3>
        <div className="results-actions">
          <input
            type="text"
            placeholder="🔍 Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={onExport} className="btn btn-success">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '25%' }}>Picture Name</th>
              <th style={{ width: '25%' }}>Prompt</th>
              <th style={{ width: '45%' }}>Response</th>
              <th style={{ width: '80px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">
                  {searchTerm ? 'No results match your search' : 'No results yet'}
                </td>
              </tr>
            ) : (
              filteredResults.map((result, index) => (
                <tr key={index} className={expandedRows.has(index) ? 'expanded' : ''}>
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => toggleRow(index)}
                      title={expandedRows.has(index) ? 'Collapse' : 'Expand'}
                    >
                      {expandedRows.has(index) ? '▼' : '▶'}
                    </button>
                  </td>
                  <td className="photo-name-cell">
                    <div className="cell-content">
                      {result.photoName}
                    </div>
                  </td>
                  <td className="prompt-cell">
                    <div className={`cell-content ${expandedRows.has(index) ? 'expanded' : ''}`}>
                      {result.prompt}
                    </div>
                  </td>
                  <td className="response-cell">
                    <div className={`cell-content ${expandedRows.has(index) ? 'expanded' : ''}`}>
                      {result.success ? (
                        result.response
                      ) : (
                        <span className="error-text">
                          Error: {result.error || 'Processing failed'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="status-cell">
                    {result.success ? (
                      <span className="status-badge success">✓ Success</span>
                    ) : (
                      <span className="status-badge error">✗ Failed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredResults.length > 0 && (
        <div className="results-summary">
          Showing {filteredResults.length} of {results.length} results
        </div>
      )}
    </div>
  );
}

export default BatchResultsTable;