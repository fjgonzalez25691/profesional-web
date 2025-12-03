import { describe, expect, it } from 'vitest';
import { isDisposableEmail, isCompanyEmail } from '@/lib/validation/email';

describe('email validation utils', () => {
  it('detecta dominios desechables', () => {
    expect(isDisposableEmail('lead@tempmail.com')).toBe(true);
    expect(isDisposableEmail('lead@mailinator.com')).toBe(true);
    expect(isDisposableEmail('lead@empresa.com')).toBe(false);
  });

  it('detecta emails corporativos', () => {
    expect(isCompanyEmail('ceo@empresa.com')).toBe(true);
    expect(isCompanyEmail('usuario@gmail.com')).toBe(false);
  });
});
