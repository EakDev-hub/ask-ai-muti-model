import Papa from 'papaparse';

/**
 * Export batch analysis results to CSV file
 * @param {Array} results - Array of result objects with photoName, prompt, response
 * @param {String} filename - Optional custom filename
 */
export const exportToCSV = (results, filename = null) => {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  // Prepare data for CSV
  const csvData = results.map(result => ({
    'Picture Name': result.photoName || '',
    'Prompt': result.prompt || '',
    'Response': result.response || (result.error ? `Error: ${result.error}` : 'No response')
  }));

  // Generate CSV string using papaparse
  const csv = Papa.unparse(csvData, {
    quotes: true, // Always quote fields
    header: true,
    newline: '\n'
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `batch-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export with custom columns
 */
export const exportToCSVCustom = (results, columns, filename = null) => {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  const csvData = results.map(result => {
    const row = {};
    columns.forEach(col => {
      row[col.header] = result[col.field] || '';
    });
    return row;
  });

  const csv = Papa.unparse(csvData, {
    quotes: true,
    header: true,
    newline: '\n'
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `export-${Date.now()}.csv`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Preview CSV data as string (for display purposes)
 */
export const previewCSV = (results, maxRows = 5) => {
  if (!results || results.length === 0) {
    return '';
  }

  const previewData = results.slice(0, maxRows).map(result => ({
    'Picture Name': result.photoName || '',
    'Prompt': result.prompt || '',
    'Response': (result.response || '').substring(0, 50) + '...'
  }));

  return Papa.unparse(previewData, {
    quotes: true,
    header: true,
    newline: '\n'
  });
};