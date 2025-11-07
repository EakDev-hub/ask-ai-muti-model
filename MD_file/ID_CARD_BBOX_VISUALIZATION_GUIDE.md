# ID Card Bounding Box Visualization - User Guide

## Overview

The Bounding Box Visualization feature allows you to visually verify how the AI detected and localized fields on your ID card images. After processing ID cards, you can click a "View" button to see colored rectangles (bounding boxes) drawn around each detected field like names, ID numbers, and dates of birth.

---

## How to Use

### Step 1: Process ID Cards

1. Go to the **ID Card Analysis** page
2. Select your three AI models (Detection, Localization, OCR)
3. Upload one or more ID card images
4. Click **"Start Processing"**
5. Wait for processing to complete

### Step 2: View Results

After processing completes, you'll see a results table with all extracted data.

### Step 3: Open Bounding Box Visualization

1. In the results table, locate the **"Actions"** column (first column)
2. Click the **"🔍 View"** button for any processed ID card
3. A modal window will open showing the annotated image

---

## Understanding the Visualization

### Annotated Image Display

The modal shows your original ID card image with colored rectangles drawn around each detected field:

**Color Coding:**
- 🔴 **Red** - Identity Number
- 🔵 **Teal** - Name fields (English/Thai)
- 🟢 **Light Teal** - Title fields (Mr., Mrs., etc.)
- 🟡 **Yellow** - Date of Birth

Each bounding box includes a label showing:
- **Field name** (e.g., "First Name (EN)")
- **Confidence percentage** (e.g., "92%")

### Field Legend Panel

On the right side of the modal, you'll see a legend showing all detected fields organized by category:

- **Identity** - ID Number
- **Names (English)** - Title, First Name, Last Name
- **Names (Thai)** - ชื่อ, นามสกุล
- **Date of Birth** - Both English and Thai formats

**Interactive Features:**
- **Hover** over any field in the legend to highlight it on the image
- The highlighted field will show a thicker border and yellow background overlay
- You can see the extracted text value next to each field

---

## Modal Controls

### Navigation
- **Close Button (✕)**: Click the red X button in the top-right corner
- **Close Button**: Click the gray "Close" button at the bottom
- **Keyboard Shortcut**: Press **ESC** to close the modal
- **Click Outside**: Click anywhere outside the modal to close it

### Viewing Tips
- The canvas area is scrollable if the image is large
- You can hover over different fields to compare their locations
- Check confidence percentages to identify uncertain detections

---

## What the Bounding Boxes Tell You

### Verification Checklist

✅ **Good Detection:**
- Bounding box tightly surrounds the field
- Confidence > 80%
- Extracted text matches the image
- Box doesn't overlap multiple fields

⚠️ **Potential Issues:**
- Box is too large or includes extra content
- Confidence < 60%
- Extracted text is incorrect
- Box is missing or null

### Common Scenarios

**Scenario 1: Perfect Detection**
```
Box: Green border around "John" 
Confidence: 95%
Text: "John"
→ AI correctly identified and extracted the name
```

**Scenario 2: Low Confidence**
```
Box: Yellow border around faded text
Confidence: 45%
Text: ""
→ Text was too blurry, consider re-processing with better image
```

**Scenario 3: Missing Field**
```
Field not shown in legend
→ AI couldn't locate this field, manual entry may be needed
```

---

## Troubleshooting

### "No bounding box data available"

**Cause:** The localization step (Step 2) failed or didn't detect any fields

**Solutions:**
1. Check if the image contains a valid ID card
2. Try using a different localization model
3. Ensure the image is clear and not rotated
4. Re-upload with better lighting/quality

### Bounding boxes seem incorrect

**Cause:** The AI model may have misidentified field locations

**Solutions:**
1. Try a more advanced localization model (e.g., Claude Opus, GPT-4 Vision)
2. Ensure the ID card is flat and properly oriented
3. Use a higher resolution image (at least 720p)

### Modal won't close

**Solutions:**
1. Press ESC key
2. Click the red X button
3. Refresh the page if completely stuck

### Canvas shows blank/white image

**Cause:** Image data may be corrupted or too large

**Solutions:**
1. Check browser console for errors
2. Try with a smaller image
3. Ensure image is in JPG/PNG format

---

## Technical Details

### Coordinate System

Bounding boxes use normalized coordinates (0.0 to 1.0):
- `[ymin, xmin, ymax, xmax]`
- `ymin/ymax`: Vertical position (0 = top, 1 = bottom)
- `xmin/xmax`: Horizontal position (0 = left, 1 = right)

### Rendering

- Uses HTML5 Canvas for high-quality rendering
- Maintains original image resolution
- Responsive design adapts to screen size
- Supports images up to 4K resolution

---

## Best Practices

### For Accurate Detections

1. **Image Quality**
   - Use well-lit, clear images
   - Minimum 720p resolution
   - Avoid shadows and glare
   - Keep ID card flat (no bending/warping)

2. **Model Selection**
   - Use advanced models for localization (Claude Opus, GPT-4 Vision)
   - Higher-tier models provide better bounding box accuracy

3. **Verification Workflow**
   - Always check bounding boxes for critical fields
   - Compare extracted text with visual annotations
   - Flag low-confidence results for manual review

### When to Use Visualization

✅ **Good Use Cases:**
- Debugging why certain fields weren't extracted
- Training team members on expected results
- Quality assurance for batch processing
- Comparing different model performances

❌ **Not Needed:**
- All fields have >90% confidence
- Simple verification tasks
- Batch processing hundreds of cards (too time-consuming)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ESC | Close modal |

*More shortcuts may be added in future versions*

---

## Privacy & Security

- ⚠️ **Original images are included in results** - Ensure secure handling
- Images are only stored in browser memory during the session
- No images are persisted to disk (unless you export)
- Clear browser data to remove all traces

---

## Future Enhancements

Planned features for future releases:

- 📥 Export annotated images as PNG
- 🎨 Adjustable confidence threshold filtering
- 🔄 Compare annotations from different models side-by-side
- ✏️ Manual bounding box editing
- 📊 Batch gallery view of all annotations
- 🎯 Click on box to jump to that field in the table

---

## Support

If you encounter issues with the bounding box visualization:

1. Check this guide for troubleshooting steps
2. Verify your models are properly configured
3. Review the browser console for error messages
4. Try with a different ID card image to isolate issues

---

## Summary

The Bounding Box Visualization feature helps you:
- ✅ Verify AI field detection accuracy
- ✅ Identify localization errors
- ✅ Understand confidence scores visually
- ✅ Debug failed or low-confidence extractions
- ✅ Ensure quality in ID card processing workflows

**Quick Start:** Process ID cards → Click "🔍 View" → Hover over fields to inspect → Press ESC to close