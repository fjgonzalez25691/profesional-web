import { describe, expect, it } from 'vitest';
import { calculateROI } from '@/lib/calculator/calculateROI';
import type { CalculatorInputs } from '@/lib/calculator/types';

describe('calculateROI', () => {
  it('calcula escenario cloud según Linear', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 8500,
    };

    const result = calculateROI(inputs);

    expect(result.savingsAnnual).toBe(35700);
    expect(result.investment).toBe(3200);
    expect(result.paybackMonths).toBe(1);
    expect(result.roi3Years).toBe(3247);
  });

  it('calcula escenario procesos manuales', () => {
    const inputs: CalculatorInputs = {
      companySize: '25-50M',
      sector: 'industrial',
      pains: ['manual-processes'],
      manualHoursWeekly: 20,
    };

    const result = calculateROI(inputs);

    expect(result.savingsAnnual).toBe(18200);
    expect(result.investment).toBe(4800);
    expect(result.paybackMonths).toBe(3);
    expect(result.roi3Years).toBe(1038);
  });

  it('combina múltiples dolores', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes'],
      cloudSpendMonthly: 6000,
      manualHoursWeekly: 15,
    };

    const result = calculateROI(inputs);

    expect(result.savingsAnnual).toBe(38850);
    expect(result.investment).toBe(8000);
    expect(result.paybackMonths).toBe(2);
    expect(result.roi3Years).toBe(1357);
  });

  it('gestiona entradas sin ahorros sin devolver NaN', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: [],
    };

    const result = calculateROI(inputs);

    expect(result.savingsAnnual).toBe(0);
    expect(result.investment).toBe(0);
    expect(result.paybackMonths).toBe(0);
    expect(result.roi3Years).toBe(0);
  });
});
