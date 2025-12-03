import { describe, expect, it } from 'vitest';
import { LeadSchema, getEmailWarnings } from '@/lib/validation/lead-schema';

describe('LeadSchema', () => {
  it('valida payload correcto', () => {
    const result = LeadSchema.safeParse({
      email: 'ceo@empresa.com',
      name: 'Fran',
      companyName: 'Acme',
      sector: 'agencia',
      companySize: '10-25M',
      pains: ['cloud-costs'],
      roiData: {
        investment: 3200,
        savingsAnnual: 35700,
        paybackMonths: 1,
        roi3Years: 3247,
      },
      utmParams: { campaign: 'c1', source: 's', medium: 'm' },
    });
    expect(result.success).toBe(true);
  });

  it('falla con email inválido', () => {
    const result = LeadSchema.safeParse({
      email: 'no-email',
      sector: 'agencia',
      companySize: '10-25M',
      pains: [],
      roiData: { investment: 0, savingsAnnual: 0, paybackMonths: 0, roi3Years: 0 },
    });
    expect(result.success).toBe(false);
  });
});

describe('getEmailWarnings', () => {
  it('detecta disposable', () => {
    expect(getEmailWarnings('test@tempmail.com').isDisposable).toBe(true);
    expect(getEmailWarnings('ceo@empresa.com').isDisposable).toBe(false);
  });
});
