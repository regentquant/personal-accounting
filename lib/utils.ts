import { clsx, type ClassValue } from "clsx";
import { getDeviceTimezone, getLocalDateInTimezone } from "./timezone";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = "¥"): string {
  return `${currency}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string | Date): string {
  // If it's a string in YYYY-MM-DD format (local_date), parse without timezone conversion
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${day}, ${year}`;
  }
  
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date relative to today (Today, Yesterday, or full date)
 * Uses local_date format (YYYY-MM-DD) to avoid timezone conversion issues
 */
export function formatRelativeDate(date: string | Date): string {
  // Get today's date in device timezone
  const todayStr = getLocalDateInTimezone(getDeviceTimezone());
  
  // Parse target date - if YYYY-MM-DD string, use directly
  let targetStr: string;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    targetStr = date;
  } else {
    const d = new Date(date);
    targetStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  
  // Parse dates for comparison
  const [todayYear, todayMonth, todayDay] = todayStr.split('-').map(Number);
  const [targetYear, targetMonth, targetDay] = targetStr.split('-').map(Number);
  
  const today = new Date(todayYear, todayMonth - 1, todayDay);
  const target = new Date(targetYear, targetMonth - 1, targetDay);
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  
  // For all other dates, show formatted date (e.g., "Dec 24, 2025")
  return formatDate(targetStr);
}

export function getMonthName(month: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month];
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
