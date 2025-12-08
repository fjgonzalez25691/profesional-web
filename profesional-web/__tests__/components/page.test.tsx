import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
        name: /Hago que tu negocio gane más y gaste menos usando IA, automatización y soluciones Cloud/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Menos costes, menos errores y más tiempo para lo importante./i),
    ).toBeInTheDocument();
    // El CTA flotante no debe mostrarse antes del scroll
    expect(screen.queryByLabelText(/reserva 30 min/i)).not.toBeInTheDocument();
  });

  it('opens modal on CTA click', async () => {
    // Simular página con scroll
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 1000,
    });

    render(<Home />);

    // Simular scroll >45%
    Object.defineProperty(window, 'pageYOffset', { configurable: true, value: 700 });
    fireEvent.scroll(window);

    // Obtener todos los botones de Calendly (hay 2: desktop y mobile) tras el scroll
    const calendlyButtons = await waitFor(() =>
      screen.getAllByLabelText(/reserva 30 min/i)
    );

    // Modal shouldn't be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click en el primer botón (cualquiera de los dos debería funcionar)
    fireEvent.click(calendlyButtons[0]);

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renderiza la sección de stack tecnológico', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Stack Tecnológico Transparente/i,
      }),
    ).toBeInTheDocument();
  });
});
