# ID Card Analysis - Quick Reference

## 📋 What We're Building

A 3-step AI pipeline for batch processing ID card images:

1. **Step 1: Detection** - Verify if image contains a valid ID card (confidence ≥70%)
2. **Step 2: Localization** - Extract bounding box coordinates for 9 fields
3. **Step 3: OCR** - Read text from each cropped field region

## 🎯 Key Features

✅ Separate "ID Card Analysis" tab in navigation  
✅ User-selectable AI models for each of the 3 steps  
✅ Batch processing up to 50 ID cards  
✅ CSV export with 17 columns (9 fields × 2 for text + confidence)  
✅ Support for Thai ID cards and other formats  
✅ Real-time progress tracking  

## 📊 CSV Output Format

```csv
imageName,idcardConfidentailPercent,titleEn,titleEnConfidentailPercent,titleTh,titleThConfidentailPercent,firstNameEn,firstNameEnConfidentailPercent,firstNameTh,firstNameThConfidentailPercent,lastNameEn,lastNameEnConfidentailPercent,lastNameTh,lastNameThConfidentailPercent,identityNumber,identityNumberConfidentailPercent,dateOfBirth,dateOfBirthConfidentailPercent
```

## 🏗️ Architecture Overview

### Backend Components (NEW)
- [`backend/src/services/idCardService.js`](../backend/src/services/idCardService.js) - 3-step pipeline orchestrator
- [`backend/src/controllers/idCardController.js`](../backend/src/controllers/idCardController.js) - API endpoint handler
- [`backend/src/routes/idCardRoutes.js`](../backend/src/routes/idCardRoutes.js) - Route definitions
- [`backend/src/utils/imageUtils.js`](../backend/src/utils/imageUtils.js) - Image cropping utilities

### Frontend Components (NEW)
- [`frontend/src/components/IDCardAnalysis.jsx`](../frontend/src/components/IDCardAnalysis.jsx) - Main container
- [`frontend/src/components/ModelSelectorTriple.jsx`](../frontend/src/components/ModelSelectorTriple.jsx) - 3 model selectors
- [`frontend/src/components/ProcessingSteps.jsx`](../frontend/src/components/ProcessingSteps.jsx) - Step progress indicator
- [`frontend/src/components/IDCardResultsTable.jsx`](../frontend/src/components/IDCardResultsTable.jsx) - Results display
- [`frontend/src/utils/idCardCsvExport.js`](../frontend/src/utils/idCardCsvExport.js) - CSV export logic

## 🔄 Processing Flow

```
Upload Images → Select 3 Models → Start Processing

For each image:
  ├─ Step 1: AI detects if it's an ID card
  │   └─ If YES (confidence ≥70%) → Continue
  │   └─ If NO → Mark as invalid, skip to next
  │
  ├─ Step 2: AI locates 9 fields with bounding boxes
  │   └─ Crop each field region from original image
  │
  └─ Step 3: AI reads text from each cropped region
      └─ Compile results with confidence scores

Export All Results → CSV File
```

## 🤖 AI Prompts (Structured JSON)

### Step 1: Detection
```json
{
  "isIDCard": true/false,
  "confidence": 0-100,
  "cardType": "thai_id|passport|driver_license|other|none",
  "reasoning": "explanation"
}
```

### Step 2: Localization
```json
{
  "fields": {
    "identityNumber": {"bbox": [ymin, xmin, ymax, xmax], "confidence": 92},
    "titleEn": {"bbox": [0.25, 0.15, 0.30, 0.35], "confidence": 88},
    ...
  }
}
```

### Step 3: OCR (per field)
```json
{
  "text": "extracted text",
  "confidence": 0-100
}
```

## 📦 Dependencies to Add

**Backend:**
```json
"sharp": "^0.33.0"
```

**Frontend:**
- Already has `papaparse` for CSV export
- Reuses existing components where possible

## 🎨 UI Layout

```
┌─────────────────────────────────────────┐
│  Navigation: Chat | Batch | ID Card     │
├─────────────────────────────────────────┤
│  🪪 ID Card Analysis                    │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Model Selection                   │ │
│  │ Detection:    [Gemini Pro ▼]      │ │
│  │ Localization: [Claude Opus ▼]     │ │
│  │ OCR:          [Gemini Pro ▼]      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Drag & Drop ID Card Images        │ │
│  │ Or click to browse (max 50)       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Process Steps:                         │
│  ① Detection → ② Localization → ③ OCR  │
│                                         │
│  Progress: 15/20 completed              │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 75%                │
│                                         │
│  [🚀 Start Processing] [📥 Export CSV] │
│                                         │
│  Results Table (17 columns):            │
│  ┌──────────────────────────────────┐  │
│  │ Name │ Conf% │ TitleEn │ Conf%...│  │
│  ├──────────────────────────────────┤  │
│  │ id1.jpg │ 95% │ Mr. │ 88% │...  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## ⏱️ Implementation Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1: Backend | 2-3 days | Services, API endpoints, image utils |
| Phase 2: Frontend | 2-3 days | Components, UI, state management |
| Phase 3: Integration | 1-2 days | Testing, debugging, optimization |
| Phase 4: Polish | 1 day | UI/UX, documentation |
| **Total** | **6-9 days** | Full feature complete |

## 📚 Documentation

- **Architecture**: [`ID_CARD_ANALYSIS_ARCHITECTURE.md`](ID_CARD_ANALYSIS_ARCHITECTURE.md)
- **Roadmap**: [`ID_CARD_IMPLEMENTATION_ROADMAP.md`](ID_CARD_IMPLEMENTATION_ROADMAP.md)
- **User Guide**: `ID_CARD_USER_GUIDE.md` (to be created)

## 🚀 Getting Started

1. Review architecture document for technical details
2. Follow roadmap document for step-by-step implementation
3. Start with Phase 1 (Backend) before moving to frontend
4. Test each phase before proceeding to next

## ✅ Success Criteria

- [ ] Process 50 ID cards in batch
- [ ] 3-step pipeline works correctly
- [ ] CSV exports with all 17 columns
- [ ] Confidence scores accurate
- [ ] < 1 minute per card processing time
- [ ] User-friendly error handling
- [ ] Mobile responsive UI

## 🔧 Recommended AI Models

**Detection**: `google/gemini-pro-vision` (fast classification)  
**Localization**: `anthropic/claude-3-opus` (best spatial reasoning)  
**OCR**: `google/gemini-pro-vision` (strong text extraction)  

## 💡 Key Design Decisions

1. **Separate Feature**: New tab instead of integrating with existing batch analysis
2. **User Choice**: Allow model selection for each step for flexibility
3. **Structured Prompts**: Use JSON responses for reliable parsing
4. **Modular Design**: Reuse existing components where possible
5. **Fail Gracefully**: Individual photo failures don't stop batch

---

**Next Action**: Switch to Code Mode to begin implementation following the roadmap!