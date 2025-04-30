
/**
 * Security utilities for the application
 */

/**
 * Sanitize a string to prevent XSS attacks
 * This is a basic sanitization function - for more complex needs, consider DOMPurify
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Basic string sanitization - removes HTML tags
  return input
    .trim()
    // Escape HTML special chars
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : num;
}

/**
 * Clear all sensitive data from storage
 */
export function clearSensitiveData(): void {
  // Clear session storage
  sessionStorage.clear();
  
  // Clear local storage, if needed
  localStorage.clear();
}

/**
 * Get secure item from storage (prefer sessionStorage over localStorage)
 */
export function getSecureItem(key: string): string | null {
  // Try sessionStorage first (more secure)
  const sessionValue = sessionStorage.getItem(key);
  if (sessionValue !== null) return sessionValue;
  
  // Fall back to localStorage if needed
  return localStorage.getItem(key);
}

/**
 * Store item securely (prefer sessionStorage)
 */
export function setSecureItem(key: string, value: string): void {
  sessionStorage.setItem(key, value);
}

/**
 * Remove item from secure storage
 */
export function removeSecureItem(key: string): void {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key); // Clean up both storages
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSecureItem('isLoggedIn') === 'true';
}

/**
 * Logout user by clearing all auth data
 */
export function logout(): void {
  clearSensitiveData();
}
