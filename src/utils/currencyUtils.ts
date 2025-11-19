/**
 * Currency utility functions
 */

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'SEK' for Swedish Krona)
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency = 'SEK',
  locale = 'sv-SE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
