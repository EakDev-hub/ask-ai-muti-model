const sharp = require('sharp');

class ImageUtils {
  /**
   * Crop image region based on normalized bounding box
   * @param {string} base64Image - Base64 encoded image (with or without data URI prefix)
   * @param {number[]} bbox - [ymin, xmin, ymax, xmax] normalized (0-1)
   * @returns {Promise<string>} Cropped base64 image with data URI prefix
   */
  async cropRegion(base64Image, bbox) {
    try {
      // Validate bounding box
      if (!this.validateBoundingBox(bbox)) {
        throw new Error('Invalid bounding box coordinates');
      }

      // Remove data URI prefix if present
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      const { width, height } = metadata;

      // Convert normalized coordinates to pixels
      const [ymin, xmin, ymax, xmax] = bbox;
      const left = Math.round(xmin * width) - 10;
      const top = Math.round(ymin * height) + 10;
      const cropWidth = Math.round((xmax - xmin) * width) + 10;
      const cropHeight = Math.round((ymax - ymin) * height) - 10;

      // Ensure dimensions are valid
      if (cropWidth <= 0 || cropHeight <= 0) {
        throw new Error('Invalid crop dimensions');
      }

      // Crop the image
      const croppedBuffer = await sharp(imageBuffer)
        .extract({
          left: Math.max(0, left),
          top: Math.max(0, top),
          width: Math.min(cropWidth, width - left),
          height: Math.min(cropHeight, height - top)
        })
        .toBuffer();

      // Convert back to base64 with data URI
      const croppedBase64 = croppedBuffer.toString('base64');
      return `data:image/jpeg;base64,${croppedBase64}`;
    } catch (error) {
      throw new Error(`Failed to crop image region: ${error.message}`);
    }
  }

  /**
   * Validate bounding box coordinates
   * @param {number[]} bbox - [ymin, xmin, ymax, xmax]
   * @returns {boolean}
   */
  validateBoundingBox(bbox) {
    if (!Array.isArray(bbox) || bbox.length !== 4) {
      return false;
    }

    const [ymin, xmin, ymax, xmax] = bbox;

    // Check if all values are numbers
    if (!bbox.every(v => typeof v === 'number' && !isNaN(v))) {
      return false;
    }

    // Check if normalized (between 0 and 1)
    if (!bbox.every(v => v >= 0 && v <= 1)) {
      return false;
    }

    // Check if min < max
    if (ymin >= ymax || xmin >= xmax) {
      return false;
    }

    return true;
  }

  /**
   * Resize image if too large
   * @param {string} base64Image - Base64 encoded image
   * @param {number} maxWidth - Maximum width in pixels
   * @returns {Promise<string>} Resized base64 image with data URI prefix
   */
  async resizeImage(base64Image, maxWidth = 1920) {
    try {
      // Remove data URI prefix if present
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Only resize if image is larger than maxWidth
      if (metadata.width <= maxWidth) {
        return base64Image; // Return original if already small enough
      }

      // Resize image
      const resizedBuffer = await sharp(imageBuffer)
        .resize(maxWidth, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Convert back to base64 with data URI
      const resizedBase64 = resizedBuffer.toString('base64');
      return `data:image/jpeg;base64,${resizedBase64}`;
    } catch (error) {
      throw new Error(`Failed to resize image: ${error.message}`);
    }
  }

  /**
   * Get image dimensions
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<{width: number, height: number}>}
   */
  async getImageDimensions(base64Image) {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const metadata = await sharp(imageBuffer).metadata();
      
      return {
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      throw new Error(`Failed to get image dimensions: ${error.message}`);
    }
  }

  /**
   * Normalize bounding box coordinates
   * @param {number[]} bbox - Bounding box in any format
   * @param {number} imageWidth - Image width in pixels
   * @param {number} imageHeight - Image height in pixels
   * @returns {number[]} Normalized bbox [ymin, xmin, ymax, xmax] (0-1)
   */
  normalizeBoundingBox(bbox, imageWidth, imageHeight) {
    const [ymin, xmin, ymax, xmax] = bbox;
    
    return [
      ymin / imageHeight,
      xmin / imageWidth,
      ymax / imageHeight,
      xmax / imageWidth
    ];
  }
}

module.exports = new ImageUtils();