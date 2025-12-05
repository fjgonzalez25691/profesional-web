import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

const day1Path = path.join(process.cwd(), 'templates', 'nurturing-day1.html');
const day3Path = path.join(process.cwd(), 'templates', 'nurturing-day3.html');

describe('Templates nurturing', () => {
  it('day1 contiene placeholders requeridos', async () => {
    const html = await fs.readFile(day1Path, 'utf-8');
    ['{{name}}', '{{savingsAnnual}}', '{{paybackMonths}}', '{{calendlyLink}}'].forEach((placeholder) => {
      expect(html).toContain(placeholder);
    });
  });

  it('day3 contiene placeholders y desuscribir', async () => {
    const html = await fs.readFile(day3Path, 'utf-8');
    ['{{name}}', '{{savingsAnnual}}', '{{calendlyLink}}', '{{unsubscribeLink}}'].forEach((placeholder) => {
      expect(html).toContain(placeholder);
    });
  });

  it('day1 renderiza métricas', async () => {
    const source = await fs.readFile(day1Path, 'utf-8');
    const template = Handlebars.compile(source);
    const output = template({
      name: 'Fran',
      savingsAnnual: '28.050',
      paybackMonths: 1,
      calendlyLink: 'https://cal.com',
    });
    expect(output).toContain('28.050');
    expect(output).toContain('1');
    expect(output).toContain('Fran');
  });
});
