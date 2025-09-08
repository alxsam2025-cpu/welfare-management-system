/**
 * Currency formatting utilities for Ghana Cedis
 */

/**
 * Format amount as Ghana Cedis with proper symbol
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string with ₵ symbol
 */
export function formatCurrency(amount: number, options: {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showSymbol?: boolean
} = {}): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true
  } = options

  // Format the number with commas
  const formatted = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount)

  // Return with Ghana Cedis symbol
  return showSymbol ? `₵${formatted}` : formatted
}

/**
 * Parse currency string back to number
 * @param currencyString - String like "₵1,234.56"
 * @returns Number value
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and commas, then parse
  const cleanString = currencyString.replace(/[₵,\s]/g, '')
  return parseFloat(cleanString) || 0
}

/**
 * Format currency for input fields (without symbol)
 * @param amount - The amount to format
 * @returns Formatted string for input fields
 */
export function formatCurrencyForInput(amount: number): string {
  return formatCurrency(amount, { showSymbol: false })
}

/**
 * Get currency symbol
 * @returns Ghana Cedis symbol
 */
export function getCurrencySymbol(): string {
  return '₵'
}

/**
 * Get currency code
 * @returns Currency code
 */
export function getCurrencyCode(): string {
  return 'GHC'
}

/**
 * Format large amounts with abbreviations (K, M, B)
 * @param amount - The amount to format
 * @returns Abbreviated formatted currency
 */
export function formatCurrencyAbbreviated(amount: number): string {
  if (amount >= 1000000000) {
    return `₵${(amount / 1000000000).toFixed(1)}B`
  } else if (amount >= 1000000) {
    return `₵${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `₵${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}
