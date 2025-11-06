# Batch Photo Analysis - User Guide

## Overview

The Batch Photo Analysis feature allows you to upload multiple photos at once and analyze them all with a single AI model using the same prompt. Results can be exported to CSV format with two columns: Picture Name and Response.

## Features

✅ Upload up to 20 photos simultaneously
✅ Support for JPG, PNG, GIF, and WebP formats
✅ Drag & drop or browse to select files
✅ Real-time progress tracking
✅ Parallel processing (5 photos at a time)
✅ Export results to CSV (Picture Name, Response)
✅ Individual photo status indicators
✅ Search and filter results
✅ Expandable result rows for long responses

## How to Use

### Step 1: Navigate to Batch Analysis

Click on the **"📊 Batch Analysis"** tab in the navigation bar at the top of the page.

### Step 2: Select AI Model

In the Configuration section:
1. Choose your preferred AI model from the dropdown
2. Available models include GPT-4, Claude, Gemini, and others

### Step 3: Enter Your Prompt

1. Type your analysis prompt in the text area
2. Example prompts:
   - "Describe this image in detail"
   - "What objects can you see in this photo?"
   - "Analyze the colors and composition of this image"
   - "Extract any text visible in this image"

**Optional**: Click "Advanced: System Prompt" to add custom system instructions for more controlled responses.

### Step 4: Upload Photos

You have two options:

**Option A: Drag & Drop**
- Drag photos from your file explorer directly into the upload zone
- Drop them to add to the queue

**Option B: Browse Files**
- Click anywhere in the upload zone
- Select multiple files from the file browser
- Click "Open" to add them

**Requirements:**
- ✅ Maximum 20 photos per batch
- ✅ Supported formats: JPG, PNG, GIF, WebP
- ✅ Maximum 5MB per photo
- ✅ Total batch size limit: 50MB

### Step 5: Review & Remove Photos

- Preview thumbnails appear below the upload zone
- Each photo shows its filename and size
- Click the **✕** button on any photo to remove it
- Click **"Clear All"** to remove all photos at once

### Step 6: Start Analysis

1. Review your configuration and photos
2. Click the **"🚀 Start Analysis"** button
3. The button will be disabled if:
   - No photos are selected
   - No prompt is entered
   - No model is selected

### Step 7: Monitor Progress

While processing, you'll see:
- **Progress bar** showing completion percentage
- **Statistics**: Total, Completed, Failed counts
- **Processing indicator** with animation
- **Status badges** on each photo:
  - ⏳ Processing (orange)
  - ✓ Success (green)
  - ✗ Failed (red)

Processing happens in parallel (5 photos at a time) for faster results.

### Step 8: Review Results

After processing completes:
- Results table appears showing all photos
- **Columns displayed:**
  - Picture Name
  - Prompt (your analysis prompt)
  - Response (AI's analysis)
  - Status (Success/Failed)
  
**Table Features:**
- Click **▶** to expand rows and see full responses
- Use the search box to filter results
- Expandable rows show complete text

### Step 9: Export to CSV

1. Click the **"📥 Export to CSV"** button
2. CSV file downloads automatically
3. Filename format: `batch-analysis-YYYY-MM-DD.csv`

**CSV Format:**
```csv
Picture Name,Response
photo1.jpg,"This image shows a beautiful sunset over the ocean..."
photo2.jpg,"The photograph depicts a modern building with glass..."
photo3.jpg,"I can see a person walking their dog in a park..."
```

**Note:** The CSV contains only 2 columns:
- Picture Name
- Response (AI analysis)

## Tips & Best Practices

### For Best Results

1. **Use Clear Prompts**
   - Be specific about what you want analyzed
   - Include context if needed
   - Example: "Describe the main subject and background of this photo"

2. **Choose Appropriate Models**
   - GPT-4 Vision: Excellent for detailed descriptions
   - Claude 3: Great for nuanced analysis
   - Gemini: Fast and reliable for general analysis

3. **Optimize Photo Sizes**
   - Compress large photos before uploading
   - Smaller files = faster processing
   - 1-2MB per photo is ideal

4. **Batch Similar Photos**
   - Use the same type of prompt for related photos
   - Group photos by category for organized results

### Common Use Cases

**📸 Photo Documentation**
- Prompt: "Create a detailed caption for this photo"
- Use: Generate captions for photo libraries

**🔍 Product Analysis**
- Prompt: "Describe this product's features and condition"
- Use: Catalog inventory items

**🏠 Real Estate**
- Prompt: "Describe the room type, condition, and notable features"
- Use: Generate property descriptions

**📊 Data Extraction**
- Prompt: "Extract all visible text and numbers from this image"
- Use: Digitize documents or receipts

**🎨 Art Analysis**
- Prompt: "Analyze the artistic style, colors, and composition"
- Use: Catalog artwork or create descriptions

## Troubleshooting

### Upload Issues

**Problem:** Files won't upload
- ✅ Check file format (must be JPG, PNG, GIF, or WebP)
- ✅ Ensure file size is under 5MB
- ✅ Verify you haven't exceeded 20 photos
- ✅ Check total batch size is under 50MB

**Problem:** Drag & drop not working
- ✅ Try clicking the upload zone instead
- ✅ Use the file browser option
- ✅ Refresh the page if needed

### Processing Issues

**Problem:** Some photos failed
- ✅ Check the error message in the results table
- ✅ Verify photo isn't corrupted
- ✅ Try processing failed photos separately
- ✅ Ensure photos are clear and not too dark

**Problem:** Processing takes too long
- ✅ Normal: ~30-60 seconds for 20 photos
- ✅ Check your internet connection
- ✅ Try reducing batch size
- ✅ Some models are slower than others

**Problem:** "No response from AI"
- ✅ Check if API key is configured
- ✅ Verify internet connection
- ✅ Try a different AI model
- ✅ Check if service is experiencing issues

### Export Issues

**Problem:** CSV won't download
- ✅ Check browser download settings
- ✅ Try a different browser
- ✅ Ensure you have write permissions
- ✅ Clear browser cache and try again

**Problem:** CSV formatting issues
- ✅ Open with appropriate program (Excel, Google Sheets)
- ✅ Check encoding (should be UTF-8)
- ✅ Try opening with different software

## Limitations

- **Maximum 20 photos** per batch
- **5MB maximum** per photo file
- **50MB total** batch size limit
- Only **image files** supported (no videos or documents)
- Same **prompt applies** to all photos in batch
- Processing uses **single model** per batch

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Start analysis (when button is focused)
- **Escape**: Cancel (when in upload zone)
- **Ctrl/Cmd + V**: Paste images (if browser supports)

## Privacy & Security

- ✅ Photos are processed in real-time only
- ✅ No server-side storage of images
- ✅ Images cleared after processing
- ✅ CSV exports are local to your device
- ✅ All API requests are encrypted (HTTPS)

## FAQ

**Q: Can I use different prompts for each photo?**
A: Currently, the same prompt is applied to all photos in a batch. For different prompts, process photos separately or create multiple batches.

**Q: Can I use multiple AI models at once?**
A: Currently, one model per batch. For multi-model comparison, use the Chat interface's multi-model feature.

**Q: What happens if my batch partially fails?**
A: Successful photos will still show results. Failed photos will show error messages. You can export partial results or retry failed photos.

**Q: Can I pause or cancel processing?**
A: Not currently. However, processing is fast (usually under 1 minute for 20 photos).

**Q: Is there a limit to how many batches I can process?**
A: No limit on batches, but each batch is limited to 20 photos. API usage may be subject to rate limits.

**Q: Can I save my prompts or configurations?**
A: Not currently, but your last used model selection is saved automatically.

**Q: What AI models work best for photos?**
A: All vision-capable models work well. GPT-4 Vision and Claude 3 Opus provide the most detailed analysis.

## Need Help?

If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Verify your API key is properly configured
3. Try with a smaller batch first
4. Test with different photos or models
5. Refer to the main project README for setup instructions

## Updates & Changes

**Current Version Features:**
- Multi-photo upload with drag & drop
- Real-time progress tracking
- CSV export with Picture Name and Response
- Up to 20 photos per batch
- Parallel processing for faster results

For feature requests or bug reports, please check the project repository.