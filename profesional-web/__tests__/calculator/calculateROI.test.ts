import { describe, expect, it } from 'vitest';
import {
  calculateROI,
  formatRoiWithCap,
  getInventoryFromSize,
  getRevenueFromSize,
  getInvestmentForPain,
  INVENTORY_COST_RATE,
  INVENTORY_IMPROVEMENT_RATE,
  INVENTORY_MAX_SAVINGS_RATE,
} from '@/lib/calculator/calculateROI';
import type { CalculatorInputs } from '@/lib/calculator/types';

describe('calculateROI', () => {
  it('mapea revenue e inventario según tamaño de empresa', () => {
    // FJG-94: Ahora usa valores de roiConfig.companySizes
    expect(getRevenueFromSize('5-10M')).toBe(7_500_000);
    expect(getRevenueFromSize('10-25M')).toBe(17_500_000);
    expect(getRevenueFromSize('25-50M')).toBe(35_000_000);
    expect(getRevenueFromSize('50M+')).toBe(60_000_000);

    expect(getInventoryFromSize('5-10M')).toBe(400_000);
    expect(getInventoryFromSize('10-25M')).toBe(800_000);
    expect(getInventoryFromSize('25-50M')).toBe(1_500_000);
    expect(getInventoryFromSize('50M+')).toBe(3_000_000);
  });

  it('ajusta inversión base + multiplicador por tamaño', () => {
    // FJG-94: Ahora usa baseInvestment * investmentMultiplier de roiConfig
    // cloud: 15,000 * 1.3 = 19,500
    expect(getInvestmentForPain('cloud-costs', '10-25M')).toBe(19_500);
    // manual: 12,000 * 1.6 = 19,200
    expect(getInvestmentForPain('manual-processes', '25-50M')).toBe(19_200);
    // forecast: 25,000 * 2.0 = 50,000
    expect(getInvestmentForPain('forecasting', '50M+')).toBe(50_000);
    // inventory: 20,000 * 1.0 = 20,000
    expect(getInvestmentForPain('inventory', '5-10M')).toBe(20_000);
  });

  it('calcula escenario cloud según Linear', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'agencia',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 8500,
    };

    const result = calculateROI(inputs);

    // FJG-94: Ahorro anual sin cambios: 8,500 * 12 * 0.275 = 28,050€
    expect(result.savingsAnnual).toBe(28_050);
    // FJG-94: Inversión nueva: 15,000 * 1.3 = 19,500€
    expect(result.investment).toBe(19_500);
    // FJG-94: Payback: (19,500 / 28,050) * 12 ≈ 8 meses
    expect(result.paybackMonths).toBe(8);
    // FJG-94: ROI 3y: ((28,050 * 3 - 19,500) / 19,500) * 100 ≈ 332%
    expect(result.roi3Years).toBe(332);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('332%');
    expect(roiFormatted.isCapped).toBe(false);
  });

  it('calcula escenario procesos manuales', () => {
    const inputs: CalculatorInputs = {
      companySize: '25-50M',
      sector: 'industrial',
      pains: ['manual-processes'],
      manualHoursWeekly: 20,
    };

    const result = calculateROI(inputs);

    // FJG-94: Ahorro sin cambios: 20 * 52 * 25 * 0.5 = 13,000€
    expect(result.savingsAnnual).toBe(13_000);
    // FJG-94: Inversión nueva: 12,000 * 1.6 = 19,200€
    expect(result.investment).toBe(19_200);
    // FJG-94: Payback: (19,200 / 13,000) * 12 ≈ 18 meses
    expect(result.paybackMonths).toBe(18);
    // FJG-94: ROI 3y: ((13,000 * 3 - 19,200) / 19,200) * 100 ≈ 103%
    expect(result.roi3Years).toBe(103);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('103%');
    expect(roiFormatted.isCapped).toBe(false);
  });

  it('calcula forecasting usando revenue por tamaño y supuestos prudentes', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['forecasting'],
      forecastErrorPercent: 20,
    };

    const result = calculateROI(inputs);

    // FJG-94: Ahorro sin cambios: 17,500,000 * 0.05 * 0.20 * 0.35 = 61,250€
    expect(result.savingsAnnual).toBe(61_250);
    // FJG-94: Inversión nueva: 25,000 * 1.3 = 32,500€
    expect(result.investment).toBe(32_500);
    // FJG-94: Payback: (32,500 / 61,250) * 12 ≈ 6 meses
    expect(result.paybackMonths).toBe(6);
    // FJG-94: ROI 3y: ((61,250 * 3 - 32,500) / 32,500) * 100 ≈ 465%
    expect(result.roi3Years).toBe(465);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('465%');
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

    // FJG-94: Ahorro sin cambios: 19,800 + 9,750 = 29,550€
    expect(result.savingsAnnual).toBe(29_550);
    // FJG-94: Inversión nueva: 15,000 + 12,000 = 27,000€
    expect(result.investment).toBe(27_000);
    // FJG-94: Payback: (27,000 / 29,550) * 12 ≈ 11 meses
    expect(result.paybackMonths).toBe(11);
    // FJG-94: ROI 3y: ((29,550 * 3 - 27,000) / 27,000) * 100 ≈ 228%
    expect(result.roi3Years).toBe(228);
    const roiFormatted = formatRoiWithCap(result.roi3Years);
    expect(roiFormatted.label).toBe('228%');
    expect(roiFormatted.isCapped).toBe(false);
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

  it('calcula inventory con supuestos conservadores y flag sin cap', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['inventory'],
    };

    const result = calculateROI(inputs);

    // FJG-94: Inventory 10-25M ahora es 800,000€ (antes 1,200,000€)
    const inventoryValue = getInventoryFromSize('10-25M');
    const expectedSavings = inventoryValue * INVENTORY_COST_RATE * INVENTORY_IMPROVEMENT_RATE;
    expect(result.savingsAnnual).toBe(expectedSavings); // 800,000 * 0.1 * 0.3 = 24,000€
    // FJG-94: Inversión nueva: 20,000 * 1.3 = 26,000€
    expect(result.investment).toBe(26_000);
    // FJG-94: Payback: (26,000 / 24,000) * 12 ≈ 13 meses
    expect(result.paybackMonths).toBe(13);
    // FJG-94: ROI 3y: ((24,000 * 3 - 26,000) / 26,000) * 100 ≈ 177%
    expect(result.roi3Years).toBe(177);
    expect(result.inventorySavingsCapped).toBe(false);
  });

  it('cappea ahorro de inventory cuando supera umbral extremo', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['inventory'],
    };

    const result = calculateROI(inputs, {
      inventoryOverrides: {
        costRate: 0.9,
        improvementRate: 0.95,
        maxSavingsRate: INVENTORY_MAX_SAVINGS_RATE,
      },
    });

    // FJG-94: Inventory 5-10M ahora es 400,000€ (antes 500,000€)
    const rawSavings = getInventoryFromSize('5-10M') * 0.9 * 0.95;
    const maxSavings = getInventoryFromSize('5-10M') * INVENTORY_MAX_SAVINGS_RATE;
    expect(rawSavings).toBeGreaterThan(maxSavings);
    expect(result.savingsAnnual).toBe(maxSavings); // 400,000 * 0.8 = 320,000€
    // FJG-94: Inversión nueva: 20,000 * 1.0 = 20,000€
    expect(result.investment).toBe(20_000);
    expect(result.inventorySavingsCapped).toBe(true);
  });
});
