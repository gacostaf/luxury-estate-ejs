import { useMemo, useState } from 'react'

import {
  Calculator,
  DollarSign,
  Percent,
  Landmark,
} from 'lucide-react'

import { Input } from '@/components/common/Input/Input'

import { Select } from '@/components/common/Input/Select'

interface MortgageCalculatorProps {
  propertyPrice: number
}

export function MortgageCalculator({
  propertyPrice,
}: MortgageCalculatorProps) {
  const [values, setValues] = useState({
    propertyPrice,
    downPayment: propertyPrice * 0.2,
    interestRate: 6.5,
    loanTermYears: 30,
    propertyTax: 12000,
    insurance: 3500,
    hoaFees: 500,
  })

  const results = useMemo(() => {
    const principal =
      values.propertyPrice - values.downPayment

    const monthlyRate =
      values.interestRate / 100 / 12

    const totalPayments =
      values.loanTermYears * 12

    const monthlyPayment =
      (principal *
        (monthlyRate *
          Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(
        1 + monthlyRate,
        totalPayments,
      ) - 1)

    const propertyTaxMonthly =
      values.propertyTax / 12

    const insuranceMonthly =
      values.insurance / 12

    const hoaMonthly = values.hoaFees

    const totalMonthlyPayment =
      monthlyPayment +
      propertyTaxMonthly +
      insuranceMonthly +
      hoaMonthly

    const totalLoanCost =
      monthlyPayment * totalPayments

    const totalInterestPaid =
      totalLoanCost - principal

    return {
      monthlyPayment,
      propertyTaxMonthly,
      insuranceMonthly,
      hoaMonthly,
      totalMonthlyPayment,
      totalLoanCost,
      totalInterestPaid,
    }
  }, [values])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Calculator */}
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-12">
            <div>
              <span className="inline-flex items-center gap-3 rounded-full bg-[#C6A15B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                <Calculator className="h-4 w-4" />

                Mortgage Calculator
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Estimate Your Monthly Payment
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Explore financing scenarios and understand your estimated monthly mortgage costs.
              </p>
            </div>

            {/* Form */}
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Input
                label="Property Price"
                type="number"
                leftIcon={<DollarSign className="h-5 w-5" />}
                value={values.propertyPrice}
                onChange={(e) =>
                  setValues({
                    ...values,
                    propertyPrice: Number(e.target.value),
                  })
                }
              />

              <Input
                label="Down Payment"
                type="number"
                leftIcon={<Landmark className="h-5 w-5" />}
                value={values.downPayment}
                onChange={(e) =>
                  setValues({
                    ...values,
                    downPayment: Number(e.target.value),
                  })
                }
              />

              <Input
                label="Interest Rate (%)"
                type="number"
                leftIcon={<Percent className="h-5 w-5" />}
                value={values.interestRate}
                onChange={(e) =>
                  setValues({
                    ...values,
                    interestRate: Number(e.target.value),
                  })
                }
              />

              <Select
                label="Loan Term"
                value={
                  values.loanTermYears.toString()
                }
                onChange={(e) =>
                  setValues({
                    ...values,
                    loanTermYears: Number(
                      e.target.value,
                    ),
                  })
                }
                options={[
                  {
                    label: '15 Years',
                    value: '15',
                  },
                  {
                    label: '20 Years',
                    value: '20',
                  },
                  {
                    label: '30 Years',
                    value: '30',
                  },
                ]}
              />

              <Input
                label="Annual Property Tax"
                type="number"
                value={values.propertyTax}
                onChange={(e) =>
                  setValues({
                    ...values,
                    propertyTax: Number(e.target.value),
                  })
                }
              />

              <Input
                label="Annual Insurance"
                type="number"
                value={values.insurance}
                onChange={(e) =>
                  setValues({
                    ...values,
                    insurance: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {/* Monthly Payment */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-10 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C6A15B] blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
                  Estimated Monthly Payment
                </p>

                <h3 className="mt-8 text-6xl font-bold leading-none">
                  {formatCurrency(
                    results.totalMonthlyPayment,
                  )}
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-300">
                  Includes principal, interest, taxes, insurance, and HOA fees.
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Monthly Payment Breakdown
              </h3>

              <div className="mt-8 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-5">
                  <span className="text-slate-600">
                    Principal & Interest
                  </span>

                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      results.monthlyPayment,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="text-slate-600">
                    Property Taxes
                  </span>

                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      results.propertyTaxMonthly,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="text-slate-600">
                    Insurance
                  </span>

                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      results.insuranceMonthly,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="text-slate-600">
                    HOA Fees
                  </span>

                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      results.hoaMonthly,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Financing CTA */}
            <div className="rounded-[32px] border border-[#C6A15B]/20 bg-[#C6A15B]/5 p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-[#C6A15B]">
                Financing Assistance
              </p>

              <h3 className="mt-4 text-3xl font-bold text-slate-900">
                Get Pre-Qualified Today
              </h3>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Connect with financing specialists and explore personalized mortgage options.
              </p>

              <button className="mt-8 inline-flex items-center rounded-2xl bg-[#C6A15B] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90">
                Request Financing Assistance
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
