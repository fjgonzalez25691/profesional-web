import { describe, it, expect } from 'vitest';
import { CASOS_MVP, CASOS_VISIBLES } from '@/data/cases';

describe('cases data', () => {
  it('has exactly 5 visible cases', () => {
    expect(CASOS_VISIBLES).toHaveLength(5);
  });

  it('has additional internal cases for chatbot', () => {
    const total = CASOS_MVP.length;
    const internal = total - CASOS_VISIBLES.length;
    expect(total).toBeGreaterThanOrEqual(8);
    expect(internal).toBeGreaterThanOrEqual(3);
  });

  it('includes required visible sectors', () => {
    const sectors = CASOS_VISIBLES.map((c) => c.sector.toLowerCase());
    expect(sectors.some((s) => s.includes('farmacéutica'))).toBe(true);
    expect(sectors.some((s) => s.includes('retail'))).toBe(true);
  });

  it('includes diverse sectors in internal cases', () => {
    const internalSectors = CASOS_MVP.filter((c) => !c.visible).map((c) => c.sector.toLowerCase());
    expect(internalSectors.some((s) => s.includes('restauración'))).toBe(true);
    expect(internalSectors.some((s) => s.includes('clínicas'))).toBe(true);
    expect(internalSectors.some((s) => s.includes('servicios'))).toBe(true);
  });

  it('has valid ROI-ish metrics', () => {
    CASOS_MVP.forEach((caso) => {
      if (caso.investment && caso.savings_annual) {
        expect(caso.investment).toBeGreaterThan(0);
        expect(caso.savings_annual).toBeGreaterThan(0);
        expect(caso.payback_weeks).toBeGreaterThan(0);
        expect(caso.payback_weeks).toBeLessThan(52);
      }
    });
  });
});
