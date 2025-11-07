import Papa from 'papaparse';

/**
 * Export ID card analysis results to CSV file
 * @param {Array} results - Array of ID card result objects
 * @param {String} filename - Optional custom filename
 */
export const exportIDCardToCSV = (results, filename = null) => {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  // Map results to CSV format with exact column names required
  const csvData = results.map(result => ({
    'imageName': result.imageName || '',
    'idcardConfidentailPercent': result.idcardConfidentailPercent || 0,
    'titleEn': result.titleEn || '',
    'titleEnConfidentailPercent': result.titleEnConfidentailPercent || 0,
    'titleTh': result.titleTh || '',
    'titleThConfidentailPercent': result.titleThConfidentailPercent || 0,
    'firstNameEn': result.firstNameEn || '',
    'firstNameEnConfidentailPercent': result.firstNameEnConfidentailPercent || 0,
    'firstNameTh': result.firstNameTh || '',
    'firstNameThConfidentailPercent': result.firstNameThConfidentailPercent || 0,
    'lastNameEn': result.lastNameEn || '',
    'lastNameEnConfidentailPercent': result.lastNameEnConfidentailPercent || 0,
    'lastNameTh': result.lastNameTh || '',
    'lastNameThConfidentailPercent': result.lastNameThConfidentailPercent || 0,
    'identityNumber': result.identityNumber || '',
    'identityNumberConfidentailPercent': result.identityNumberConfidentailPercent || 0,
    'dateOfBirth': result.dateOfBirth || '',
    'dateOfBirthConfidentailPercent': result.dateOfBirthConfidentailPercent || 0
  }));

  // Generate CSV string using papaparse
  const csv = Papa.unparse(csvData, {
    quotes: true,
    header: true,
    newline: '\n'
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `idcard-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};