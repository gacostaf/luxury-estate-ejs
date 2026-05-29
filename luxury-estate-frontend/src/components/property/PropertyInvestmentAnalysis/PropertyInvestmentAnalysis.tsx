import { useMemo } from 'react'

import {
  TrendingUp,
  DollarSign,
  Building2,
  BarChart3,
} from 'lucide-react'

interface PropertyInvestmentAnalysisProps {
  propertyPrice: number

  estimatedMonthlyRent: number

  annualPropertyTaxes: number

  annualInsurance: number

  annualMaintenance: number

  annualHoaFees?: number

  appreciationRate?: number
}

export function PropertyInvestmentAnalysis({
  propertyPrice,
  estimatedMonthlyRent,
  annualPropertyTaxes,
  annualInsurance,
  annualMaintenance,
  annualHoaFees = 0,
  appreciationRate = 5,
}: PropertyInvestmentAnalysisProps) {

  const metrics = useMemo(() => {

    const annualRentalIncome =
      estimatedMonthlyRent * 12

    const annualExpenses =
      annualPropertyTaxes +
      annualInsurance +
      annualMaintenance +
      annualHoaFees

    const annualNetIncome =
      annualRentalIncome -
      annualExpenses

    const capRate =
      (annualNetIncome /
        propertyPrice) *
      100

    const grossRentalYield =
      (annualRentalIncome /
        propertyPrice) *
      100

    const fiveYearProjection =
      propertyPrice *
      Math.pow(
        1 + appreciationRate / 100,
        5,
      )

    const investmentScore =
      Math.min(
        100,
        Math.round(
          capRate * 10 +
          grossRentalYield * 5,
        ),
      )

    return {
      annualRentalIncome,
      annualNetIncome,
      capRate,
      grossRentalYield,
      fiveYearProjection,
      investmentScore,
    }
  }, [
    propertyPrice,
    estimatedMonthlyRent,
    annualPropertyTaxes,
    annualInsurance,
    annualMaintenance,
    annualHoaFees,
    appreciationRate,
  ])

  const currency = (
    value: number,
  ) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      },
    ).format(value)

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-4xl">
          <span className="inline-flex rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
            Investment Analysis
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Property Investment Potential
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Evaluate the property's potential returns and long-term value growth.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            icon={<BarChart3 />}
            label="Cap Rate"
            value={`${metrics.capRate.toFixed(2)}%`}
          />

          <MetricCard
            icon={<TrendingUp />}
            label="Rental Yield"
            value={`${metrics.grossRentalYield.toFixed(2)}%`}
          />

          <MetricCard
            icon={<DollarSign />}
            label="Annual Net Income"
            value={currency(metrics.annualNetIncome)}
          />

          <MetricCard
            icon={<Building2 />}
            label="Investment Score"
            value={`${metrics.investmentScore}/100`}
          />

        </div>

        <div className="mt-12 rounded-[32px] bg-slate-900 p-10 text-white">

          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
            Five-Year Projection
          </p>

          <h3 className="mt-6 text-5xl font-bold">
            {currency(
              metrics.fiveYearProjection,
            )}
          </h3>

          <p className="mt-6 text-slate-300 leading-8">
            Estimated future property value based on projected appreciation.
          </p>

        </div>

      </div>
    </section>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A15B]/10 text-[#C6A15B]">
        {icon}
      </div>

      <h3 className="mt-6 text-sm uppercase tracking-wide text-slate-500">
        {label}
      </h3>

      <p className="mt-4 text-4xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  )
}   