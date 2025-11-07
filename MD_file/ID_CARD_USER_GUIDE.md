# ID Card Analysis - User Guide

## Introduction

The ID Card Analysis feature allows you to batch process ID card images using a sophisticated 3-step AI pipeline to automatically extract information from identification documents.

---

## Quick Start Guide

### Step 1: Navigate to ID Card Analysis

1. Open the application in your browser
2. Click on the **🪪 ID Card Analysis** tab in the navigation bar

### Step 2: Select AI Models

The system uses three specialized AI models:

1. **Detection Model** - Verifies if images contain ID cards
2. **Localization Model** - Finds field locations with bounding boxes
3. **OCR Model** - Extracts text from each field

**Recommended models** are marked with a ⭐ star. The system will auto-select these for you.

### Step 3: Upload ID Card Images

1. Click the upload area or drag & drop ID card images
2. Supported formats: JPEG, PNG
3. Maximum: 50 images per batch
4. Maximum file size: 10MB per image

### Step 4: Start Processing

1. Click **"🚀 Start Processing"**
2. Watch the 3-step progress indicator
3. Wait for processing to complete

### Step 5: Review Results

1. View results in the comprehensive table
2. Check confidence scores (color-coded)
3. Export to CSV for further analysis

---

## Understanding the 3-Step Pipeline

### Step 1: Detection (ID Card Verification)

**Purpose**: Verify the image contains a valid ID card

- AI analyzes the image
- Determines if it's an ID card
- Provides confidence score (0-100%)
- Identifies card type (Thai ID, Passport, etc.)

**Success Criteria**: 
- Must be detected as ID card
- Confidence must be ≥70%

### Step 2: Localization (Field Detection)

**Purpose**: Find exact locations of text fields on the ID card

- AI locates 9 specific fields
- Provides bounding box coordinates for each
- Fields: Names, Titles, ID number, Date of birth (Thai & English)
- Crops each field region for OCR

**Bounding Box Format**: [ymin, xmin, ymax, xmax] normalized (0.0-1.0)

### Step 3: OCR (Text Extraction)

**Purpose**: Extract text from each field

- AI reads text from cropped regions
- Processes all 9 fields concurrently
- Provides text and confidence score for each
- Handles both Thai and English text

**Output**: Text string + confidence percentage

---

## Exported Data (CSV Format)

The exported CSV contains 17 columns:

| Column | Description |
|--------|-------------|
| `imageName` | Filename of the ID card image |
| `idcardConfidentailPercent` | Confidence that image is an ID card |
| `titleEn` | English title (Mr., Ms., etc.) |
| `titleEnConfidentailPercent` | Confidence for English title |
| `titleTh` | Thai title (นาย, นางสาว, etc.) |
| `titleThConfidentailPercent` | Confidence for Thai title |
| `firstNameEn` | English first name |
| `firstNameEnConfidentailPercent` | Confidence for English first name |
| `firstNameTh` | Thai first name |
| `firstNameThConfidentailPercent` | Confidence for Thai first name |
| `lastNameEn` | English last name |
| `lastNameEnConfidentailPercent` | Confidence for English last name |
| `lastNameTh` | Thai last name |
| `lastNameThConfidentailPercent` | Confidence for Thai last name |
| `identityNumber` | ID card number |
| `identityNumberConfidentailPercent` | Confidence for ID number |
| `dateOfBirth` | Date of birth |
| `dateOfBirthConfidentailPercent` | Confidence for date of birth |

---

## Confidence Score Interpretation

Confidence scores indicate how certain the AI is about the extracted data:

- **🟢 High (80-100%)**: Very reliable, likely accurate
- **🟡 Medium (60-79%)**: Moderately reliable, may need verification
- **🔴 Low (0-59%)**: Less reliable, should be manually verified

### Factors Affecting Confidence

- **Image quality**: Blurry or low-resolution images reduce confidence
- **Lighting**: Poor lighting affects text recognition
- **Orientation**: Tilted or rotated cards may be harder to read
- **Card condition**: Worn, damaged, or dirty cards are more difficult
- **Text clarity**: Faded or small text reduces confidence

---

## Tips for Best Results

### Image Quality

✅ **Good Practices:**
- Use high-resolution images (minimum 720p)
- Ensure good lighting
- Align card parallel to camera
- Fill frame with the card
- Use clear, undamaged cards

❌ **Avoid:**
- Blurry or out-of-focus images
- Dark or overexposed photos
- Extremely angled shots
- Cards with heavy reflections
- Pixelated or compressed images

### Model Selection

**For Thai ID Cards:**
- Detection: `google/gemini-pro-vision`
- Localization: `anthropic/claude-3-opus`
- OCR: `google/gemini-pro-vision`

**For International Documents:**
- Detection: `google/gemini-pro-vision`
- Localization: `anthropic/claude-3.5-sonnet`
- OCR: `openai/gpt-4o`

**For Fast Processing:**
- Detection: `google/gemini-flash-1.5`
- Localization: `google/gemini-pro-vision`
- OCR: `google/gemini-flash-1.5`

### Batch Size

- **Small batches (1-10)**: Faster results, good for testing
- **Medium batches (10-30)**: Balanced speed and efficiency
- **Large batches (30-50)**: More efficient but takes longer

---

## Common Use Cases

### 1. Bulk Customer Onboarding

Process ID cards for new customer registration:
1. Upload all customer ID cards
2. Process in batches of 20-30
3. Export CSV
4. Import into your database
5. Manually verify low-confidence entries

### 2. Document Digitization

Convert physical ID cards to digital records:
1. Scan ID cards with high quality
2. Upload to ID Card Analysis
3. Extract all information
4. Store in digital archive
5. Use CSV for indexing

### 3. Identity Verification

Verify ID card authenticity and extract info:
1. Upload ID card image
2. Check detection confidence (should be >90%)
3. Review extracted information
4. Compare with claimed identity
5. Flag low-confidence fields for review

---

## Troubleshooting

### Problem: Low Confidence Scores

**Solutions:**
- Re-scan with better lighting
- Use higher resolution images
- Ensure card is flat and aligned
- Try different AI models
- Clean the ID card before scanning

### Problem: Fields Not Detected

**Solutions:**
- Check if localization model supports your card type
- Try `anthropic/claude-3-opus` for better spatial understanding
- Ensure entire card is visible in image
- Rotate image if card is sideways

### Problem: Wrong Text Extracted

**Solutions:**
- Use better OCR model
- Improve image quality
- Check if text is legible in original image
- Try processing individual fields separately

### Problem: Processing Takes Too Long

**Solutions:**
- Reduce batch size (process 10-20 at a time)
- Use faster models (Gemini Flash)
- Check internet connection
- Reduce image resolution

### Problem: Export CSV Missing Data

**Solutions:**
- Wait for all processing to complete
- Check browser's download settings
- Look for errors in console (F12)
- Try exporting again

---

## Data Privacy & Security

### Important Notes

⚠️ **ID cards contain sensitive personal information!**

- Images are sent to AI providers for processing
- Results are not stored on the server
- CSV export is local (not uploaded)
- Clear browser cache to remove local data
- Use in compliance with privacy regulations

### Best Practices

1. **Delete images after processing**
2. **Secure the exported CSV files**
3. **Follow data protection laws** (GDPR, PDPA, etc.)
4. **Get consent** before processing ID cards
5. **Use secure connections** (HTTPS)

---

## Limitations

### Current Limitations

- **Language Support**: Primarily Thai and English
- **Card Types**: Optimized for Thai ID cards, passports, driver's licenses
- **Batch Size**: Maximum 50 images per batch
- **File Size**: Maximum 10MB per image
- **Processing Time**: ~30-60 seconds per card (varies by model)

### Accuracy Notes

- OCR accuracy depends on image quality
- Some decorative fonts may not be read correctly
- Handwritten text is not supported
- Partially visible cards may fail detection
- Confidence scores are estimates, not guarantees

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + V` | Paste image from clipboard (in upload area) |
| `Delete` | Remove selected photo |
| `Ctrl/Cmd + A` | Select all photos |
| `Esc` | Close error messages |

---

## Frequently Asked Questions

### Q: How long does processing take?

**A:** Typically 30-60 seconds per ID card, depending on the AI models selected. Faster models (like Gemini Flash) take 15-30 seconds, while more accurate models (like Claude Opus) may take 45-90 seconds.

### Q: What happens if detection fails?

**A:** If an image doesn't contain a valid ID card or the confidence is below 70%, it's marked as failed and skipped. You'll see the error in the results table.

### Q: Can I process passports and driver's licenses?

**A:** Yes! The system supports multiple document types including passports and driver's licenses. However, it's optimized for Thai ID cards.

### Q: How accurate is the text extraction?

**A:** Accuracy is typically 85-95% for clear, high-quality images. Confidence scores help you identify which results may need verification.

### Q: Can I cancel processing?

**A:** Currently, once processing starts, it runs to completion. This feature may be added in future updates.

### Q: Why are some fields empty?

**A:** Fields may be empty if:
- The field wasn't found on the card
- Text couldn't be read clearly
- The field doesn't apply to that card type
- OCR confidence was too low

### Q: How much does it cost?

**A:** Cost depends on the AI models used. Typically $0.015-0.025 per ID card with recommended models. See pricing details in your OpenRouter account.

### Q: Is my data stored?

**A:** No. Images and results are processed in memory and not stored on the server. CSV export is generated locally in your browser.

---

## Getting Help

If you encounter issues:

1. **Check this guide** for solutions
2. **Review setup instructions**: [`ID_CARD_SETUP_INSTRUCTIONS.md`](ID_CARD_SETUP_INSTRUCTIONS.md)
3. **Read architecture docs**: [`ID_CARD_ANALYSIS_ARCHITECTURE.md`](ID_CARD_ANALYSIS_ARCHITECTURE.md)
4. **Check browser console** (F12) for error messages
5. **Verify API key** is valid and has credits

---

## Version History

- **v1.0.0** - Initial release
  - 3-step AI pipeline (Detection → Localization → OCR)
  - Support for Thai ID cards
  - Batch processing up to 50 images
  - CSV export with 17 columns
  - User-selectable AI models

---

## Feedback & Suggestions

We welcome feedback! If you have suggestions for improving the ID Card Analysis feature, please let us know.

---

Happy processing! 🪪✨