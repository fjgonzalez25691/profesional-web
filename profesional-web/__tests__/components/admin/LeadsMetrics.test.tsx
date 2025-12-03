import { render, screen } from '@testing-library/react';
import { LeadsMetrics } from '@/components/admin/LeadsMetrics';
import type { LeadRecord } from '@/lib/admin/get-leads';

const baseLead: LeadRecord = {
  id: '1',
  email: 'a@a.com',
  name: 'A',
  sector: 'agencia',
  company_size: '10-25M',
  roi_data: { savingsAnnual: 1000, paybackMonths: 2, roi3Years: 100 },
  nurturing_stage: 0,
  calendly_booked: false,
  created_at: '2024-01-01',
};

describe('LeadsMetrics', () => {
  it('calcula totales y conversión', () => {
    const leads: LeadRecord[] = [
      baseLead,
      { ...baseLead, id: '2', calendly_booked: true, roi_data: { ...baseLead.roi_data, paybackMonths: 4 } },
    ];

    render(<LeadsMetrics leads={leads} />);

    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/50.0%/)).toBeInTheDocument();
    expect(screen.getByText(/3.0m/)).toBeInTheDocument();
  });
});
