# ID Card Analysis - Implementation Roadmap

## Overview

This roadmap provides a detailed, step-by-step implementation guide for adding the ID Card Analysis feature to the application. Follow this sequence to ensure smooth integration with existing systems.

---

## Prerequisites

- Review [`ID_CARD_ANALYSIS_ARCHITECTURE.md`](ID_CARD_ANALYSIS_ARCHITECTURE.md)
- Understand existing batch processing in [`BatchPhotoAnalysis.jsx`](../frontend/src/components/BatchPhotoAnalysis.jsx)
- Familiarize with [`openRouterService.js`](../backend/src/services/openRouterService.js)

---

## Phase 1: Backend Foundation

### Step 1.1: Update Backend Configuration

**File**: [`backend/src/config.js`](../backend/src/config.js)

**Action**: Add ID card processing configuration

```javascript
// Add to config object
idCard: {
  maxPhotos: 50,
  maxConcurrent: 5,
  timeout: 180000, // 3 minutes per photo (3 steps)
  
  // Step timeouts
  detectionTimeout: 30000,
  localizationTimeout: 60000,
  ocrTimeout: 90000,
  
  // Confidence thresholds
  minDetectionConfidence: 70,
  minLocalizationConfidence: 60,
  minOCRConfidence: 50,
  
  // Supported fields
  supportedFields: [
    'identityNumber',
    'titleTh',
    'firstNameTh',
    'lastNameTh',
    'titleEn',
    'firstNameEn',
    'lastNameEn',
    'dateOfBirthEn',
    'dateOfBirthTh'
  ]
}
```

**Verification**: Configuration loads without errors

---

### Step 1.2: Create Image Processing Utilities

**File**: [`backend/src/utils/imageUtils.js`](../backend/src/utils/imageUtils.js) (NEW)

**Action**: Create utility functions for image manipulation

```javascript
const sharp = require('sharp'); // Add to package.json

class ImageUtils {
  /**
   * Crop image region based on normalized bounding box
   * @param {string} base64Image - Base64 encoded image
   * @param {number[]} bbox - [ymin, xmin, ymax, xmax] normalized (0-1)
   * @returns {Promise<string>} Cropped base64 image
   */
  async cropRegion(base64Image, bbox) {
    // Implementation
  }

  /**
   * Validate bounding box coordinates
   * @param {number[]} bbox - [ymin, xmin, ymax, xmax]
   * @returns {boolean}
   */
  validateBoundingBox(bbox) {
    // Implementation
  }

  /**
   * Resize image if too large
   * @param {string} base64Image
   * @param {number} maxWidth
   * @returns {Promise<string>}
   */
  async resizeImage(base64Image, maxWidth = 1920) {
    // Implementation
  }
}

module.exports = new ImageUtils();
```

**Dependencies**: Add to `backend/package.json`:
```json
"sharp": "^0.33.0"
```

**Verification**: 
- Run `npm install` in backend directory
- Test cropping function with sample image and bbox

---

### Step 1.3: Create ID Card Service

**File**: [`backend/src/services/idCardService.js`](../backend/src/services/idCardService.js) (NEW)

**Action**: Implement 3-step processing pipeline

**Key Methods**:
1. `processIDCards(photos, models)` - Main orchestrator
2. `detectIDCard(imageData, model)` - Step 1: Detection
3. `localizeFields(imageData, model, cardType)` - Step 2: Localization
4. `cropFieldsFromImage(imageData, fields)` - Crop regions
5. `extractTextFromFields(croppedImages, model)` - Step 3: OCR
6. `formatResult(detection, localization, ocr)` - Compile final result

**Prompts**: Use templates from Architecture document

**Verification**:
- Unit test each method with sample data
- Verify JSON parsing from AI responses
- Test error handling

---

### Step 1.4: Update OpenRouter Service

**File**: [`backend/src/services/openRouterService.js`](../backend/src/services/openRouterService.js)

**Action**: Add support for structured JSON responses

```javascript
async sendChatRequestWithJSON(userPrompt, image, model, systemPrompt) {
  // Similar to sendChatRequest but:
  // 1. Add instruction to respond in JSON
  // 2. Parse and validate JSON response
  // 3. Return parsed object
}
```

**Verification**: Test JSON parsing with different models

---

### Step 1.5: Create ID Card Controller

**File**: [`backend/src/controllers/idCardController.js`](../backend/src/controllers/idCardController.js) (NEW)

**Action**: Create API endpoint handler

```javascript
const idCardService = require('../services/idCardService');

exports.processIDCards = async (req, res, next) => {
  try {
    const { photos, models } = req.body;

    // Validation
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({
        error: 'Photos array is required'
      });
    }

    if (!models || !models.detection || !models.localization || !models.ocr) {
      return res.status(400).json({
        error: 'All three models (detection, localization, ocr) are required'
      });
    }

    // Process
    const result = await idCardService.processIDCards(photos, models);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getRecommendedModels = async (req, res, next) => {
  try {
    res.json({
      detection: [
        'google/gemini-pro-vision',
        'anthropic/claude-3-haiku'
      ],
      localization: [
        'anthropic/claude-3-opus',
        'openai/gpt-4-vision-preview'
      ],
      ocr: [
        'google/gemini-pro-vision',
        'anthropic/claude-3-sonnet'
      ]
    });
  } catch (error) {
    next(error);
  }
};
```

**Verification**: Controller methods defined without errors

---

### Step 1.6: Create ID Card Routes

**File**: [`backend/src/routes/idCardRoutes.js`](../backend/src/routes/idCardRoutes.js) (NEW)

**Action**: Define routes

```javascript
const express = require('express');
const router = express.Router();
const idCardController = require('../controllers/idCardController');

// Process ID cards endpoint
router.post('/process', idCardController.processIDCards);

// Get recommended models
router.get('/recommended-models', idCardController.getRecommendedModels);

module.exports = router;
```

**Verification**: Routes defined correctly

---

### Step 1.7: Register Routes in Main App

**File**: [`backend/src/app.js`](../backend/src/app.js)

**Action**: Add ID card routes

```javascript
const idCardRoutes = require('./routes/idCardRoutes');

// Add after existing routes
app.use('/api/idcard', idCardRoutes);
```

**Verification**: 
- Server starts without errors
- Test endpoint with Postman: `POST http://localhost:3001/api/idcard/process`

---

## Phase 2: Frontend Components

### Step 2.1: Update Frontend Configuration

**File**: [`frontend/src/config.js`](../frontend/src/config.js)

**Action**: Add ID card configuration

```javascript
// Add to config object
idCard: {
  maxPhotos: 50,
  supportedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // Required columns for CSV export
  csvColumns: [
    'imageName',
    'idcardConfidentailPercent',
    'titleEn',
    'titleEnConfidentailPercent',
    'titleTh',
    'titleThConfidentailPercent',
    'firstNameEn',
    'firstNameEnConfidentailPercent',
    'firstNameTh',
    'firstNameThConfidentailPercent',
    'lastNameEn',
    'lastNameEnConfidentailPercent',
    'lastNameTh',
    'lastNameThConfidentailPercent',
    'identityNumber',
    'identityNumberConfidentailPercent',
    'dateOfBirth',
    'dateOfBirthConfidentailPercent'
  ]
}
```

**Verification**: Configuration accessible in components

---

### Step 2.2: Create API Service Methods

**File**: [`frontend/src/services/api.js`](../frontend/src/services/api.js)

**Action**: Add ID card processing methods

```javascript
export const processIDCards = async (photos, models) => {
  try {
    const response = await api.post('/idcard/process', {
      photos,
      models
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to process ID cards';
  }
};

export const getRecommendedModels = async () => {
  try {
    const response = await api.get('/idcard/recommended-models');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to fetch recommended models';
  }
};
```

**Verification**: Methods defined correctly

---

### Step 2.3: Create ID Card CSV Export Utility

**File**: [`frontend/src/utils/idCardCsvExport.js`](../frontend/src/utils/idCardCsvExport.js) (NEW)

**Action**: Create specialized CSV export for ID cards

```javascript
import Papa from 'papaparse';

export const exportIDCardToCSV = (results, filename = null) => {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
  }

  // Map results to CSV format with exact column names
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

  const csv = Papa.unparse(csvData, {
    quotes: true,
    header: true,
    newline: '\n'
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `idcard-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
```

**Verification**: Export function works with sample data

---

### Step 2.4: Create Model Selector Component

**File**: [`frontend/src/components/ModelSelectorTriple.jsx`](../frontend/src/components/ModelSelectorTriple.jsx) (NEW)
**File**: [`frontend/src/components/ModelSelectorTriple.css`](../frontend/src/components/ModelSelectorTriple.css) (NEW)

**Action**: Create component for selecting 3 models

**Features**:
- Three separate dropdowns for detection, localization, and OCR
- Load available models from API
- Show recommended models
- Validation (all three must be selected)

**Verification**: Component renders with model lists

---

### Step 2.5: Create Processing Steps Indicator

**File**: [`frontend/src/components/ProcessingSteps.jsx`](../frontend/src/components/ProcessingSteps.jsx) (NEW)
**File**: [`frontend/src/components/ProcessingSteps.css`](../frontend/src/components/ProcessingSteps.css) (NEW)

**Action**: Create visual step indicator

**Features**:
- Show 3 steps: Detection → Localization → OCR
- Highlight current step
- Show completion status
- Show progress for each step

**Verification**: Visual indicator displays correctly

---

### Step 2.6: Create ID Card Results Table

**File**: [`frontend/src/components/IDCardResultsTable.jsx`](../frontend/src/components/IDCardResultsTable.jsx) (NEW)
**File**: [`frontend/src/components/IDCardResultsTable.css`](../frontend/src/components/IDCardResultsTable.css) (NEW)

**Action**: Create specialized results table

**Features**:
- Display all 17 columns
- Color-code confidence percentages (green > 80, yellow 60-80, red < 60)
- Sortable columns
- Expandable rows for long text
- Export button

**Verification**: Table displays sample data correctly

---

### Step 2.7: Create Main ID Card Analysis Component

**File**: [`frontend/src/components/IDCardAnalysis.jsx`](../frontend/src/components/IDCardAnalysis.jsx) (NEW)
**File**: [`frontend/src/components/IDCardAnalysis.css`](../frontend/src/components/IDCardAnalysis.css) (NEW)

**Action**: Create main container component

**State Management**:
```javascript
const [photos, setPhotos] = useState([]);
const [models, setModels] = useState({
  detection: '',
  localization: '',
  ocr: ''
});
const [processing, setProcessing] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [progress, setProgress] = useState({
  total: 0,
  step1Complete: 0,
  step2Complete: 0,
  step3Complete: 0,
  failed: 0
});
const [results, setResults] = useState([]);
const [error, setError] = useState(null);
```

**Key Methods**:
- `handleStartProcessing()` - Initiate ID card processing
- `handleExportCSV()` - Export results to CSV

**Verification**: Component renders and state management works

---

### Step 2.8: Update Navigation Component

**File**: [`frontend/src/components/Navigation.jsx`](../frontend/src/components/Navigation.jsx)

**Action**: Add new tab for ID Card Analysis

```jsx
<NavLink 
  to="/idcard" 
  className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
>
  🪪 ID Card Analysis
</NavLink>
```

**Verification**: Navigation shows three tabs

---

### Step 2.9: Update App Router

**File**: [`frontend/src/App.jsx`](../frontend/src/App.jsx)

**Action**: Add route for ID Card Analysis

```jsx
import IDCardAnalysis from './components/IDCardAnalysis';

// Add to Routes
<Route path="/idcard" element={<IDCardAnalysis />} />
```

**Verification**: Navigation to /idcard works

---

## Phase 3: Integration & Testing

### Step 3.1: Backend Integration Testing

**Actions**:
1. Start backend server
2. Test with Postman using sample ID card images
3. Verify each step processes correctly
4. Check error handling

**Test Cases**:
- Valid Thai ID card
- Non-ID card image
- Multiple ID cards in batch
- Invalid image format
- Network timeout simulation

**Verification**: All test cases pass

---

### Step 3.2: Frontend Integration Testing

**Actions**:
1. Start frontend development server
2. Navigate to ID Card Analysis page
3. Upload sample ID cards
4. Select models
5. Process batch
6. Verify results
7. Export CSV

**Test Cases**:
- Single ID card upload
- Multiple ID cards (10+)
- Different model combinations
- Error scenarios
- CSV export validation

**Verification**: All features work end-to-end

---

### Step 3.3: Performance Testing

**Actions**:
1. Test with 50 ID cards
2. Monitor processing time
3. Check memory usage
4. Verify concurrent processing

**Metrics to Track**:
- Average time per photo
- Total batch processing time
- Memory consumption
- API call efficiency

**Verification**: Performance meets requirements (< 1 minute per card)

---

### Step 3.4: Error Handling Verification

**Test Scenarios**:
1. Network disconnection during processing
2. Invalid model selection
3. Corrupted image upload
4. AI model returns invalid JSON
5. Bounding box coordinates out of range
6. Low confidence detections

**Expected Behavior**:
- Graceful error handling
- User-friendly error messages
- Partial results saved
- Option to retry failed items

**Verification**: All error scenarios handled gracefully

---

## Phase 4: Polish & Documentation

### Step 4.1: UI/UX Improvements

**Actions**:
- Add loading animations
- Improve error message visibility
- Add tooltips for model selection
- Responsive design for mobile
- Keyboard shortcuts
- Accessibility improvements (ARIA labels)

**Verification**: UI is polished and accessible

---

### Step 4.2: Create User Guide

**File**: [`MD_file/ID_CARD_USER_GUIDE.md`](../MD_file/ID_CARD_USER_GUIDE.md) (NEW)

**Content**:
1. Feature overview
2. Step-by-step usage instructions
3. Model selection guide
4. Interpreting results
5. Troubleshooting
6. FAQ

**Verification**: User guide is clear and comprehensive

---

### Step 4.3: Update Main README

**File**: [`README.md`](../README.md)

**Action**: Add ID Card Analysis section

```markdown
## Features

### 🪪 ID Card Analysis
Batch process ID card images with a sophisticated 3-step AI pipeline:
1. **Detection**: Verify if images contain valid ID cards
2. **Localization**: Detect and locate specific fields with bounding boxes
3. **OCR**: Extract text from each field
4. **Export**: Generate CSV with all fields and confidence scores

[Learn more about ID Card Analysis →](MD_file/ID_CARD_USER_GUIDE.md)
```

**Verification**: README accurately describes the feature

---

### Step 4.4: Code Documentation

**Actions**:
- Add JSDoc comments to all functions
- Document complex algorithms
- Add inline comments for clarity
- Update API documentation

**Verification**: Code is well-documented

---

### Step 4.5: Final Testing Checklist

**Manual Testing**:
- [ ] Upload and process Thai ID cards
- [ ] Test with 1, 10, and 50 ID cards
- [ ] Try different model combinations
- [ ] Verify all CSV columns export correctly
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify confidence percentages are accurate
- [ ] Check error handling for various scenarios

**Verification**: All manual tests pass

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Documentation complete
- [ ] Environment variables configured
- [ ] Database migrations (if any)
- [ ] Dependencies updated in package.json

### Backend Deployment

- [ ] Build production bundle
- [ ] Set environment variables
- [ ] Test API endpoints in production
- [ ] Monitor logs for errors

### Frontend Deployment

- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally
- [ ] Configure CORS for production API
- [ ] Deploy to hosting service
- [ ] Verify all routes work

### Post-Deployment

- [ ] Smoke test all features
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Gather user feedback

---

## Success Criteria

### Functional Requirements
✅ Upload 1-50 ID card images  
✅ Process with 3-step AI pipeline  
✅ Export results to CSV with all 17 columns  
✅ Support multiple AI model options  
✅ Handle errors gracefully  

### Performance Requirements
✅ Process each ID card in < 1 minute  
✅ Support batch of 50 cards  
✅ Responsive UI (no freezing)  
✅ Efficient memory usage  

### Quality Requirements
✅ > 90% accuracy for Thai ID cards  
✅ Confidence scores accurately reflect quality  
✅ CSV export includes all required fields  
✅ User-friendly error messages  

---

## File Checklist

### Backend Files (NEW)
- [ ] `backend/src/utils/imageUtils.js`
- [ ] `backend/src/services/idCardService.js`
- [ ] `backend/src/controllers/idCardController.js`
- [ ] `backend/src/routes/idCardRoutes.js`

### Backend Files (UPDATE)
- [ ] `backend/src/config.js`
- [ ] `backend/src/services/openRouterService.js`
- [ ] `backend/src/app.js`
- [ ] `backend/package.json` (add sharp dependency)

### Frontend Files (NEW)
- [ ] `frontend/src/components/IDCardAnalysis.jsx`
- [ ] `frontend/src/components/IDCardAnalysis.css`
- [ ] `frontend/src/components/ModelSelectorTriple.jsx`
- [ ] `frontend/src/components/ModelSelectorTriple.css`
- [ ] `frontend/src/components/ProcessingSteps.jsx`
- [ ] `frontend/src/components/ProcessingSteps.css`
- [ ] `frontend/src/components/IDCardResultsTable.jsx`
- [ ] `frontend/src/components/IDCardResultsTable.css`
- [ ] `frontend/src/utils/idCardCsvExport.js`

### Frontend Files (UPDATE)
- [ ] `frontend/src/config.js`
- [ ] `frontend/src/services/api.js`
- [ ] `frontend/src/components/Navigation.jsx`
- [ ] `frontend/src/App.jsx`

### Documentation Files (NEW)
- [ ] `MD_file/ID_CARD_ANALYSIS_ARCHITECTURE.md`
- [ ] `MD_file/ID_CARD_IMPLEMENTATION_ROADMAP.md`
- [ ] `MD_file/ID_CARD_USER_GUIDE.md`

### Documentation Files (UPDATE)
- [ ] `README.md`

---

## Estimated Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Backend Foundation | Steps 1.1-1.7 | 2-3 days |
| Phase 2: Frontend Components | Steps 2.1-2.9 | 2-3 days |
| Phase 3: Integration & Testing | Steps 3.1-3.4 | 1-2 days |
| Phase 4: Polish & Documentation | Steps 4.1-4.5 | 1 day |
| **Total** | | **6-9 days** |

---

## Next Steps

1. ✅ **Review this roadmap** - Ensure all requirements are covered
2. ✅ **Approve the plan** - Get stakeholder approval
3. 🚀 **Switch to Code Mode** - Begin implementation
4. 📋 **Follow the roadmap** - Complete each phase in order
5. ✅ **Test thoroughly** - Verify each step before moving forward
6. 📝 **Document progress** - Update task tracking

Ready to implement! Switch to **Code Mode** to begin building the ID Card Analysis feature following this roadmap.