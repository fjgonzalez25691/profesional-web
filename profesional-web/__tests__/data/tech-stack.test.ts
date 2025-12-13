import { describe, it, expect } from 'vitest';
import { TECH_STACK_MVP } from '@/data/tech-stack';

describe('TECH_STACK_MVP', () => {
  it('contiene las 4 categorías principales', () => {
    expect(TECH_STACK_MVP).toHaveProperty('frontend');
    expect(TECH_STACK_MVP).toHaveProperty('backend');
    expect(TECH_STACK_MVP).toHaveProperty('infra');
    expect(TECH_STACK_MVP).toHaveProperty('analytics');
  });

  it('frontend incluye Next.js 15 y React 19', () => {
    const frontendNames = TECH_STACK_MVP.frontend.map((t) => t.name);
    expect(frontendNames).toContain('Next.js 15');
    expect(frontendNames).toContain('React 19');
    expect(frontendNames).toContain('TypeScript');
    expect(frontendNames).toContain('Tailwind CSS');
    expect(frontendNames).toContain('Shadcn/ui');
  });

  it('backend incluye Groq (Llama 3.3)', () => {
    const backendNames = TECH_STACK_MVP.backend.map((t) => t.name);
    expect(backendNames).toContain('Groq (Llama 3.3)');
    expect(backendNames).toContain('Neon Postgres');
  });

  it('cada tecnología tiene name y purpose', () => {
    const allTech = [
      ...TECH_STACK_MVP.frontend,
      ...TECH_STACK_MVP.backend,
      ...TECH_STACK_MVP.infra,
      ...TECH_STACK_MVP.analytics,
    ];

    allTech.forEach((tech) => {
      expect(tech).toHaveProperty('name');
      expect(tech).toHaveProperty('purpose');
      expect(typeof tech.name).toBe('string');
      expect(typeof tech.purpose).toBe('string');
      expect(tech.name.length).toBeGreaterThan(0);
      expect(tech.purpose.length).toBeGreaterThan(0);
    });
  });
});