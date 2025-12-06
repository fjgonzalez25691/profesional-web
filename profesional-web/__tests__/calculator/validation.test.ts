import { describe, expect, it } from 'vitest';
import { calculateROI } from '@/lib/calculator/calculateROI';
import { roiConfig } from '@/components/calculator/calculatorConfig';
import { getCalculatorWarnings, validateCalculatorInputs } from '@/lib/calculator/validation';
import type { CalculatorInputs } from '@/lib/calculator/types';

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
  it('muestra warning cuando el gasto cloud supera 20% de la facturación estimada en compañías pequeñas', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 150000,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(true);
  });

  it('no muestra warning cloud alto en compañías grandes con gasto similar', () => {
    const inputs: CalculatorInputs = {
      companySize: '50M+',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 150000,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'cloud-coherence')).toBe(false);
  });

  it('avisa cuando el error de forecast es muy alto (>50%)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['forecasting'],
      forecastErrorPercent: roiConfig.thresholds.forecastWarningThreshold + 5,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'forecast-coherence')).toBe(true);
  });

  it('marca avisos cuando el ROI está cappeado en > 1.000%', () => {
    // FJG-94: Necesitamos un escenario con ROI > 1000%
    // Con cloud 50K€/mes en empresa 50M+:
    // Ahorro: 50,000 * 12 * 0.275 = 165,000€
    // Inversión: 15,000 * 2.0 = 30,000€
    // ROI 3y: ((165,000 * 3 - 30,000) / 30,000) * 100 = 1,550% > 1,000%
    const inputs: CalculatorInputs = {
      companySize: '50M+',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 50000,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'roi-extreme')).toBe(true);
  });
});
