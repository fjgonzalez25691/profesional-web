import { roiConfig } from '@/components/calculator/calculatorConfig';
import { formatRoiWithCap, getRevenueFromSize } from './calculateROI';
import type { CalculatorInputs, CalculatorWarning, ROIResult, ROIFallback, ROISuccess } from './types';

export type CalculatorInputErrors = Partial<
  Record<'cloudSpendMonthly' | 'manualHoursWeekly' | 'forecastErrorPercent', string>
>;

const isMissing = (value: number | undefined) => value === undefined || Number.isNaN(value);
const formatNumber = (value: number) => value.toLocaleString('es-ES');

export function validateCalculatorInputs(inputs: CalculatorInputs): CalculatorInputErrors {
  const errors: CalculatorInputErrors = {};
  const { cloudSpendMonthly, manualHoursWeekly, forecastErrorPercent } = roiConfig.inputs;

  if (inputs.pains.includes('cloud-costs')) {
    const value = inputs.cloudSpendMonthly;
    if (isMissing(value)) {
      errors.cloudSpendMonthly = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < cloudSpendMonthly.min) {
        errors.cloudSpendMonthly = `El gasto mínimo es ${formatNumber(cloudSpendMonthly.min)}€/mes`;
      } else if (value > cloudSpendMonthly.max) {
        errors.cloudSpendMonthly =
          `Parece muy alto (>${formatNumber(cloudSpendMonthly.max)}€/mes). Si es correcto, contáctanos para caso específico`;
      }
    }
  }

  if (inputs.pains.includes('manual-processes')) {
    const value = inputs.manualHoursWeekly;
    if (isMissing(value)) {
      errors.manualHoursWeekly = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < manualHoursWeekly.min) {
        errors.manualHoursWeekly = `Introduce al menos ${manualHoursWeekly.min} horas/semana`;
      } else if (value > manualHoursWeekly.max) {
        errors.manualHoursWeekly = `No puede superar ${manualHoursWeekly.max} horas/semana`;
      }
    }
  }

  if (inputs.pains.includes('forecasting')) {
    const value = inputs.forecastErrorPercent;
    if (isMissing(value)) {
      errors.forecastErrorPercent = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < forecastErrorPercent.min) {
        errors.forecastErrorPercent = `El error mínimo es ${forecastErrorPercent.min}%`;
      } else if (value > forecastErrorPercent.max) {
        errors.forecastErrorPercent = `El error máximo razonable es ${forecastErrorPercent.max}%`;
      }
    }
  }

  return errors;
}

export function getCalculatorWarnings(inputs: CalculatorInputs, result: ROISuccess): CalculatorWarning[] {
  const warnings: CalculatorWarning[] = [];
  const thresholds = roiConfig.thresholds;

  if (inputs.pains.includes('cloud-costs') && typeof inputs.cloudSpendMonthly === 'number') {
    const annualCloud = inputs.cloudSpendMonthly * 12;
    const estimatedRevenue = roiConfig.companySizes[inputs.companySize].estimatedRevenue;
    const cloudRatio = annualCloud / estimatedRevenue;
    if (cloudRatio > thresholds.cloudRevenueWarningRatio) {
      warnings.push({
        type: 'cloud-coherence',
        message:
          `⚠️ Gasto cloud alto (>${thresholds.cloudRevenueWarningRatio * 100}% facturación). Si el dato es correcto, perfecto. Si no, corrígelo para un cálculo más preciso.`,
      });
    }
  }

  if (
    inputs.pains.includes('forecasting') &&
    typeof inputs.forecastErrorPercent === 'number' &&
    inputs.forecastErrorPercent > thresholds.forecastWarningThreshold
  ) {
    warnings.push({
      type: 'forecast-coherence',
      message:
        `⚠️ Error de forecast muy alto (>${thresholds.forecastWarningThreshold}%). Corrige el valor si es un error o valida el ROI con datos reales antes de presentarlo.`,
    });
  }

  const roiDisplay = formatRoiWithCap(result.roi3Years);
  if (roiDisplay.isCapped) {
    warnings.push({
      type: 'roi-extreme',
      message:
        '⚠️ ROI extremo (> 1.000%). Este resultado indica una oportunidad muy significativa, pero debe validarse en una consulta personalizada.',
    });
  }

  return warnings;
}

export function shouldCalculateROI(inputs: CalculatorInputs): {
  canCalculate: boolean;
  reason?: ROIFallback['reason'];
  message?: string;
} {
  // 1. Validar inputs básicos (rangos min/max)
  const errors = validateCalculatorInputs(inputs);
  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];
    return {
      canCalculate: false,
      reason: 'invalid_inputs',
      message: `Los datos introducidos no están en rangos válidos: ${firstError}`,
    };
  }

  // 2. Validar coherencia cloud vs revenue
  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const annualCloud = inputs.cloudSpendMonthly * 12;
    const estimatedRevenue = getRevenueFromSize(inputs.companySize);
    const ratio = annualCloud / estimatedRevenue;

    if (ratio > roiConfig.thresholds.maxCloudToRevenueRatio) {
      const cloudInK = Math.round(annualCloud / 1000);
      const maxPercent = roiConfig.thresholds.maxCloudToRevenueRatio * 100;
      return {
        canCalculate: false,
        reason: 'incoherent_scenario',
        message: `Gasto cloud anual (${cloudInK}K€) superior al ${maxPercent}% de la facturación estimada. Este escenario requiere análisis específico.`,
      };
    }
  }

  // 3. Validar forecast extremo (>extremeHigh)
  if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
    const extremeHigh = roiConfig.inputs.forecastErrorPercent.extremeHigh;
    if (inputs.forecastErrorPercent > extremeHigh) {
      return {
        canCalculate: false,
        reason: 'out_of_range',
        message: `Error de forecast demasiado alto (>${extremeHigh}%). Este dato es inusual y requiere validación directa.`,
      };
    }
  }

  return { canCalculate: true };
}
