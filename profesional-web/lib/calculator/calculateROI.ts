import type { CalculatorInputs, CompanySize, PainPoint, ROIResult } from './types';

export const ROI_CAP_PERCENT = 1000;
const ROI_CAP_LABEL = new Intl.NumberFormat('es-ES', { useGrouping: true }).format(ROI_CAP_PERCENT);
export const CLOUD_SAVINGS_RATE = 0.275;
export const FORECAST_IMPACT_FACTOR = 0.05;
export const FORECAST_IMPROVEMENT_RATE = 0.35;
export const INVENTORY_COST_RATE = 0.1;
export const INVENTORY_IMPROVEMENT_RATE = 0.3;
export const INVENTORY_MAX_SAVINGS_RATE = 0.8;

type InventoryOverrideConfig = {
  costRate?: number;
  improvementRate?: number;
  maxSavingsRate?: number;
};

type CalculateROIOptions = {
  inventoryOverrides?: InventoryOverrideConfig;
};

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

const MANUAL_IMPROVEMENT_RATE = 0.5;

function resolveInventoryOverrides(options?: CalculateROIOptions) {
  if (options?.inventoryOverrides) {
    return options.inventoryOverrides;
  }

  const globalOverrides = (globalThis as { __ROI_INVENTORY_OVERRIDES__?: InventoryOverrideConfig })
    .__ROI_INVENTORY_OVERRIDES__;

  return globalOverrides;
}

function calculateInventorySavings(
  inventoryValue: number,
  overrides?: InventoryOverrideConfig
) {
  const costRate = overrides?.costRate ?? INVENTORY_COST_RATE;
  const improvementRate = overrides?.improvementRate ?? INVENTORY_IMPROVEMENT_RATE;
  const maxSavingsRate = overrides?.maxSavingsRate ?? INVENTORY_MAX_SAVINGS_RATE;

  const annualSavings = inventoryValue * costRate * improvementRate;
  const maxPossibleSavings = inventoryValue * maxSavingsRate;
  const cappedSavings = Math.min(annualSavings, maxPossibleSavings);
  const isCapped = annualSavings > maxPossibleSavings;

  return { savings: cappedSavings, isCapped };
}

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

export function calculateROI(inputs: CalculatorInputs, options?: CalculateROIOptions): ROIResult {
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;
  let inventorySavingsCapped = false;
  const size = inputs.companySize;
  const inventoryOverrides = resolveInventoryOverrides(options);

  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const savingsPercent = CLOUD_SAVINGS_RATE;
    const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('cloud-costs', size);
  }

  if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly) {
    const costPerHour = 25;
    const annualSavings = inputs.manualHoursWeekly * 52 * costPerHour * MANUAL_IMPROVEMENT_RATE;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('manual-processes', size);
  }

  if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
    // Base calculation on company revenue and forecast error impact
    const avgRevenue = getRevenueFromSize(size);
    // Forecast errors impact sobre revenue de forma prudente (~5%)
    const impactFactor = FORECAST_IMPACT_FACTOR;
    // Cost of error as percentage of impacted revenue
    const errorCostRate = inputs.forecastErrorPercent / 100;
    // Mejora conservadora del error (30-40%)
    const improvementRate = FORECAST_IMPROVEMENT_RATE;

    const annualSavings = avgRevenue * impactFactor * errorCostRate * improvementRate;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getInvestmentForPain('forecasting', size);
  }

  if (inputs.pains.includes('inventory')) {
    // Inventory optimization based on typical retail/manufacturing scenarios
    const avgInventoryValue = getInventoryFromSize(size);
    const { savings, isCapped } = calculateInventorySavings(avgInventoryValue, inventoryOverrides);

    totalSavingsAnnual += savings;
    totalInvestment += getInvestmentForPain('inventory', size);
    if (isCapped) {
      inventorySavingsCapped = true;
    }
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
    inventorySavingsCapped,
  };
}
