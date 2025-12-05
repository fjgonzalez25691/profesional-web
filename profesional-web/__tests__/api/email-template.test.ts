import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

const templatePath = path.join(process.cwd(), 'templates', 'roi-email.html');

describe('ROI email template', () => {
  it('contiene placeholders requeridos y disclaimer legal', async () => {
    const source = await fs.readFile(templatePath, 'utf-8');

    const placeholders = [
      '{{savingsAnnual}}',
      '{{investment}}',
      '{{paybackMonths}}',
      '{{roi3Years}}',
      '{{sector}}',
      '{{companySize}}',
    ];

    placeholders.forEach((placeholder) => {
      expect(source).toContain(placeholder);
    });

    expect(source).toContain('https://fjgaparicio.es/calendly?utm_source=email&utm_campaign=roi-calculator');
    expect(source).toContain('⚖️');
  });

  it('renderiza métricas en HTML interpolado', async () => {
    const source = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(source);

    const html = template({
      savingsAnnual: '35.700',
      investment: '3.220',
      paybackMonths: 1,
      roi3Years: '> 1.000%',
      sector: 'agencia',
      companySize: '10-25M',
    });

    expect(html).toContain('35.700€');
    expect(html).toContain('3.220€');
    expect(html).toContain('1 meses');
    expect(html).toContain('&gt; 1.000%');
    expect(html).toContain('agencia');
    expect(html).toContain('10-25M');
  });
});
