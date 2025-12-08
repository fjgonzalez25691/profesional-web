import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MethodologySection from '@/components/MethodologySection';

describe('MethodologySection', () => {
  it('renderiza el título principal', () => {
    render(<MethodologySection />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /cóm(.*) trabajo: 3 fases enfocadas en p&l/i,
      }),
    ).toBeInTheDocument();
  });

  it('muestra las tres fases con sus títulos', () => {
    render(<MethodologySection />);

    expect(screen.getByRole('heading', { level: 3, name: /Fase 1: Auditoría Express 48h/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Fase 2: Roadmap Priorizado ROI/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Fase 3: Implementación Supervisada/i })).toBeInTheDocument();
  });

  it('destaca el badge anti-camello en la Fase 2', () => {
    render(<MethodologySection />);

    expect(screen.getByTestId('anti-camello-badge')).toBeInTheDocument();
  });

  it('muestra timeline visual para desktop', () => {
    render(<MethodologySection />);

    const timeline = screen.getByTestId('methodology-timeline-desktop');
    expect(timeline).toHaveClass('hidden', 'md:flex');
  });

  it('muestra los entregables de cada fase', () => {
    render(<MethodologySection />);

    expect(screen.getByText(/Report 1 página con 3 quick wins/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap con inversión\/ahorro cada item/i)).toBeInTheDocument();
    expect(screen.getByText(/Si no reduces >20% → no cobro/i)).toBeInTheDocument();
  });
});
