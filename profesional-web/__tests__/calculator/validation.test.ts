import { describe, expect, it } from 'vitest';
import { calculateROI } from '@/lib/calculator/calculateROI';
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
      cloudSpendMonthly: 50,
    });
    expect(errorsLow.cloudSpendMonthly).toBe('El gasto mínimo es 100€/mes');

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: 800000,
    });
    expect(errorsHigh.cloudSpendMonthly).toBe('¿Más de 500K€/mes? Verifica el dato');

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['cloud-costs'],
      cloudSpendMonthly: 5000,
    });
    expect(noErrors.cloudSpendMonthly).toBeUndefined();
  });

  it('valida horas manuales fuera de rango', () => {
    const errorsLow = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: 0,
    });
    expect(errorsLow.manualHoursWeekly).toBe('Introduce al menos 1 hora/semana');

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: 200,
    });
    expect(errorsHigh.manualHoursWeekly).toBe('Una semana tiene 168 horas máximo');

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['manual-processes'],
      manualHoursWeekly: 40,
    });
    expect(noErrors.manualHoursWeekly).toBeUndefined();
  });

  it('valida error de forecast fuera de rango', () => {
    const errorsLow = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: 0.5,
    });
    expect(errorsLow.forecastErrorPercent).toBe('El error mínimo es 1%');

    const errorsHigh = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: 150,
    });
    expect(errorsHigh.forecastErrorPercent).toBe('El error máximo razonable es 100%');

    const noErrors = validateCalculatorInputs({
      ...baseInputs,
      pains: ['forecasting'],
      forecastErrorPercent: 20,
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
      forecastErrorPercent: 80,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'forecast-coherence')).toBe(true);
  });

  it('marca avisos cuando el ROI está cappeado en > 1.000%', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 8500,
    };
    const warnings = getCalculatorWarnings(inputs, calculateROI(inputs));
    expect(warnings.some((warning) => warning.type === 'roi-extreme')).toBe(true);
  });
});
