// TODO: FJG-97 - Descomentar cuando se implemente generate-random-roi-scenarios.ts
/*
import { describe, expect, it } from 'vitest';
import {
  buildRandomDataset,
  calculateROINumerically,
  generateRandomScenario,
  toCsv,
} from '@/scripts/generate-random-roi-scenarios';

describe('generateRandomScenario', () => {
  it('genera siempre al menos un dolor con datos en rango', () => {
    for (let i = 0; i < 20; i += 1) {
      const scenario = generateRandomScenario();
      expect(scenario.pains.length).toBeGreaterThanOrEqual(1);
      expect(scenario.companySize).toBeDefined();
      expect(scenario.sector).toBeDefined();

      if (scenario.pains.includes('cloud-costs')) {
        expect(scenario.cloudSpendMonthly).toBeGreaterThanOrEqual(500);
        expect(scenario.cloudSpendMonthly).toBeLessThanOrEqual(100_000);
      }

      if (scenario.pains.includes('manual-processes')) {
        expect(scenario.manualHoursWeekly).toBeGreaterThanOrEqual(5);
        expect(scenario.manualHoursWeekly).toBeLessThanOrEqual(200);
      }

      if (scenario.pains.includes('forecasting')) {
        expect(scenario.forecastErrorPercent).toBeGreaterThanOrEqual(5);
        expect(scenario.forecastErrorPercent).toBeLessThanOrEqual(60);
      }
    }
  });
});

describe('calculateROINumerically', () => {
  it('devuelve siempre valores numéricos sin fallback', () => {
    const scenario = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting'],
      cloudSpendMonthly: 10_000,
      manualHoursWeekly: 40,
      forecastErrorPercent: 25,
    } as const;

    const result = calculateROINumerically(scenario);

    expect(result.investment).toBeGreaterThan(0);
    expect(result.savingsAnnual).toBeGreaterThan(0);
    expect(result.paybackMonths).toBeGreaterThan(0);
    expect(Number.isNaN(result.roi3Years)).toBe(false);
  });
});

describe('buildRandomDataset y toCsv', () => {
  it('genera dataset con el número solicitado de filas', () => {
    const { rows, dateStamp } = buildRandomDataset(25, new Date('2025-12-08T10:00:00Z'));
    expect(rows).toHaveLength(25);
    expect(dateStamp).toBe('20251208');
    rows.forEach((row: any, index: number) => {
      expect(row.scenarioId).toBe(index + 1);
      expect(Number.isNaN(row.roi3Years)).toBe(false);
    });
  });

  it('exporta CSV con header y filas correspondientes', () => {
    const { rows } = buildRandomDataset(3, new Date('2025-12-08T10:00:00Z'));
    const csv = toCsv(rows);
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(4); // header + 3 filas
    expect(lines[0]).toContain('scenario_id');
  });
});
*/

// Test placeholder para evitar errores de tipado hasta implementación FJG-97
import { describe, it } from 'vitest';

describe('generate-random-roi (placeholder)', () => {
  it('pendiente de implementación FJG-97', () => {
    // Test vacío hasta que se implemente el script
  });
});
