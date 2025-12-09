import { roiConfig } from '@/components/calculator/calculatorConfig';
import type { CalculatorInputs, CompanySize, PainPoint, ROICalculationResult } from './types';
import { shouldCalculateROI } from './validation';

export const ROI_CAP_PERCENT = 1000;
const ROI_CAP_LABEL = new Intl.NumberFormat('es-ES', { useGrouping: true }).format(ROI_CAP_PERCENT);
export const CLOUD_SAVINGS_RATE = 0.275; // Deprecated: usar getCloudSavingsRate()
export const FORECAST_IMPACT_FACTOR = 0.05;
export const FORECAST_IMPROVEMENT_RATE = 0.35;
export const INVENTORY_COST_RATE = 0.1;
export const INVENTORY_IMPROVEMENT_RATE = 0.3;
export const INVENTORY_MAX_SAVINGS_RATE = 0.8;

const EXTREME_ROI_THRESHOLD = 90;
const MIN_PAYBACK_MONTHS = roiConfig.thresholds.minPaybackMonths;

/**
 * FJG-XXX: Calcula el % de ahorro cloud de forma progresiva según gasto mensual.
 * A mayor gasto, menor % de ahorro (más optimización previa esperada).
 */
function getCloudSavingsRate(monthlySpend: number): number {
  if (monthlySpend <= 5000) return 0.12;    // 12%
  if (monthlySpend <= 10000) return 0.10;   // 10%
  if (monthlySpend <= 25000) return 0.08;   // 8%
  return 0.06;                              // 6% para >25k/mes
}

/**
 * FJG-XXX: Calcula la inversión para cloud como % de facturación estimada.
 * Reemplaza el cálculo anterior basado en baseInvestment escalado.
 */
function getCloudInvestment(companySize: CompanySize): number {
  const revenue = roiConfig.companySizes[companySize].estimatedRevenue;
  const percent = roiConfig.pains.cloud.investmentPercentBySize[companySize];
  return Math.round(revenue * percent);
}

type InventoryOverrideConfig = {
  costRate?: number;
  improvementRate?: number;
  maxSavingsRate?: number;
};

type CalculateROIOptions = {
  inventoryOverrides?: InventoryOverrideConfig;
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
  return roiConfig.companySizes[companySize].estimatedRevenue;
}

export function getInventoryFromSize(companySize: CompanySize) {
  return roiConfig.companySizes[companySize].estimatedInventory;
}

export function getInvestmentForPain(pain: PainPoint, companySize: CompanySize) {
  // FJG-XXX: cloud-costs ahora usa % de facturación en lugar de baseInvestment
  if (pain === 'cloud-costs') {
    return getCloudInvestment(companySize);
  }

  // Para el resto de dolores, usar baseInvestment * multiplier
  const investmentMultiplier = roiConfig.companySizes[companySize].investmentMultiplier;

  const painConfigMap: Record<PainPoint, keyof typeof roiConfig.pains> = {
    'cloud-costs': 'cloud', // No se usa pero se mantiene para completitud
    'manual-processes': 'manual',
    forecasting: 'forecast',
    inventory: 'inventory',
  };

  const painKey = painConfigMap[pain];
  const baseInvestment = roiConfig.pains[painKey].baseInvestment;

  return Math.round(baseInvestment * investmentMultiplier);
}

export function formatRoiWithCap(roi3Years: number) {
  const isCapped = roi3Years > ROI_CAP_PERCENT;
  const label = isCapped ? `> ${ROI_CAP_LABEL}%` : `${Math.round(roi3Years)}%`;
  return { label, isCapped };
}

export function calculateROI(inputs: CalculatorInputs, options?: CalculateROIOptions): ROICalculationResult {
  // Verificar si podemos calcular ROI
  const validation = shouldCalculateROI(inputs);

  if (!validation.canCalculate) {
    const isMultiPain = validation.reason === 'multi_pain';
    const recommendedAction = isMultiPain
      ? 'Agendar una sesión personalizada de 30 minutos para revisar tus dolores combinados y darte cifras realistas.'
      : 'Recomendamos una consulta personalizada para analizar tu caso específico. Agenda una llamada para discutir las mejores soluciones para tu empresa.';

    return {
      type: 'fallback',
      reason: validation.reason!,
      message:
        validation.message ??
        'Necesitamos validar tus datos contigo para darte una estimación fiable. Agenda una consulta personalizada.',
      recommendedAction,
    };
  }

  // Cálculo normal
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;
  let inventorySavingsCapped = false;
  const size = inputs.companySize;
  const inventoryOverrides = resolveInventoryOverrides(options);

  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    // FJG-XXX: Usar savings rate progresivo (6-12%) e inversión como % facturación
    const savingsPercent = getCloudSavingsRate(inputs.cloudSpendMonthly);
    const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
    totalSavingsAnnual += annualSavings;
    totalInvestment += getCloudInvestment(size);
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

  // FJG-96: Escenarios extremadamente optimistas deben activar fallback
  if (
    hasSavings &&
    (roi3Years > EXTREME_ROI_THRESHOLD || paybackMonths < MIN_PAYBACK_MONTHS)
  ) {
    return {
      type: 'fallback',
      reason: 'extreme_roi',
      message:
        'Los datos introducidos generan un escenario extremadamente optimista (ROI muy alto o retorno muy rápido). Para garantizar resultados realistas, necesitamos validar el caso contigo.',
      recommendedAction:
        'Agenda una consulta gratuita de 30 minutos para revisar tus datos y obtener una estimación ajustada a tu contexto.',
    };
  }

  return {
    type: 'success',
    investment: Math.round(totalInvestment),
    savingsAnnual: Math.round(totalSavingsAnnual),
    paybackMonths,
    roi3Years,
    inventorySavingsCapped,
  };
}
