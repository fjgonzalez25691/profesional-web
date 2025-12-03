import { describe, it, expect } from 'vitest';
import { validateResponse, DISCLAIMER } from '@/lib/response-validator';

describe('response validator', () => {
  it('returns original text when no prohibited phrases', () => {
    const result = validateResponse('Respuesta orientativa sin garantías.');

    expect(result.flagged).toBe(false);
    expect(result.text).toBe('Respuesta orientativa sin garantías.');
  });

  it('appends disclaimer when prohibited phrases are present', () => {
    const result = validateResponse('Te garantizo un 100% seguro resultado garantizado.');

    expect(result.flagged).toBe(true);
    expect(result.text).toMatch(DISCLAIMER);
    expect(result.text).toMatch(/garantizo/i);
  });
});
