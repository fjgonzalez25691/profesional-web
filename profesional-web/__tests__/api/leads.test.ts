import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockSql = vi.fn();

vi.mock('@vercel/postgres', () => ({
  sql: (...args: unknown[]) => mockSql(...args),
}));

describe('POST /api/leads', () => {
  beforeEach(() => {
    mockSql.mockReset();
    mockSql.mockResolvedValue({ rows: [{ id: 'lead-1' }] });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('guarda lead válido y retorna leadId', async () => {
    const { POST } = await import('@/app/api/leads/route');
    const res = await POST(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          email: 'ceo@empresa.com',
          sector: 'agencia',
          companySize: '10-25M',
          pains: ['cloud-costs'],
          roiData: { investment: 3220, savingsAnnual: 35700, paybackMonths: 1, roi3Years: 3226 },
        }),
      }),
    );

    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.leadId).toBe('lead-1');
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it('retorna 400 si validación falla', async () => {
    const { POST } = await import('@/app/api/leads/route');
    const res = await POST(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid' }),
      }),
    );

    expect(res.status).toBe(400);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it('maneja error de inserción con 500', async () => {
    mockSql.mockRejectedValueOnce(new Error('db down'));
    const { POST } = await import('@/app/api/leads/route');
    const res = await POST(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          email: 'ceo@empresa.com',
          sector: 'agencia',
          companySize: '10-25M',
          pains: ['cloud-costs'],
          roiData: { investment: 3220, savingsAnnual: 35700, paybackMonths: 1, roi3Years: 3226 },
        }),
      }),
    );

    expect(res.status).toBe(500);
  });
});
