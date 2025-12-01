import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('Environment Configuration', () => {
  it('should have a .env.example file', () => {
    const envExamplePath = path.resolve(process.cwd(), '.env.example');
    expect(fs.existsSync(envExamplePath)).toBe(true);
  });

  it('should have required variables in .env.example for Neon and app config', () => {
    const envExamplePath = path.resolve(process.cwd(), '.env.example');
    // Skip reading if file doesn't exist to avoid crashing this specific test (fail handled by previous test)
    if (!fs.existsSync(envExamplePath)) return;

    const content = fs.readFileSync(envExamplePath, 'utf-8');
    const requiredVars = [
      'DATABASE_URL',
      'DIRECT_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_CALENDLY_URL',
      'NODE_ENV'
    ];

    requiredVars.forEach(variable => {
      expect(content).toContain(variable);
    });
  });
});
