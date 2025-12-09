import { describe, it } from 'vitest';
import { calculateROI } from '@/lib/calculator/calculateROI';
import type { CalculatorInputs } from '@/lib/calculator/types';

describe('Debug final', () => {
  it('3 pains, empresa grande, gastos moderados', () => {
    const inputs: CalculatorInputs = {
      companySize: '25-50M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting'],
      cloudSpendMonthly: 8_000,
      manualHoursWeekly: 15,
      forecastErrorPercent: 35,
    };
    const result = calculateROI(inputs);
    console.log('ROI:', result);
  });
});
