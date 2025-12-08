import { describe, expect, it } from 'vitest';
import { calculateROI } from '@/lib/calculator/calculateROI';
import { roiConfig } from '@/components/calculator/calculatorConfig';
import { getCalculatorWarnings, validateCalculatorInputs } from '@/lib/calculator/validation';
import type { CalculatorInputs } from '@/lib/calculator/types';
import { isROISuccess } from '@/lib/calculator/types';

describe('validateCalculatorInputs', () => {
  const baseInputs: CalculatorInputs = {
    companySize: '10-25M',
    sector: 'agencia',
    pains: [],
  };

  it('valida gasto cloud fuera de rango', () => {
    const errorsLow = validateCalculatorInputs({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: roiConfig.inputs.cloudSpendMonthly.min - 100,
    });
    expect(errorsLow.cloudSpendMonthly).toContain(
      roiConfig.inputs.cloudSpendMonthly.min.toString()
    );

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: roiConfig.inputs.cloudSpendMonthly.max * 2,
    });
    expect(errorsHigh.cloudSpendMonthly).toContain(
      roiConfig.inputs.cloudSpendMonthly.max.toLocaleString('es-ES')
    );

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: roiConfig.inputs.cloudSpendMonthly.min + 500,
    });
    expect(noErrors.cloudSpendMonthly).toBeUndefined();
  });

  it('valida horas manuales fuera de rango', () => {
    const errorsLow = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: roiConfig.inputs.manualHoursWeekly.min - 1,
    });
    expect(errorsLow.manualHoursWeekly).toContain(
      roiConfig.inputs.manualHoursWeekly.min.toString()
    );

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: roiConfig.inputs.manualHoursWeekly.max + 10,
    });
    expect(errorsHigh.manualHoursWeekly).toContain(
      roiConfig.inputs.manualHoursWeekly.max.toString()
    );

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: roiConfig.inputs.manualHoursWeekly.min + 10,
    });
    expect(noErrors.manualHoursWeekly).toBeUndefined();
  });

  it('valida error de forecast fuera de rango', () => {
    const errorsLow = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.inputs.forecastErrorPercent.min - 1,
    });
    expect(errorsLow.forecastErrorPercent).toContain(
      roiConfig.inputs.forecastErrorPercent.min.toString()
    );

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.inputs.forecastErrorPercent.max + 20,
    });
    expect(errorsHigh.forecastErrorPercent).toContain(
      roiConfig.inputs.forecastErrorPercent.max.toString()
    );

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.inputs.forecastErrorPercent.min + 10,
    });
    expect(noErrors.forecastErrorPercent).toBeUndefined();
  });
});

describe('getCalculatorWarnings', () => {
  it('muestra warning cuando el gasto cloud supera 15% de la facturación estimada en compañías pequeñas', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['cloud-costs'],
      // 150K€ supera el max de 100K€, así que usamos 15K€ mensual
      // 15K * 12 = 180K€ anual vs revenue 7.5M = 2.4% < 15% (cloudRevenueWarningRatio)
      // Necesitamos un valor más alto. Usamos 12K€ mensual
      // 12K * 12 = 144K€ vs 7.5M = 1.9% < 15%
      // Vamos con 15K: 15K * 12 = 180K vs 7.5M = 2.4% > 15% (SÍ!)
      cloudSpendMonthly: 15_000, // Genera warning si >15% revenue (144K > 7.5M * 0.15 = 1.125M NO)
      // Necesito 7.5M * 0.15 / 12 = 93,750€/mes para superar el threshold
      // Pero eso está dentro del rango. Vamos a usar 95K
    };
    inputs.cloudSpendMonthly = 95_000; // 95K * 12 = 1.14M > 7.5M * 0.15 = 1.125M (SÍ, apenas)
    const result = calculateROI(inputs);
    if (!isROISuccess(result)) throw new Error('Expected success result');

    const warnings = getCalculatorWarnings(inputs, result);
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(true);
  });

  it('no muestra warning cloud alto en compañías grandes con gasto similar', () => {
    const inputs: CalculatorInputs = {
      companySize: '50M+',
      sector: 'retail',
      pains: ['cloud-costs'],
      // 150K€ supera el max de 100K€, usamos 95K€ (mismo que el test anterior)
      // 95K * 12 = 1.14M vs revenue 60M = 1.9% < 15% (no genera warning)
      cloudSpendMonthly: 95_000,
    };
    const result = calculateROI(inputs);
    if (!isROISuccess(result)) throw new Error('Expected success result');

    const warnings = getCalculatorWarnings(inputs, result);
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(false);
  });

  it('avisa cuando el error de forecast es muy alto (>50%)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.thresholds.forecastWarningThreshold + 5,
    };
    const result = calculateROI(inputs);
    if (!isROISuccess(result)) throw new Error('Expected success result');

    const warnings = getCalculatorWarnings(inputs, result);
    expect(warnings.some((warning) => warning.type === 'forecast-coherence')).toBe(true);
  });

  it('NO marca warning roi-extreme con gastos altos gracias a cálculos conservadores (FJG-85)', () => {
    // FJG-85: Con el nuevo modelo conservador (savings rate 10%, investment escalado),
    // gastos cloud altos ya NO generan ROI >1000%
    // Con cloud 50K€/mes en empresa 50M+:
    // Ahorro: 50,000 * 12 * 0.10 = 60,000€ (rate 10% para gastos >50K)
    // Inversión: 15,000 * 2.0 * 5 = 150,000€ (spendFactor = min(50K/10K, 5) = 5)
    // ROI 3y: ((60,000 * 3 - 150,000) / 150,000) * 100 = 20% << 1,000% ✓
    const inputs: CalculatorInputs = {
      companySize: '50M+',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 50000,
    };
    const result = calculateROI(inputs);
    if (!isROISuccess(result)) throw new Error('Expected success result');

    const warnings = getCalculatorWarnings(inputs, result);
    // Con el modelo conservador, este escenario ya NO genera warning de ROI extremo
    expect(warnings.some((warning) => warning.type === 'roi-extreme')).toBe(false);
    // Verificar que el ROI es razonable (<100%)
    expect(result.roi3Years).toBeLessThan(100);
  });
});
