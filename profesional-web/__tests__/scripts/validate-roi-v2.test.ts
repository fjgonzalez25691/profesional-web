import { describe, expect, it } from 'vitest';
import { roiConfig } from '@/components/calculator/calculatorConfig';
import { buildValidationReport } from '@/scripts/validate-roi-v2';

describe('FJG-94 – validate-roi-v2', () => {
  const report = buildValidationReport();

  it('genera al menos 1000 combinaciones y summary consistente', () => {
    expect(report.validations.length).toBeGreaterThanOrEqual(1000);
    expect(report.summary.totalTests).toBe(report.validations.length);
    expect(report.summary.passedTests + report.summary.failedTests).toBe(report.summary.totalTests);
  });

  it('usa thresholds de config y marca flags críticos', () => {
    expect(report.metadata.thresholds.minPaybackMonths).toBe(roiConfig.thresholds.minPaybackMonths);
    expect(report.metadata.thresholds.maxCloudToRevenueRatio).toBe(
      roiConfig.thresholds.maxCloudToRevenueRatio
    );
    expect(report.metadata.thresholds.roiCapPercent).toBeDefined();

    expect(report.summary.flags.roi_cap).toBeGreaterThan(0);
    expect(report.summary.flags.payback_below_min).toBeGreaterThan(0);
  });

  it('identifica escenarios extremos incluyendo ahorro sobre inventario', () => {
    expect(report.extremes.length).toBeGreaterThan(0);
    const hasInventoryExtreme = report.extremes.some((c) =>
      c.flags.includes('savings_over_inventory')
    );
    expect(hasInventoryExtreme).toBe(true);
  });
});
