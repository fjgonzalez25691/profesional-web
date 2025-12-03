import { sql } from '@vercel/postgres';
import { sendNurturingEmail, type LeadRecord } from '@/lib/email/nurturing';

const AUTH_HEADER = 'authorization';

export async function GET(req: Request) {
  if (req.headers.get(AUTH_HEADER) !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const day1Leads = await sql`
    SELECT id, email, name, savings_annual, payback_months, calendly_link, calendly_booked, nurturing_stage
    FROM leads
    WHERE nurturing_stage = 0
      AND last_email_sent_at < NOW() - INTERVAL '24 hours'
      AND calendly_booked = false
    LIMIT 50
  `;

  for (const lead of day1Leads.rows) {
    await sendNurturingEmail(lead as unknown as LeadRecord, 'day1');
    await sql`
      UPDATE leads
      SET nurturing_stage = 1, last_email_sent_at = NOW()
      WHERE id = ${lead.id}
    `;
  }

  const day3Leads = await sql`
    SELECT id, email, name, savings_annual, payback_months, calendly_link, calendly_booked, nurturing_stage
    FROM leads
    WHERE nurturing_stage = 1
      AND last_email_sent_at < NOW() - INTERVAL '48 hours'
      AND calendly_booked = false
    LIMIT 50
  `;

  for (const lead of day3Leads.rows) {
    await sendNurturingEmail(lead as unknown as LeadRecord, 'day3');
    await sql`
      UPDATE leads
      SET nurturing_stage = 2, last_email_sent_at = NOW()
      WHERE id = ${lead.id}
    `;
  }

  return Response.json({
    sent: (day1Leads.rowCount || 0) + (day3Leads.rowCount || 0),
  });
}
