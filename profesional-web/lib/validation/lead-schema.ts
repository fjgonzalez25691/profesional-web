import { z } from 'zod';
import { isDisposableEmail } from '@/lib/validation/email';

export const LeadSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre muy corto').optional(),
  companyName: z.string().optional(),
  sector: z.string(),
  companySize: z.string(),
  pains: z.array(z.string()),
  roiData: z.object({
    investment: z.number(),
    savingsAnnual: z.number(),
    paybackMonths: z.number(),
    roi3Years: z.number(),
  }),
  utmParams: z
    .object({
      campaign: z.string().optional(),
      source: z.string().optional(),
      medium: z.string().optional(),
    })
    .optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export function getEmailWarnings(email: string) {
  return {
    isDisposable: isDisposableEmail(email),
  };
}
