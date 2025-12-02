import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PainPoints from '@/components/PainPoints';

describe('PainPoints Component', () => {
  it('renderiza el título "¿Te pasa esto?"', () => {
    render(<PainPoints />);
    expect(screen.getByRole('heading', { name: /¿Te pasa esto\?/i })).toBeInTheDocument();
  });

  it('renderiza exactamente 3 bullets de dolor', () => {
    render(<PainPoints />);
    // Buscar todos los pain points por su estructura
    const painPointItems = screen.getAllByTestId('pain-point-item');
    expect(painPointItems).toHaveLength(3);
  });

  it('cada bullet contiene un icono X', () => {
    render(<PainPoints />);
    // Lucide React genera SVGs, verificamos que existen
    const icons = screen.getAllByTestId('pain-point-icon');
    expect(icons).toHaveLength(3);
  });

  it('contiene el texto específico sobre procesos manuales', () => {
    render(<PainPoints />);
    expect(screen.getByText(/2-4 h\/día picando facturas\/albaranes/i)).toBeInTheDocument();
  });

  it('contiene el texto específico sobre factura cloud', () => {
    render(<PainPoints />);
    expect(screen.getByText(/AWS\/Azure subió >30% sin explicación/i)).toBeInTheDocument();
  });

  it('contiene el texto específico sobre forecasting', () => {
    render(<PainPoints />);
    expect(screen.getByText(/Previsiones Excel fallan 20-30%/i)).toBeInTheDocument();
  });

  it('tiene el fondo gris especificado', () => {
    render(<PainPoints />);
    const section = screen.getByRole('heading', { name: /¿Te pasa esto\?/i }).closest('section');
    expect(section).toHaveClass('bg-[#F9FAFB]');
  });
});
