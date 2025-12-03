import { getNeonClient } from '@/lib/db';

interface DatabaseRow {
  id: string;
  email: string;
  name: string | null;
  sector: string | null;
  company_size: string | null;
  roi_data: string | Record<string, unknown>;
  nurturing_stage: number;
  calendly_booked: boolean;
  created_at: string;
}

export type LeadRecord = {
  id: string;
  email: string;
  name: string | null;
  sector: string | null;
  company_size: string | null;
  roi_data: {
    investment?: number;
    savingsAnnual: number;
    paybackMonths: number;
    roi3Years: number;
  };
  nurturing_stage: number;
  calendly_booked: boolean;
  created_at: string;
};

export async function getLeads(): Promise<LeadRecord[]> {
  const sql = getNeonClient();
  
  const result = await sql`
    SELECT id, email, name, sector, company_size, roi_data, nurturing_stage, calendly_booked, created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT 100;
  `;

  return result.map((row) => {
    const typedRow = row as DatabaseRow;
    return {
      ...typedRow,
      roi_data: typeof typedRow.roi_data === 'string' ? JSON.parse(typedRow.roi_data) : typedRow.roi_data,
    };
  }) as LeadRecord[];
}
