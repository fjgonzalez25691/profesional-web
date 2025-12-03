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
      screen.getByText(/Para empresas que quieren optimizar costes y ganar eficiencia/i),
    ).toBeInTheDocument();

    // Verificar que existen los botones flotantes (2: desktop y mobile)
    const calendlyButtons = screen.getAllByLabelText(/Agendar reunión/i);
    expect(calendlyButtons).toHaveLength(2);
  });

  it('opens modal on CTA click', () => {
    render(<Home />);

    // Obtener todos los botones de Calendly (hay 2: desktop y mobile)
    const calendlyButtons = screen.getAllByLabelText(/Agendar reunión/i);

    // Modal shouldn't be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click en el primer botón (cualquiera de los dos debería funcionar)
    fireEvent.click(calendlyButtons[0]);

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});