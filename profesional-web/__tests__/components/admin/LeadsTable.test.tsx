import { render, screen } from '@testing-library/react';
import { LeadsTable } from '@/components/admin/LeadsTable';
import type { LeadRecord } from '@/lib/admin/get-leads';

const lead: LeadRecord = {
  id: '1',
  email: 'lead@empresa.com',
  name: 'Lead',
  sector: 'agencia',
  company_size: '10-25M',
  roi_data: { savingsAnnual: 35700, paybackMonths: 1, roi3Years: 3226, investment: 3220 },
  nurturing_stage: 1,
  calendly_booked: false,
  created_at: '2024-01-01T00:00:00.000Z',
};

describe('LeadsTable', () => {
  it('renderiza headers y datos', () => {
    render(<LeadsTable leads={[lead]} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Stage')).toBeInTheDocument();
    expect(screen.getByText('lead@empresa.com')).toBeInTheDocument();
    expect(screen.getByText('35.700€')).toBeInTheDocument();
    expect(screen.getByText(/Día 1/i)).toBeInTheDocument();
  });
});
