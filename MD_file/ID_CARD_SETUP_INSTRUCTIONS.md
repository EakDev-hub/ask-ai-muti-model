# ID Card Analysis - Setup Instructions

## Quick Start

Follow these steps to get the ID Card Analysis feature running.

---

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key
- Existing project is already set up

---

## Installation Steps

### 1. Install Backend Dependencies

Navigate to the backend directory and install the new Sharp dependency:

```bash
cd backend
npm install
```

This will install the `sharp@^0.33.0` package that was added to `package.json`.

### 2. Verify Backend Configuration

The backend configuration has been updated in [`backend/src/config.js`](../backend/src/config.js). No changes needed - the ID card configuration is already added.

### 3. Install Frontend Dependencies

The frontend already has all necessary dependencies (papaparse for CSV export). No new installations needed:

```bash
cd frontend
npm install
```

---

## Starting the Application

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:3001`

### 2. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

---

## Verify Installation

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Check Navigation** - You should see three tabs:
   - 💬 Chat
   - 📊 Batch Analysis
   - 🪪 ID Card Analysis ← NEW!

3. **Click on "ID Card Analysis"** tab

4. **You should see:**
   - Model selector with 3 dropdowns (Detection, Localization, OCR)
   - File uploader for ID card images
   - Info section explaining how it works

---

## Testing the Feature

### Test with Sample ID Cards

1. Navigate to the ID Card Analysis page
2. The system will auto-select recommended models
3. Upload 1-3 ID card images (JPEG, PNG)
4. Click "Start Processing"
5. Watch the processing steps indicator
6. View results in the table
7. Export to CSV

### Expected Processing Flow

```
Upload Images → Select Models (auto-selected) → Click Start
  ↓
Step 1: Detection (verifying ID cards)
  ↓
Step 2: Localization (finding field locations)
  ↓
Step 3: OCR (extracting text)
  ↓
Results Table → Export CSV
```

---

## File Structure

### New Backend Files

```
backend/
├── src/
│   ├── config.js (UPDATED)
│   ├── app.js (UPDATED)
│   ├── package.json (UPDATED - added sharp)
│   ├── controllers/
│   │   └── idCardController.js (NEW)
│   ├── services/
│   │   └── idCardService.js (NEW)
│   ├── routes/
│   │   └── idCardRoutes.js (NEW)
│   └── utils/
│       └── imageUtils.js (NEW)
```

### New Frontend Files

```
frontend/
├── src/
│   ├── config.js (UPDATED)
│   ├── App.jsx (UPDATED)
│   ├── components/
│   │   ├── Navigation.jsx (UPDATED)
│   │   ├── IDCardAnalysis.jsx (NEW)
│   │   ├── IDCardAnalysis.css (NEW)
│   │   ├── ModelSelectorTriple.jsx (NEW)
│   │   ├── ModelSelectorTriple.css (NEW)
│   │   ├── ProcessingSteps.jsx (NEW)
│   │   ├── ProcessingSteps.css (NEW)
│   │   ├── IDCardResultsTable.jsx (NEW)
│   │   └── IDCardResultsTable.css (NEW)
│   ├── services/
│   │   └── api.js (UPDATED)
│   └── utils/
│       └── idCardCsvExport.js (NEW)
```

---

## API Endpoints

The following new endpoints are available:

### 1. Process ID Cards

```
POST /api/idcard/process

Request Body:
{
  "photos": [
    { "name": "id1.jpg", "data": "base64..." }
  ],
  "models": {
    "detection": "google/gemini-pro-vision",
    "localization": "anthropic/claude-3-opus",
    "ocr": "google/gemini-pro-vision"
  }
}

Response:
{
  "results": [...],
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "processingTime": 15000
  }
}
```

### 2. Get Recommended Models

```
GET /api/idcard/recommended-models

Response:
{
  "detection": ["google/gemini-pro-vision", ...],
  "localization": ["anthropic/claude-3-opus", ...],
  "ocr": ["google/gemini-pro-vision", ...]
}
```

---

## Troubleshooting

### Backend Issues

**Error: Sharp installation failed**
```bash
cd backend
npm install sharp --force
```

**Error: Routes not found**
- Verify `backend/src/app.js` includes `app.use('/api/idcard', idCardRoutes)`
- Restart the backend server

**Error: OpenRouter API key missing**
- Ensure `.env` file has `OPENROUTER_API_KEY=your-key-here`

### Frontend Issues

**Error: Module not found 'IDCardAnalysis'**
- Verify all files were created in `frontend/src/components/`
- Check import paths in `App.jsx`

**Error: Navigation tab not showing**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**CSV export not working**
- Verify papaparse is installed: `npm list papaparse`
- Check browser console for errors

### Processing Issues

**Low confidence scores**
- Try different AI models (some are better at OCR)
- Ensure ID card images are clear and high-quality
- Check image orientation

**Fields not detected**
- Localization model may need higher quality images
- Try `anthropic/claude-3-opus` for better spatial understanding

---

## Performance Optimization

### Recommended Settings

- **Max photos per batch**: 10-20 for optimal speed
- **Image size**: 1920px max width (auto-resized)
- **Concurrent processing**: 5 photos at a time (configured)

### Model Recommendations

**For Speed:**
- Detection: `google/gemini-flash-1.5`
- Localization: `google/gemini-pro-vision`
- OCR: `google/gemini-flash-1.5`

**For Accuracy:**
- Detection: `google/gemini-pro-vision`
- Localization: `anthropic/claude-3-opus`
- OCR: `google/gemini-pro-vision`

**For Balance:**
- Detection: `google/gemini-pro-vision`
- Localization: `anthropic/claude-3.5-sonnet`
- OCR: `google/gemini-pro-vision`

---

## Cost Estimation

Based on OpenRouter pricing (approximate):

- **Detection**: ~$0.001 per image
- **Localization**: ~$0.005 per image
- **OCR** (9 fields): ~$0.009 per image

**Total**: ~$0.015 per ID card (with recommended models)

For 50 ID cards: ~$0.75

*Costs vary by model selection. High-end models like Claude-3-Opus cost more.*

---

## Next Steps

1. **Test with real ID cards** - Upload actual ID card images
2. **Experiment with models** - Try different model combinations
3. **Review results** - Check confidence scores
4. **Export CSV** - Verify all 17 columns are exported
5. **Read user guide** - See [`ID_CARD_USER_GUIDE.md`](ID_CARD_USER_GUIDE.md)

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review architecture docs: [`ID_CARD_ANALYSIS_ARCHITECTURE.md`](ID_CARD_ANALYSIS_ARCHITECTURE.md)
3. Review implementation roadmap: [`ID_CARD_IMPLEMENTATION_ROADMAP.md`](ID_CARD_IMPLEMENTATION_ROADMAP.md)

---

## License

Same as main project.