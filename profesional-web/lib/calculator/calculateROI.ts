import type { CalculatorInputs, CompanySize, PainPoint, ROIResult } from './types';

export const ROI_CAP_PERCENT = 1000;
const ROI_CAP_LABEL = new Intl.NumberFormat('es-ES', { useGrouping: true }).format(ROI_CAP_PERCENT);

const SIZE_FACTORS: Record<CompanySize, number> = {
  '5-10M': 1,
  '10-25M': 1.2,
  '25-50M': 1.6,
  '50M+': 2,
};

const REVENUE_BY_SIZE: Record<CompanySize, number> = {
  '5-10M': 8_000_000,
  '10-25M': 17_500_000,
  '25-50M': 35_000_000,
  '50M+': 60_000_000,
};

const INVENTORY_BY_SIZE: Record<CompanySize, number> = {
  '5-10M': 500_000,
  '10-25M': 1_200_000,
  '25-50M': 3_000_000,
  '50M+': 6_000_000,
};

const INVESTMENT_BASE: Record<PainPoint, number> = {
  'cloud-costs': 2500,
  'manual-processes': 3600,
  forecasting: 4200,
  inventory: 4200,
};

const INVESTMENT_MULTIPLIER: Record<PainPoint, number> = {
  'cloud-costs': 600,
  'manual-processes': 1000,
  forecasting: 1400,
  inventory: 1400,
};

export function getRevenueFromSize(companySize: CompanySize) {
  return REVENUE_BY_SIZE[companySize];
}

export function getInventoryFromSize(companySize: CompanySize) {
  return INVENTORY_BY_SIZE[companySize];
}

export function getInvestmentForPain(pain: PainPoint, companySize: CompanySize) {
  const sizeFactor = SIZE_FACTORS[companySize];
  const base = INVESTMENT_BASE[pain];
  const variable = INVESTMENT_MULTIPLIER[pain] * sizeFactor;
  return Math.round(base + variable);
}

export function formatRoiWithCap(roi3Years: number) {
  const isCapped = roi3Years > ROI_CAP_PERCENT;
  const label = isCapped ? `> ${ROI_CAP_LABEL}%` : `${Math.round(roi3Years)}%`;
  return { label, isCapped };
}

export function calculateROI(inputs: CalculatorInputs): ROIResult {
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;
  const size = inputs.companySize;

  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const savingsPercent = 0.35;
    const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('cloud-costs', size);
  }

  if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly) {
    const costPerHour = 25;
    const annualSavings = inputs.manualHoursWeekly * 52 * costPerHour * 0.7;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('manual-processes', size);
  }

  if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
    // Base calculation on company revenue and forecast error impact
    const avgRevenue = getRevenueFromSize(size);
    // Forecast errors typically impact 5-15% of revenue through excess inventory, production changes, etc.
    const impactFactor = 0.08;
    // Cost of error as percentage of impacted revenue
    const errorCostRate = inputs.forecastErrorPercent / 100;
    // ML/IA can typically reduce forecast error by 40-60%
    const improvementRate = 0.5;

    const annualSavings = avgRevenue * impactFactor * errorCostRate * improvementRate;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('forecasting', size);
  }

  if (inputs.pains.includes('inventory')) {
    // Inventory optimization based on typical retail/manufacturing scenarios
    const avgInventoryValue = getInventoryFromSize(size);
    // Typical cost of poor inventory management: 8-15% annually (obsolescence, storage, opportunity cost)
    const inventoryCostRate = 0.12;
    // Automated inventory management can reduce costs by 30-50%
    const improvementRate = 0.4;

    const annualSavings = avgInventoryValue * inventoryCostRate * improvementRate;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('inventory', size);
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
