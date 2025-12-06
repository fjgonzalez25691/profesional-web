import { roiConfig } from '@/components/calculator/calculatorConfig';

describe('FJG-94 – calculatorConfig.ts debe incluir thresholds de validación', () => {
  test('debe tener cloudRevenueWarningRatio definido', () => {
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeDefined();
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeGreaterThan(0);
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeLessThan(1);
  });

  test('debe tener forecastWarningThreshold definido', () => {
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeDefined();
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeGreaterThan(0);
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeLessThanOrEqual(100);
  });
});