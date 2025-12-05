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

  if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
    // Base calculation on company revenue and forecast error impact
    // Average revenue for target companies: 15-25M€
    const avgRevenue = 20000000;
    // Forecast errors typically impact 5-15% of revenue through excess inventory, production changes, etc.
    const impactFactor = 0.08;
    // Cost of error as percentage of impacted revenue
    const errorCostRate = inputs.forecastErrorPercent / 100;
    // ML/IA can typically reduce forecast error by 40-60%
    const improvementRate = 0.5;

    const annualSavings = avgRevenue * impactFactor * errorCostRate * improvementRate;
    totalSavingsAnnual += annualSavings;
    totalInvestment += 5800;
  }

  if (inputs.pains.includes('inventory')) {
    // Inventory optimization based on typical retail/manufacturing scenarios
    // Average inventory value for target companies: 500K-2M€
    const avgInventoryValue = 1000000;
    // Typical cost of poor inventory management: 8-15% annually (obsolescence, storage, opportunity cost)
    const inventoryCostRate = 0.12;
    // Automated inventory management can reduce costs by 30-50%
    const improvementRate = 0.4;

    const annualSavings = avgInventoryValue * inventoryCostRate * improvementRate;
    totalSavingsAnnual += annualSavings;
    totalInvestment += 5800;
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
