import { sql } from '@vercel/postgres';
import { LeadSchema, getEmailWarnings } from '@/lib/validation/lead-schema';
import type { LeadInput } from '@/lib/validation/lead-schema';

const insertLead = async (data: LeadInput) => {
  const painsJson = JSON.stringify(data.pains || []);
  const roiDataJson = JSON.stringify(data.roiData);

  const result = await sql`
    INSERT INTO leads (
      email,
      name,
      company_name,
      sector,
      company_size,
      pains,
      roi_data,
      source,
      utm_campaign,
      utm_source,
      utm_medium,
      updated_at
    )
    VALUES (
      ${data.email},
      ${data.name || null},
      ${data.companyName || null},
      ${data.sector},
      ${data.companySize},
      ${painsJson}::jsonb,
      ${roiDataJson}::jsonb,
      'roi-calculator',
      ${data.utmParams?.campaign || null},
      ${data.utmParams?.source || null},
      ${data.utmParams?.medium || null},
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      roi_data = EXCLUDED.roi_data,
      sector = EXCLUDED.sector,
      company_size = EXCLUDED.company_size,
      pains = EXCLUDED.pains,
      utm_campaign = EXCLUDED.utm_campaign,
      utm_source = EXCLUDED.utm_source,
      utm_medium = EXCLUDED.utm_medium,
      updated_at = NOW()
    RETURNING id;
  `;

  return result.rows[0]?.id as string | undefined;
};

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  try {
    const leadId = await insertLead(parsed.data);
    const warnings = getEmailWarnings(parsed.data.email);
    return Response.json({ success: true, leadId, warnings });
  } catch (error) {
    console.error('Error inserting lead', error);
    return Response.json({ error: 'No pudimos guardar tu lead' }, { status: 500 });
  }
}
