import { afterEach, describe, expect, it, vi } from 'vitest';

const mockSql = vi.fn();
const mockSend = vi.fn();

vi.mock('@vercel/postgres', () => ({
  sql: (...args: unknown[]) => mockSql(...args),
}));

vi.mock('@/lib/email/nurturing', () => ({
  sendNurturingEmail: (...args: unknown[]) => mockSend(...args),
}));

const makeLead = (id: string, stage: number) => ({
  id,
  email: `${id}@acme.com`,
  name: 'Lead',
  savings_annual: 12000,
  payback_months: 3,
  calendly_link: 'https://cal.com/fjg',
  calendly_booked: false,
  nurturing_stage: stage,
});

describe('GET /api/cron/nurturing', () => {
  afterEach(() => {
    mockSql.mockReset();
    mockSend.mockReset();
  });

  it('devuelve 401 si falta autorización', async () => {
    const { GET } = await import('@/app/api/cron/nurturing/route');
    const res = await GET(new Request('http://localhost/api/cron/nurturing'));
    expect(res.status).toBe(401);
  });

  it('envía emails day1 y day3 y actualiza etapas', async () => {
    process.env.CRON_SECRET = 'secret';

    mockSql.mockImplementationOnce(async () => ({
      rowCount: 1,
      rows: [makeLead('lead-1', 0)],
    }));

    mockSql.mockImplementationOnce(async () => ({ rowCount: 1, rows: [] })); // update day1

    mockSql.mockImplementationOnce(async () => ({
      rowCount: 1,
      rows: [makeLead('lead-2', 1)],
    }));

    mockSql.mockImplementationOnce(async () => ({ rowCount: 1, rows: [] })); // update day3

    const { GET } = await import('@/app/api/cron/nurturing/route');
    const res = await GET(
      new Request('http://localhost/api/cron/nurturing', {
        headers: { authorization: 'Bearer secret' },
      }),
    );

    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend.mock.calls[0][1]).toBe('day1');
    expect(mockSend.mock.calls[1][1]).toBe('day3');

    // update queries executed
    expect(mockSql).toHaveBeenCalledTimes(4);
  });
});
