/**
 * Date utilities
 *
 * Transactions store local_date (the wall-clock date the user saw).
 * No timezone conversion is needed — dates are always displayed as-is.
 */

/**
 * Get today's date as YYYY-MM-DD using the device's local clock.
 */
export function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string (YYYY-MM-DD) and get its month/year.
 * This does NOT do timezone conversion — it just parses the date as-is.
 */
export function getMonthYearFromLocalDate(dateStr: string): { month: number; year: number } {
  const [year, month] = dateStr.split('-').map(Number);
  return { month: month - 1, year }; // month is 0-indexed
}
