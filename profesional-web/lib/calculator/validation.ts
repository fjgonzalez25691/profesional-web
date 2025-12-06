import { formatRoiWithCap, getRevenueFromSize } from './calculateROI';
import type { CalculatorInputs, CalculatorWarning, ROIResult } from './types';

export type CalculatorInputErrors = Partial<
  Record<'cloudSpendMonthly' | 'manualHoursWeekly' | 'forecastErrorPercent', string>
>;

const CLOUD_MIN = 100;
const CLOUD_MAX = 500_000;
const MANUAL_MIN = 1;
const MANUAL_MAX = 168;
const FORECAST_MIN = 1;
const FORECAST_MAX = 100;
const CLOUD_REVENUE_WARNING_RATIO = 0.2;
const FORECAST_WARNING_THRESHOLD = 50;

const isMissing = (value: number | undefined) => value === undefined || Number.isNaN(value);

export function validateCalculatorInputs(inputs: CalculatorInputs): CalculatorInputErrors {
  const errors: CalculatorInputErrors = {};

  if (inputs.pains.includes('cloud-costs')) {
    const value = inputs.cloudSpendMonthly;
    if (isMissing(value)) {
      errors.cloudSpendMonthly = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < CLOUD_MIN) {
        errors.cloudSpendMonthly = 'El gasto mínimo es 100€/mes';
      } else if (value > CLOUD_MAX) {
        errors.cloudSpendMonthly =
          'Parece muy alto (>500K€/mes). Si es correcto, contáctanos para caso específico';
      }
    }
  }

  if (inputs.pains.includes('manual-processes')) {
    const value = inputs.manualHoursWeekly;
    if (isMissing(value)) {
      errors.manualHoursWeekly = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < MANUAL_MIN) {
        errors.manualHoursWeekly = 'Introduce al menos 1 hora/semana';
      } else if (value > MANUAL_MAX) {
        errors.manualHoursWeekly = 'Una semana tiene 168 horas máximo';
      }
    }
  }

  if (inputs.pains.includes('forecasting')) {
    const value = inputs.forecastErrorPercent;
    if (isMissing(value)) {
      errors.forecastErrorPercent = 'Campo requerido';
    } else if (typeof value === 'number') {
      if (value < FORECAST_MIN) {
        errors.forecastErrorPercent = 'El error mínimo es 1%';
      } else if (value > FORECAST_MAX) {
        errors.forecastErrorPercent = 'El error máximo razonable es 100%';
      }
    }
  }

  return errors;
}

export function getCalculatorWarnings(inputs: CalculatorInputs, result: ROIResult): CalculatorWarning[] {
  const warnings: CalculatorWarning[] = [];

  if (inputs.pains.includes('cloud-costs') && typeof inputs.cloudSpendMonthly === 'number') {
    const annualCloud = inputs.cloudSpendMonthly * 12;
    const estimatedRevenue = getRevenueFromSize(inputs.companySize);
    const cloudRatio = annualCloud / estimatedRevenue;
    if (cloudRatio > CLOUD_REVENUE_WARNING_RATIO) {
      warnings.push({
        type: 'cloud-coherence',
        message:
          '⚠️ Gasto cloud alto (>20% facturación). Si el dato es correcto, perfecto. Si no, corrígelo para un cálculo más preciso.',
      });
    }
  }

  if (
    inputs.pains.includes('forecasting') &&
    typeof inputs.forecastErrorPercent === 'number' &&
    inputs.forecastErrorPercent > FORECAST_WARNING_THRESHOLD
  ) {
    warnings.push({
      type: 'forecast-coherence',
      message:
        '⚠️ Error de forecast muy alto (>50%). Corrige el valor si es un error o valida el ROI con datos reales antes de presentarlo.',
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
