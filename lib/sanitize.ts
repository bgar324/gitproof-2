// CRITICAL FIX: Centralized sanitization for PostgreSQL
// Removes null bytes and other problematic characters that cause DB errors

/**
 * Sanitize data for PostgreSQL JSON storage
 * Removes null bytes (\u0000) which PostgreSQL cannot handle in JSON columns
 *
 * @param obj - Any object to sanitize
 * @returns Sanitized object safe for PostgreSQL
 */
export function sanitizeForPostgres<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Convert to JSON string, remove null bytes, parse back
  const jsonString = JSON.stringify(obj);

  // Remove null bytes in both escaped and unescaped forms
  const sanitized = jsonString
    .replace(/\\u0000/g, "") // Escaped null byte
    .replace(/\u0000/g, ""); // Literal null byte

  return JSON.parse(sanitized) as T;
}

/**
 * Sanitize a string value
 * Useful for individual field sanitization
 * Preserves newlines, tabs, and carriage returns
 */
export function sanitizeString(str: string | null | undefined): string {
  if (!str) return "";

  return str
    .replace(/\u0000/g, "") // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // Remove control characters except \t (0x09), \n (0x0A), \r (0x0D)
}

/**
 * Sanitize an array of strings
 */
export function sanitizeStringArray(
  arr: string[] | null | undefined
): string[] {
  if (!arr || !Array.isArray(arr)) return [];

  return arr.map((str) => sanitizeString(str)).filter((str) => str.length > 0);
}
