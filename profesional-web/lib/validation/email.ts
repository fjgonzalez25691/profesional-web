const disposableDomains = new Set([
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
]);

const personalDomains = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1];
  if (!domain) return false;
  return disposableDomains.has(domain.toLowerCase());
}

export function isCompanyEmail(email: string): boolean {
  const domain = email.split('@')[1];
  if (!domain) return false;
  return !personalDomains.has(domain.toLowerCase());
}
