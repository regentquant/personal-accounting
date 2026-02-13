/**
 * Timezone utilities for Context-Aware Local Time model
 * 
 * Core principles:
 * 1. Transactions are stored with their local_date (wall-clock date) and timezone_id
 * 2. Display always shows the original local date (what time it was when spent)
 * 3. New transactions default to device's current timezone
 * 4. User can set a "Home Timezone" preference
 */

export type TimezoneInfo = {
  value: string;
  label: string;
  offset: string;
  region: string;
};

/**
 * List of common timezones grouped by region
 */
export const TIMEZONES: TimezoneInfo[] = [
  // Asia
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: 'UTC+9', region: 'Asia' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time', offset: 'UTC+9', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: 'UTC+5:30', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time', offset: 'UTC+4', region: 'Asia' },
  
  // Americas
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)', offset: 'UTC-8/-7', region: 'Americas' },
  { value: 'America/Denver', label: 'Mountain Time (US)', offset: 'UTC-7/-6', region: 'Americas' },
  { value: 'America/Chicago', label: 'Central Time (US)', offset: 'UTC-6/-5', region: 'Americas' },
  { value: 'America/New_York', label: 'Eastern Time (US)', offset: 'UTC-5/-4', region: 'Americas' },
  { value: 'America/Toronto', label: 'Eastern Time (Canada)', offset: 'UTC-5/-4', region: 'Americas' },
  { value: 'America/Vancouver', label: 'Pacific Time (Canada)', offset: 'UTC-8/-7', region: 'Americas' },
  { value: 'America/Sao_Paulo', label: 'Brasilia Time', offset: 'UTC-3', region: 'Americas' },
  
  // Europe
  { value: 'Europe/London', label: 'British Time', offset: 'UTC+0/+1', region: 'Europe' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: 'UTC+1/+2', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Germany', offset: 'UTC+1/+2', region: 'Europe' },
  { value: 'Europe/Moscow', label: 'Moscow Time', offset: 'UTC+3', region: 'Europe' },
  
  // Oceania
  { value: 'Australia/Sydney', label: 'Australian Eastern', offset: 'UTC+10/+11', region: 'Oceania' },
  { value: 'Australia/Perth', label: 'Australian Western', offset: 'UTC+8', region: 'Oceania' },
  { value: 'Pacific/Auckland', label: 'New Zealand', offset: 'UTC+12/+13', region: 'Oceania' },
];

/**
 * Get timezone info by value
 */
export function getTimezoneInfo(timezoneId: string): TimezoneInfo | undefined {
  return TIMEZONES.find(tz => tz.value === timezoneId);
}

/**
 * Get the device's current timezone
 */
export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Shanghai'; // Fallback
  }
}

/**
 * Get the current date in a specific timezone as YYYY-MM-DD
 */
export function getLocalDateInTimezone(timezone: string = 'Asia/Shanghai'): string {
  const now = new Date();
  try {
    // Use en-CA locale which gives YYYY-MM-DD format
    return now.toLocaleDateString('en-CA', { 
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    // Fallback if timezone is invalid
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Get the current time in a specific timezone as HH:MM:SS
 */
export function getLocalTimeInTimezone(timezone: string = 'Asia/Shanghai'): string {
  const now = new Date();
  try {
    return now.toLocaleTimeString('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return now.toTimeString().slice(0, 8);
  }
}

/**
 * Get the current month and year in a specific timezone
 * Returns { month: 0-11, year: YYYY }
 */
export function getMonthYearInTimezone(timezone: string = 'Asia/Shanghai'): { month: number; year: number } {
  const now = new Date();
  try {
    const dateStr = now.toLocaleDateString('en-US', { 
      timeZone: timezone,
      month: 'numeric',
      year: 'numeric'
    });
    const [month, year] = dateStr.split('/').map(Number);
    return { month: month - 1, year }; // month is 0-indexed
  } catch {
    return { month: now.getMonth(), year: now.getFullYear() };
  }
}

/**
 * Parse a date string (YYYY-MM-DD) and get its month/year
 * This does NOT do timezone conversion - it just parses the date as-is
 */
export function getMonthYearFromLocalDate(dateStr: string): { month: number; year: number } {
  const [year, month] = dateStr.split('-').map(Number);
  return { month: month - 1, year }; // month is 0-indexed
}

/**
 * Convert a "naked" date (YYYY-MM-DD) in a source timezone to UTC ISO string
 * Used for import when we know the timezone the date was in
 */
export function localDateToUTC(
  dateStr: string, 
  timezone: string,
  time: string = '12:00:00' // Default to noon to avoid DST edge cases
): string {
  try {
    // Create a date string that JavaScript can parse with timezone
    const dateTimeStr = `${dateStr}T${time}`;
    
    // Create formatter to get UTC equivalent
    const date = new Date(dateTimeStr);
    
    // Get the offset for this timezone at this date
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Parse the formatted date back
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
    
    const localYear = parseInt(getPart('year'));
    const localMonth = parseInt(getPart('month')) - 1;
    const localDay = parseInt(getPart('day'));
    const localHour = parseInt(getPart('hour'));
    const localMinute = parseInt(getPart('minute'));
    const localSecond = parseInt(getPart('second'));
    
    // Create UTC date from local components
    const utcDate = new Date(Date.UTC(localYear, localMonth, localDay, localHour, localMinute, localSecond));
    
    // Calculate offset by comparing
    const offset = date.getTime() - utcDate.getTime();
    
    // Apply offset to get true UTC
    const trueUTC = new Date(date.getTime() - offset);
    
    return trueUTC.toISOString();
  } catch {
    // Fallback: treat as UTC
    return new Date(`${dateStr}T${time}Z`).toISOString();
  }
}

/**
 * Format a local date for display
 * Shows the wall-clock date as it was originally entered
 */
export function formatLocalDate(
  localDate: string,
  options?: { includeYear?: boolean; relative?: boolean }
): string {
  const { includeYear = true, relative = false } = options || {};
  
  if (relative) {
    const today = getLocalDateInTimezone(getDeviceTimezone());
    const [todayYear, todayMonth, todayDay] = today.split('-').map(Number);
    const [dateYear, dateMonth, dateDay] = localDate.split('-').map(Number);
    
    const todayDate = new Date(todayYear, todayMonth - 1, todayDay);
    const targetDate = new Date(dateYear, dateMonth - 1, dateDay);
    const diffDays = Math.floor((todayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
  }
  
  // Parse the date without timezone conversion
  const [year, month, day] = localDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (includeYear) {
    return `${monthNames[month - 1]} ${day}, ${year}`;
  }
  return `${monthNames[month - 1]} ${day}`;
}

/**
 * Get a display string for a timezone
 */
export function formatTimezoneDisplay(timezoneId: string): string {
  const info = getTimezoneInfo(timezoneId);
  if (info) {
    return `${info.label} (${info.offset})`;
  }
  // Fallback: extract city name from timezone ID
  const city = timezoneId.split('/').pop()?.replace(/_/g, ' ') || timezoneId;
  return city;
}

/**
 * Group timezones by region for selector UI
 */
export function getTimezonesByRegion(): Record<string, TimezoneInfo[]> {
  return TIMEZONES.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = [];
    }
    acc[tz.region].push(tz);
    return acc;
  }, {} as Record<string, TimezoneInfo[]>);
}

/**
 * Check if a timezone ID is valid
 */
export function isValidTimezone(timezoneId: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezoneId });
    return true;
  } catch {
    return false;
  }
}




