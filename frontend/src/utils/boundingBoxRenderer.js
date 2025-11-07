/**
 * Bounding Box Renderer Utility
 * Handles drawing bounding boxes on canvas for ID card field visualization
 */

// Color scheme for different field types
export const FIELD_COLOR_SCHEME = {
  id: '#FF6B6B',        // Red for ID Number
  name: '#4ECDC4',      // Teal for names
  title: '#95E1D3',     // Light teal for titles
  dob: '#FFE66D',       // Yellow for date of birth
  other: '#A8E6CF'      // Light green for other fields
};

// Field categories for legend organization
export const FIELD_CATEGORIES = {
  'Identity': ['identityNumber'],
  'Names (English)': ['titleEn', 'firstNameEn', 'lastNameEn'],
  'Names (Thai)': ['titleTh', 'firstNameTh', 'lastNameTh'],
  'Date of Birth': ['dateOfBirthEn', 'dateOfBirthTh']
};

/**
 * Draw bounding boxes on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} imageBase64 - Base64 image data
 * @param {Object} boundingBoxes - Field bounding boxes
 * @param {Object} colorScheme - Color mapping for fields
 * @param {string|null} highlightedField - Field to highlight
 * @returns {Promise<void>}
 */
export const drawBoundingBoxes = async (
  canvas,
  imageBase64,
  boundingBoxes,
  colorScheme = FIELD_COLOR_SCHEME,
  highlightedField = null
) => {
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw each bounding box
      Object.entries(boundingBoxes).forEach(([fieldName, fieldData]) => {
        if (!fieldData.bbox || !Array.isArray(fieldData.bbox)) return;

        const [ymin, xmin, ymax, xmax] = fieldData.bbox;
        
        // Convert normalized coordinates to pixels
        const x = xmin * img.width;
        const y = ymin * img.height;
        const width = (xmax - xmin) * img.width;
        const height = (ymax - ymin) * img.height;

        // Determine if this field is highlighted
        const isHighlighted = highlightedField === fieldName;
        const color = colorScheme[getFieldType(fieldName)];
        
        // Draw rectangle
        ctx.strokeStyle = color;
        ctx.lineWidth = isHighlighted ? 4 : 2;
        ctx.strokeRect(x, y, width, height);

        // Draw semi-transparent fill for highlighted field
        if (isHighlighted) {
          ctx.fillStyle = color + '33'; // Add alpha
          ctx.fillRect(x, y, width, height);
        }

        // Draw field label
        drawFieldLabel(ctx, fieldName, fieldData, x, y, color, isHighlighted);
      });

      resolve();
    };

    img.onerror = (err) => {
      console.error('Failed to load image:', err);
      reject(new Error('Failed to load image for annotation'));
    };
    
    img.src = imageBase64;
  });
};

/**
 * Draw field label with confidence
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} fieldName - Field name
 * @param {Object} fieldData - Field data with confidence and text
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Label color
 * @param {boolean} isHighlighted - Whether field is highlighted
 */
const drawFieldLabel = (ctx, fieldName, fieldData, x, y, color, isHighlighted) => {
  const label = formatFieldName(fieldName);
  const confidence = `${Math.round(fieldData.confidence)}%`;
  const fontSize = isHighlighted ? 14 : 12;
  
  ctx.font = `bold ${fontSize}px Arial`;
  
  // Measure text width
  const textWidth = ctx.measureText(`${label}: ${confidence}`).width;
  const padding = 4;
  const labelHeight = fontSize + 6;
  
  // Draw background for text
  ctx.fillStyle = color;
  ctx.fillRect(x - 2, y - labelHeight - 2, textWidth + padding * 2, labelHeight);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.fillText(`${label}: ${confidence}`, x + padding - 2, y - 4);
};

/**
 * Get field type for color mapping
 * @param {string} fieldName - Field name
 * @returns {string} Field type
 */
const getFieldType = (fieldName) => {
  if (fieldName === 'identityNumber') return 'id';
  if (fieldName.includes('Name')) return 'name';
  if (fieldName.includes('title')) return 'title';
  if (fieldName.includes('dateOfBirth')) return 'dob';
  return 'other';
};

/**
 * Format field name for display
 * @param {string} fieldName - Field name
 * @returns {string} Formatted name
 */
export const formatFieldName = (fieldName) => {
  const nameMap = {
    identityNumber: 'ID Number',
    titleEn: 'Title (EN)',
    titleTh: 'Title (TH)',
    firstNameEn: 'First Name (EN)',
    firstNameTh: 'First Name (TH)',
    lastNameEn: 'Last Name (EN)',
    lastNameTh: 'Last Name (TH)',
    dateOfBirthEn: 'DOB (EN)',
    dateOfBirthTh: 'DOB (TH)'
  };
  return nameMap[fieldName] || fieldName;
};