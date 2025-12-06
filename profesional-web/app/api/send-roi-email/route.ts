import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { Resend } from 'resend';
import { formatRoiWithCap } from '@/lib/calculator/calculateROI';

interface ROIData {
  savingsAnnual: number;
  investment: number;
  paybackMonths: number;
  roi3Years: number;
}

interface UserData {
  sector: string;
  companySize: string;
}

const templatePath = path.join(process.cwd(), 'templates', 'roi-email.html');

// Lazy initialization: solo crear instancia cuando se use la ruta
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY no configurada');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const formatEuros = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value) && value >= 0;

export async function POST(req: Request) {
  let payload: { email?: string; roiData?: ROIData; userData?: UserData };

  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { email, roiData, userData } = payload ?? {};

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email requerido' }, { status: 400 });
  }

  if (!roiData || !userData) {
    return Response.json({ error: 'Datos ROI y usuario requeridos' }, { status: 400 });
  }

  const { savingsAnnual, investment, paybackMonths, roi3Years } = roiData;
  const numericFields = [savingsAnnual, investment, paybackMonths, roi3Years];

  if (!numericFields.every(isNumber) || !userData.sector || !userData.companySize) {
    return Response.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: 'Config RESEND_API_KEY requerida' }, { status: 500 });
  }

  let templateSource: string;
  try {
    templateSource = await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    console.error('No se pudo leer la plantilla de email', error);
    return Response.json({ error: 'No pudimos enviar email' }, { status: 500 });
  }

  const template = Handlebars.compile(templateSource);

  const html = template({
    savingsAnnual: formatEuros(savingsAnnual),
    investment: formatEuros(investment),
    paybackMonths,
    roi3Years: formatRoiWithCap(roi3Years).label,
    sector: userData.sector,
    companySize: userData.companySize,
  });

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'Francisco García <hola@fjgaparicio.es>',
      to: email,
      subject: 'Tu Análisis ROI Personalizado',
      html,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error al enviar email con Resend', error);
    return Response.json({ error: 'No pudimos enviar email' }, { status: 500 });
  }
}
