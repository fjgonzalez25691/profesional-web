import { render, screen } from '@testing-library/react';
import Home from '../../app/page';
import { describe, it, expect } from 'vitest';

describe('Home Page', () => {
  it('renders the main headline, tech stack, and CTA link', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /Arquitecto Cloud & IA para P&L/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Next\.?js 16 \+ TypeScript \+ Neon PostgreSQL/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Agenda un diagnóstico/i }),
    ).toBeInTheDocument();
  });
});
