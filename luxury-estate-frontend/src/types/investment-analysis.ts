export interface PropertyInvestmentAnalysisDTO {
  propertyPrice: number

  estimatedMonthlyRent: number

  annualPropertyTaxes: number

  annualInsurance: number

  annualMaintenance: number

  annualHoaFees?: number

  appreciationRate: number

  occupancyRate: number
}

export interface PropertyInvestmentAnalysisResultDTO {
  capRate: number

  grossRentalYield: number

  annualNetIncome: number

  monthlyCashFlow: number

  fiveYearProjection: number

  investmentScore: number
}
