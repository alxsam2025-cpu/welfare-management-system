/**
 * List of banks in Ghana
 */

export interface Bank {
  code: string
  name: string
  fullName: string
}

export const GHANA_BANKS: Bank[] = [
  { code: 'GCB', name: 'Ghana Commercial Bank', fullName: 'Ghana Commercial Bank Limited' },
  { code: 'ECO', name: 'Ecobank Ghana', fullName: 'Ecobank Ghana Limited' },
  { code: 'SBG', name: 'Stanbic Bank Ghana', fullName: 'Stanbic Bank Ghana Limited' },
  { code: 'CAL', name: 'CAL Bank', fullName: 'CAL Bank Limited' },
  { code: 'FBL', name: 'Fidelity Bank', fullName: 'Fidelity Bank Ghana Limited' },
  { code: 'ABG', name: 'Absa Bank Ghana', fullName: 'Absa Bank Ghana Limited' },
  { code: 'ADB', name: 'Agricultural Development Bank', fullName: 'Agricultural Development Bank Limited' },
  { code: 'UBL', name: 'UMB Bank', fullName: 'Universal Merchant Bank Limited' },
  { code: 'SCB', name: 'Standard Chartered Bank', fullName: 'Standard Chartered Bank Ghana Limited' },
  { code: 'ZBG', name: 'Zenith Bank Ghana', fullName: 'Zenith Bank Ghana Limited' },
  { code: 'SGB', name: 'Societe Generale Ghana', fullName: 'Societe Generale Ghana Limited' },
  { code: 'PBG', name: 'Prudential Bank', fullName: 'Prudential Bank Ghana Limited' },
  { code: 'CBG', name: 'Consolidated Bank Ghana', fullName: 'Consolidated Bank Ghana Limited' },
  { code: 'RBL', name: 'Republic Bank Ghana', fullName: 'Republic Bank Ghana Limited' },
  { code: 'GNB', name: 'GN Bank', fullName: 'GN Bank Limited' },
  { code: 'BOA', name: 'Bank of Africa Ghana', fullName: 'Bank of Africa Ghana Limited' },
  { code: 'ICB', name: 'IC Bank', fullName: 'International Commercial Bank Limited' },
  { code: 'ARB', name: 'ARB Banks', fullName: 'Association of Rural Banks' },
  { code: 'TMB', name: 'The Master Bank', fullName: 'The Master Bank Limited' },
  { code: 'OBG', name: 'Omni Bank Ghana', fullName: 'Omni Bank Ghana Limited' },
  { code: 'TBL', name: 'TrustBank', fullName: 'TrustBank Limited' },
  { code: 'FNB', name: 'First National Bank', fullName: 'First National Bank Ghana Limited' },
  { code: 'NBG', name: 'National Investment Bank', fullName: 'National Investment Bank Limited' },
  { code: 'UBA', name: 'UBA Ghana', fullName: 'United Bank for Africa Ghana Limited' },
  { code: 'GTB', name: 'Guaranty Trust Bank', fullName: 'Guaranty Trust Bank Ghana Limited' },
]

/**
 * Get bank by code
 */
export function getBankByCode(code: string): Bank | undefined {
  return GHANA_BANKS.find(bank => bank.code === code)
}

/**
 * Get bank names for dropdown
 */
export function getBankNames(): string[] {
  return GHANA_BANKS.map(bank => bank.name)
}

/**
 * Search banks by name
 */
export function searchBanks(query: string): Bank[] {
  const lowercaseQuery = query.toLowerCase()
  return GHANA_BANKS.filter(bank => 
    bank.name.toLowerCase().includes(lowercaseQuery) ||
    bank.fullName.toLowerCase().includes(lowercaseQuery)
  )
}
