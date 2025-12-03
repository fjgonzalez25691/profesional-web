import { describe, expect, it, vi } from 'vitest';

const mockNeonClient = vi.fn();

vi.mock('@/lib/db', () => ({
  getNeonClient: () => mockNeonClient,
}));

describe('getLeads', () => {
  it('retorna leads parseados y ordenados', async () => {
    mockNeonClient.mockResolvedValue([
      {
        id: '1',
        email: 'a@a.com',
        name: 'A',
        sector: 'agencia',
        company_size: '10-25M',
        roi_data: { savingsAnnual: 1000, paybackMonths: 2, roi3Years: 500 },
        nurturing_stage: 0,
        calendly_booked: false,
        created_at: '2024-01-01',
      },
    ]);

    const { getLeads } = await import('@/lib/admin/get-leads');
    const leads = await getLeads();

    expect(leads).toHaveLength(1);
    expect(leads[0].email).toBe('a@a.com');
  });
});
