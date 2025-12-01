import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../app/page';
import { describe, it, expect, vi } from 'vitest';

// Mock Calendly component to avoid loading external scripts in tests
vi.mock('@/components/CalendlyModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div role="dialog">Calendly Modal <button onClick={onClose}>Close</button></div> : null
  ),
}));

describe('Home Page', () => {
  it('renders the new Hero section with correct copy', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /Reduzco tu factura Cloud y automatizo procesos con payback <6 meses/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Para empresas industriales, logísticas y agencias 5–50M€/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Diagnóstico gratuito 30 min/i }),
    ).toBeInTheDocument();
  });

  it('opens modal on CTA click', () => {
    render(<Home />);
    const cta = screen.getByRole('button', { name: /Diagnóstico gratuito 30 min/i });
    
    // Modal shouldn't be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Click CTA
    fireEvent.click(cta);
    
    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});