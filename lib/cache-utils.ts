// Utility functions for cache management

/**
 * Revalidate section caches by calling the API endpoint
 * This should be called from admin panel when sections are updated
 */
export async function revalidateSectionCaches(): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate/sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to revalidate section caches:', response.statusText);
      return false;
    }

    const result = await response.json();
    return true;
  } catch (error) {
    console.error('Error calling revalidation API:', error);
    return false;
  }
}

/**
 * Revalidate product caches by calling the API endpoint
 * This should be called from admin panel when products are updated
 */
export async function revalidateProductCaches(): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to revalidate product caches:', response.statusText);
      return false;
    }

    const result = await response.json();
    return true;
  } catch (error) {
    console.error('Error calling product revalidation API:', error);
    return false;
  }
}

/**
 * Revalidate hero slide caches by calling the API endpoint
 * This should be called from admin panel when hero slides are updated
 */
export async function revalidateHeroSlideCaches(): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate/hero-slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to revalidate hero slide caches:', response.statusText);
      return false;
    }

    const result = await response.json();
    return true;
  } catch (error) {
    console.error('Error calling hero slide revalidation API:', error);
    return false;
  }
}