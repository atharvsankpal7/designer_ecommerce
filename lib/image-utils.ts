// Image validation and utility functions

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: "File must be an image" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 10MB" };
  }

  // Check for supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: "Supported formats: JPEG, PNG, GIF, WebP" };
  }

  return { isValid: true };
}

export function validateImageUrl(url: string): ImageValidationResult {
  if (!url || !url.trim()) {
    return { isValid: false, error: "URL is required" };
  }

  try {
    const urlObj = new URL(url.trim());
    
    // Check if it's a valid HTTP/HTTPS URL
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: "URL must use HTTP or HTTPS protocol" };
    }

    // Check if URL looks like an image (basic check)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));
    
    // Allow URLs without extensions (like Cloudinary URLs with transformations)
    // but warn if it doesn't look like an image
    if (!hasImageExtension && !pathname.includes('image') && !urlObj.hostname.includes('cloudinary')) {
      // This is just a warning, not an error
      console.warn('URL may not be an image:', url);
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid URL format" };
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateImageAltText(filename: string, title?: string): string {
  // Remove file extension and clean up filename
  const cleanName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
  if (title) {
    return `${title} - ${cleanName}`;
  }
  
  return cleanName || 'Hero slide image';
}