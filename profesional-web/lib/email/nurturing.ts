import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { Resend } from 'resend';

type NurturingStage = 'day1' | 'day3';

export interface LeadRecord {
  id: string | number;
  email: string;
  name?: string;
  company?: string;
  savings_annual?: number | null;
  payback_months?: number | null;
  calendly_link?: string | null;
  roi_data?: Record<string, unknown>;
  pains?: Record<string, unknown>;
  nurturing_stage?: string;
  last_email_sent_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const templatesMap: Record<NurturingStage, string> = {
  day1: 'nurturing-day1.html',
  day3: 'nurturing-day3.html',
};

const getTemplatePath = (stage: NurturingStage) =>
  path.join(process.cwd(), 'templates', templatesMap[stage]);

const formatNumber = (value: number | null | undefined) => {
  if (!value && value !== 0) return '0';
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export async function sendNurturingEmail(lead: LeadRecord, stage: NurturingStage) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY missing');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const templateSource = await fs.readFile(getTemplatePath(stage), 'utf-8');
  const template = Handlebars.compile(templateSource);

  const calendlyLink =
    lead.calendly_link ||
    'https://fjgaparicio.es/calendly?utm_source=email&utm_campaign=roi-nurturing';
  const unsubscribeLinkBase =
    process.env.PUBLIC_UNSUBSCRIBE_URL || 'https://fjgaparicio.es/unsubscribe';
  const unsubscribeLink = `${unsubscribeLinkBase}?lead=${lead.id}`;

  const html = template({
    name: lead.name || 'allí',
    savingsAnnual: formatNumber(lead.savings_annual ?? undefined),
    paybackMonths: lead.payback_months ?? 0,
    calendlyLink,
    unsubscribeLink,
  });

  await resend.emails.send({
    from: 'Francisco García <hola@fjgaparicio.es>',
    to: lead.email,
    subject: stage === 'day1' ? '¿Viste tu ahorro?' : 'Última oportunidad: Diagnóstico gratuito',
    html,
  });
}
