/**
 * Date utility functions
 * These are example utilities - feel free to add more or use a library like date-fns
 */

/**
 * Format a date string to a localized format
 * @param dateString - ISO date string
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale = 'sv-SE'): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format a date string to a relative time format (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns true if date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

/**
 * Check if a date is within a date range
 * @param dateString - ISO date string to check
 * @param startDate - Start of range (ISO date string)
 * @param endDate - End of range (ISO date string)
 * @returns true if date is within range
 */
export const isDateInRange = (
  dateString: string,
  startDate: string,
  endDate: string
): boolean => {
  const date = new Date(dateString);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return date >= start && date <= end;
};
