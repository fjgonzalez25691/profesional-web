import { describe, expect, it } from 'vitest';
import { roiConfig } from '@/components/calculator/calculatorConfig';
import { getCalculatorWarnings, shouldCalculateROI, validateCalculatorInputs } from '@/lib/calculator/validation';
import type { CalculatorInputs, ROISuccess } from '@/lib/calculator/types';

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

describe('shouldCalculateROI - multi pain', () => {
  const baseInputs: CalculatorInputs = {
    companySize: '10-25M',
    sector: 'retail',
    pains: [],
  };

  it('permite el cálculo con un solo dolor', () => {
    const result = shouldCalculateROI({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: 5000,
    });

    expect(result.canCalculate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('bloquea el cálculo con dos dolores y devuelve fallback multi_pain', () => {
    const result = shouldCalculateROI({
      ...baseInputs,
      pains: ['cloud-costs', 'manual-processes'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
    });

    expect(result.canCalculate).toBe(false);
    expect(result.reason).toBe('multi_pain');
    expect(result.message).toMatch(/varios dolores|varios problemas/i);
  });

  it('bloquea el cálculo con tres dolores aunque los datos sean válidos', () => {
    const result = shouldCalculateROI({
      ...baseInputs,
      pains: ['cloud-costs', 'manual-processes', 'forecasting'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 20,
      forecastErrorPercent: 15,
    });

    expect(result.canCalculate).toBe(false);
    expect(result.reason).toBe('multi_pain');
  });
});

describe('getCalculatorWarnings', () => {
  const successResult: ROISuccess = {
    type: 'success',
    investment: 100_000,
    savingsAnnual: 80_000,
    paybackMonths: 15,
    roi3Years: 140,
  };

  it('muestra warning cuando el gasto cloud supera 15% de la facturación estimada', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 100_000, // >15% del revenue estimado (7.5M)
    };

    const warnings = getCalculatorWarnings(inputs, successResult);
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(true);
  });

  it('no muestra warning cloud alto en compañías grandes con gasto similar', () => {
    const inputs: CalculatorInputs = {
      companySize: '50M+',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 15_000, // 180K anual vs 60M = 0.3% (muy bajo, no warning)
    };

    const warnings = getCalculatorWarnings(inputs, successResult);
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(false);
  });

  it('avisa cuando el error de forecast es muy alto (>50%)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.thresholds.forecastWarningThreshold + 5, // 55%
    };

    const warnings = getCalculatorWarnings(inputs, successResult);
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
      cloudSpendMonthly: 50_000,
    };

    const cappedResult: ROISuccess = {
      ...successResult,
      roi3Years: 60,
    };

    const warnings = getCalculatorWarnings(inputs, cappedResult);
    expect(warnings.some((warning) => warning.type === 'roi-extreme')).toBe(false);
  });
});
