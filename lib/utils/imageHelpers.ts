// Image utility functions

/**
 * Validate if a URL is a valid image URL
 */
export function validateImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const pathname = urlObj.pathname.toLowerCase();
    
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           pathname.includes('/image/') || // Cloudinary pattern
           urlObj.hostname.includes('unsplash.com') ||
           urlObj.hostname.includes('oaidalleapiprodscus.blob.core.windows.net'); // DALL-E
  } catch {
    return false;
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  // If it's already a Cloudinary URL, add transformations
  if (url.includes('res.cloudinary.com')) {
    const transformations: string[] = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);
    
    const transformString = transformations.join(',');
    
    // Insert transformations after /upload/
    return url.replace('/upload/', `/upload/${transformString}/`);
  }

  // For non-Cloudinary URLs, return as-is
  return url;
}

/**
 * Generate thumbnail URL from original image URL
 */
export function generateThumbnail(url: string, size: number = 300): string {
  return optimizeImageUrl(url, {
    width: size,
    height: size,
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Download image as blob
 */
export async function downloadImageAsBlob(url: string): Promise<Blob> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error(
      `Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Convert image URL to base64
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const blob = await downloadImageAsBlob(url);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Get image dimensions from URL
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Compress image quality for faster loading
 */
export function getCompressedImageUrl(url: string, quality: number = 80): string {
  return optimizeImageUrl(url, { quality, format: 'auto' });
}

/**
 * Get responsive image srcset for different screen sizes
 */
export function getResponsiveImageSrcSet(url: string): string {
  const sizes = [320, 640, 960, 1280, 1920];
  
  return sizes
    .map(size => {
      const optimizedUrl = optimizeImageUrl(url, { width: size, quality: 'auto' });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Preload image for better UX
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(url => preloadImage(url)));
}

/**
 * Extract dominant color from image (placeholder implementation)
 */
export async function extractDominantColor(url: string): Promise<string> {
  // This is a placeholder - in production, you'd use a library like vibrant.js
  // or implement server-side color extraction
  return '#000000';
}

/**
 * Check if image URL is accessible
 */
export async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

