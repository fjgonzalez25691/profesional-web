import type { CalculatorInputs, ROIResult } from './types';

export function calculateROI(inputs: CalculatorInputs): ROIResult {
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;

  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const savingsPercent = 0.35;
    const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
    totalSavingsAnnual += annualSavings;
    totalInvestment += 3200;
  }

  if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly) {
    const costPerHour = 25;
    const annualSavings = inputs.manualHoursWeekly * 52 * costPerHour * 0.7;
    totalSavingsAnnual += annualSavings;
    totalInvestment += 4800;
  }

  const hasSavings = totalSavingsAnnual > 0 && totalInvestment > 0;
  const paybackMonths = hasSavings ? Math.round((totalInvestment / totalSavingsAnnual) * 12) : 0;
  const roi3Years = hasSavings
    ? Math.round(((totalSavingsAnnual * 3 - totalInvestment) / totalInvestment) * 100)
    : 0;

  return {
    investment: Math.round(totalInvestment),
    savingsAnnual: Math.round(totalSavingsAnnual),
    paybackMonths,
    roi3Years,
  };
}
