export interface MortgageCalculationDTO {
  propertyPrice: number

  downPayment: number

  interestRate: number

  loanTermYears: number

  propertyTax?: number

  insurance?: number

  hoaFees?: number
}

export interface MortgageCalculationResultDTO {
  monthlyPayment: number

  principalAndInterest: number

  propertyTaxMonthly: number

  insuranceMonthly: number

  hoaMonthly: number

  totalMonthlyPayment: number

  totalInterestPaid: number

  totalLoanCost: number
}
