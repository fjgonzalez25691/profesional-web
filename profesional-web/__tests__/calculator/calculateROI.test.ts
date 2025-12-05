import { describe, expect, it } from 'vitest';
import {
  ROI_CAP_PERCENT,
  calculateROI,
  formatRoiWithCap,
  getInventoryFromSize,
  getRevenueFromSize,
  getInvestmentForPain,
} from '@/lib/calculator/calculateROI';
import type { CalculatorInputs } from '@/lib/calculator/types';

describe('calculateROI', () => {
  it('mapea revenue e inventario según tamaño de empresa', () => {
    expect(getRevenueFromSize('5-10M')).toBe(8000000);
    expect(getRevenueFromSize('10-25M')).toBe(17500000);
    expect(getRevenueFromSize('25-50M')).toBe(35000000);
    expect(getRevenueFromSize('50M+')).toBe(60000000);

    expect(getInventoryFromSize('5-10M')).toBe(500000);
    expect(getInventoryFromSize('10-25M')).toBe(1200000);
    expect(getInventoryFromSize('25-50M')).toBe(3000000);
    expect(getInventoryFromSize('50M+')).toBe(6000000);
  });

  it('ajusta inversión base + multiplicador por tamaño', () => {
    expect(getInvestmentForPain('cloud-costs', '10-25M')).toBe(3220);
    expect(getInvestmentForPain('manual-processes', '25-50M')).toBe(5200);
    expect(getInvestmentForPain('forecasting', '50M+')).toBe(7000);
    expect(getInvestmentForPain('inventory', '5-10M')).toBe(5600);
  });

  it('calcula escenario cloud según Linear', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 8500,
    };

    const result = calculateROI(inputs);

    expect(result.savingsAnnual).toBe(35700);
    expect(result.investment).toBe(3220);
    expect(result.paybackMonths).toBe(1);
    expect(result.roi3Years).toBe(3226);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('> 1.000%');
    expect(roiFormatted.isCapped).toBe(true);
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
    expect(result.investment).toBe(5200);
    expect(result.paybackMonths).toBe(3);
    expect(result.roi3Years).toBe(950);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('950%');
    expect(roiFormatted.isCapped).toBe(false);
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
    expect(result.investment).toBe(7700);
    expect(result.paybackMonths).toBe(2);
    expect(result.roi3Years).toBe(1414);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('> 1.000%');
    expect(roiFormatted.isCapped).toBe(true);
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
