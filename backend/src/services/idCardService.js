const openRouterService = require('./openRouterService');
const imageUtils = require('../utils/imageUtils');
const config = require('../config');

class IDCardService {
  /**
   * Process multiple ID card images through 3-step pipeline
   * @param {Array} photos - Array of {name, data} objects
   * @param {Object} models - {detection, localization, ocr} model IDs
   * @returns {Promise<Object>} Processing results and summary
   */
  async processIDCards(photos, models) {
    const results = [];
    const startTime = Date.now();
    
    for (const photo of photos) {
      const photoStartTime = Date.now();
      
      try {
        // Step 1: Detection
        console.log(`[${photo.name}] Step 1: Detecting ID card...`);
        const detection = await this.detectIDCard(photo.data, models.detection);
        
        if (!detection.isIDCard || detection.confidence < config.idCard.minDetectionConfidence) {
          results.push({
            imageName: photo.name,
            success: false,
            error: `Not a valid ID card (confidence: ${detection.confidence}%)`,
            processingTime: Date.now() - photoStartTime
          });
          continue;
        }
        
        // Step 2: Localization
        console.log(`[${photo.name}] Step 2: Localizing fields...`);
        const localization = await this.localizeFields(
          photo.data,
          models.localization,
          detection.cardType
        );
        
        // Step 3: Crop fields
        console.log(`[${photo.name}] Step 2.5: Cropping field regions...`);
        const croppedImages = await this.cropFieldsFromImage(
          photo.data,
          localization.fields
        );
        
        // Step 4: OCR
        console.log(`[${photo.name}] Step 3: Extracting text...`);
        const ocrResults = await this.extractTextFromFields(
          croppedImages,
          models.ocr
        );
        
        // Compile final result
        const finalResult = this.formatResult(
          photo.name,
          detection,
          localization,
          ocrResults
        );
        
        results.push({
          ...finalResult,
          success: true,
          processingTime: Date.now() - photoStartTime
        });
        
        console.log(`[${photo.name}] ✓ Completed successfully`);
        
      } catch (error) {
        console.error(`[${photo.name}] ✗ Error:`, error.message);
        results.push({
          imageName: photo.name,
          success: false,
          error: error.message,
          processingTime: Date.now() - photoStartTime
        });
      }
    }
    
    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      results: results,
      summary: {
        total: photos.length,
        successful: successful,
        failed: failed,
        processingTime: Date.now() - startTime
      }
    };
  }

  /**
   * Step 1: Detect if image contains an ID card
   * @param {string} imageData - Base64 image data
   * @param {string} model - AI model ID
   * @returns {Promise<Object>} Detection result
   */
  async detectIDCard(imageData, model) {
    const prompt = `Analyze this image and determine if it contains an ID card or identification document.

Respond in JSON format:
{
  "isIDCard": boolean,
  "confidence": number (0-100),
  "cardType": "thai_id" | "passport" | "driver_license" | "other" | "none",
  "reasoning": "brief explanation"
}

Be strict in your assessment. Only return isIDCard=true if you clearly see an official identification document.`;

    try {
      const result = await openRouterService.sendChatRequest(
        prompt,
        imageData,
        model,
        'You are an expert at identifying official ID cards and documents. Respond only with valid JSON.'
      );
      
      // Parse JSON response
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }
      
      const detection = JSON.parse(jsonMatch[0]);
      
      // Validate response structure
      if (typeof detection.isIDCard !== 'boolean' || 
          typeof detection.confidence !== 'number') {
        throw new Error('Invalid detection response format');
      }
      
      return detection;
      
    } catch (error) {
      throw new Error(`Detection failed: ${error.message}`);
    }
  }

  /**
   * Step 2: Locate fields on the ID card
   * @param {string} imageData - Base64 image data
   * @param {string} model - AI model ID
   * @param {string} cardType - Type of card detected
   * @returns {Promise<Object>} Localization result with bounding boxes
   */
  async localizeFields(imageData, model, cardType) {
    const prompt = `Analyze this ${cardType || 'ID card'} image and locate the following fields. For each field found, provide bounding box coordinates in the format [ymin, xmin, ymax, xmax] where values are normalized between 0.0 and 1.0.

            Fields to locate:
            1. Identification Number
            2. Thai Title (if applicable)
            3. Thai First Name (if applicable)
            4. Thai Last Name (if applicable)
            5. English Title
            6. English First Name
            7. English Last Name
            8. Date of Birth (English format)
            9. Date of Birth (Thai format, if applicable)

            Respond in JSON format:
            {
            "fields": {
                "identityNumber": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "titleTh": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "firstNameTh": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "lastNameTh": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "titleEn": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "firstNameEn": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "lastNameEn": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "dateOfBirthEn": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number},
                "dateOfBirthTh": {"bbox": [ymin, xmin, ymax, xmax], "confidence": number}
            }
            }

            IMPORTANT: 
            - All bbox coordinates MUST be between 0.0 and 1.0
            - If a field is not found, set bbox to null and confidence to 0
            - Ensure ymin < ymax and xmin < xmax`;

    try {
      const result = await openRouterService.sendChatRequest(
        prompt,
        imageData,
        model,
        'You are an expert at spatial analysis of ID cards. Provide precise bounding box coordinates. Respond only with valid JSON.'
      );
      
      // Parse JSON response
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }
      
      const localization = JSON.parse(jsonMatch[0]);
      
      // Validate and clean bounding boxes
      if (!localization.fields) {
        throw new Error('Invalid localization response format');
      }
      
      // Validate each field's bounding box
      for (const [fieldName, fieldData] of Object.entries(localization.fields)) {
        if (fieldData.bbox && !imageUtils.validateBoundingBox(fieldData.bbox)) {
          console.warn(`Invalid bbox for ${fieldName}, setting to null`);
          localization.fields[fieldName].bbox = null;
          localization.fields[fieldName].confidence = 0;
        }
      }
      
      return localization;
      
    } catch (error) {
      throw new Error(`Localization failed: ${error.message}`);
    }
  }

  /**
   * Crop field regions from the original image
   * @param {string} imageData - Base64 image data
   * @param {Object} fields - Field data with bounding boxes
   * @returns {Promise<Object>} Object mapping field names to cropped images
   */
  async cropFieldsFromImage(imageData, fields) {
    const croppedImages = {};
    
    for (const [fieldName, fieldData] of Object.entries(fields)) {
      if (!fieldData.bbox || !imageUtils.validateBoundingBox(fieldData.bbox)) {
        croppedImages[fieldName] = null;
        continue;
      }
      
      try {
        const croppedImage = await imageUtils.cropRegion(imageData, fieldData.bbox);
        croppedImages[fieldName] = croppedImage;
      } catch (error) {
        console.error(`Failed to crop ${fieldName}:`, error.message);
        croppedImages[fieldName] = null;
      }
    }
    
    return croppedImages;
  }

  /**
   * Step 3: Extract text from cropped field regions
   * @param {Object} croppedImages - Object mapping field names to cropped images
   * @param {string} model - AI model ID
   * @returns {Promise<Object>} OCR results for each field
   */
  async extractTextFromFields(croppedImages, model) {
    const ocrResults = {};
    
    // Process fields concurrently (with limit)
    const fieldEntries = Object.entries(croppedImages);
    const concurrencyLimit = 10;
    
    for (let i = 0; i < fieldEntries.length; i += concurrencyLimit) {
      const batch = fieldEntries.slice(i, i + concurrencyLimit);
      
      const batchPromises = batch.map(async ([fieldName, croppedImage]) => {
        if (!croppedImage) {
          return [fieldName, { text: '', confidence: 0 }];
        }
        
        try {
          const result = await this.extractTextFromField(croppedImage, fieldName, model);
          return [fieldName, result];
        } catch (error) {
          console.error(`OCR failed for ${fieldName}:`, error.message);
          return [fieldName, { text: '', confidence: 0 }];
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(([fieldName, result]) => {
        ocrResults[fieldName] = result;
      });
    }
    
    return ocrResults;
  }

  /**
   * Extract text from a single field
   * @param {string} croppedImage - Base64 cropped image
   * @param {string} fieldName - Name of the field
   * @param {string} model - AI model ID
   * @returns {Promise<Object>} {text, confidence}
   */
  async extractTextFromField(croppedImage, fieldName, model) {
    const prompt = `Extract the text from this image which shows a ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} from an ID card.

Respond in JSON format:
{
  "text": "extracted text",
  "confidence": number (0-100)
}

Rules:
- Return only the visible text, nothing else
- Preserve spacing and formatting
- If text is unclear or not visible, set confidence below 50
- Remove any watermarks or background noise
- For dates, preserve the format shown`;

    try {
      const result = await openRouterService.sendChatRequest(
        prompt,
        croppedImage,
        model,
        'You are an expert OCR system. Extract text accurately. Respond only with valid JSON.'
      );
      
      // Parse JSON response
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }
      
      const ocrResult = JSON.parse(jsonMatch[0]);
      
      // Validate response
      if (typeof ocrResult.text !== 'string' || typeof ocrResult.confidence !== 'number') {
        throw new Error('Invalid OCR response format');
      }
      
      return ocrResult;
      
    } catch (error) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  /**
   * Format final result with all required fields
   * @param {string} imageName - Name of the image file
   * @param {Object} detection - Detection result
   * @param {Object} localization - Localization result
   * @param {Object} ocrResults - OCR results
   * @returns {Object} Formatted result
   */
  formatResult(imageName, detection, localization, ocrResults) {
    return {
      imageName: imageName,
      idcardConfidentailPercent: detection.confidence,
      
      titleEn: ocrResults.titleEn?.text || '',
      titleEnConfidentailPercent: ocrResults.titleEn?.confidence || 0,
      
      titleTh: ocrResults.titleTh?.text || '',
      titleThConfidentailPercent: ocrResults.titleTh?.confidence || 0,
      
      firstNameEn: ocrResults.firstNameEn?.text || '',
      firstNameEnConfidentailPercent: ocrResults.firstNameEn?.confidence || 0,
      
      firstNameTh: ocrResults.firstNameTh?.text || '',
      firstNameThConfidentailPercent: ocrResults.firstNameTh?.confidence || 0,
      
      lastNameEn: ocrResults.lastNameEn?.text || '',
      lastNameEnConfidentailPercent: ocrResults.lastNameEn?.confidence || 0,
      
      lastNameTh: ocrResults.lastNameTh?.text || '',
      lastNameThConfidentailPercent: ocrResults.lastNameTh?.confidence || 0,
      
      identityNumber: ocrResults.identityNumber?.text || '',
      identityNumberConfidentailPercent: ocrResults.identityNumber?.confidence || 0,
      
      // Prefer English date format, fall back to Thai if needed
      dateOfBirth: ocrResults.dateOfBirthEn?.text || ocrResults.dateOfBirthTh?.text || '',
      dateOfBirthConfidentailPercent: Math.max(
        ocrResults.dateOfBirthEn?.confidence || 0,
        ocrResults.dateOfBirthTh?.confidence || 0
      )
    };
  }
}

module.exports = new IDCardService();