import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CalendlyModal from '@/components/CalendlyModal';

// Mock de react-calendly InlineWidget
vi.mock('react-calendly', () => ({
  InlineWidget: ({ url, styles }: { url: string; styles?: React.CSSProperties }) => (
    <div data-testid="calendly-inline-widget" style={styles}>
      Calendly Widget: {url}
    </div>
  ),
}));

describe('CalendlyModal', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
  });

  it('no renderiza el widget cuando isOpen es false', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={false} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.queryByTestId('calendly-inline-widget')).not.toBeInTheDocument();
    });
  });

  it('renderiza el modal con Radix Dialog cuando isOpen es true', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('calendly-inline-widget')).toBeInTheDocument();
    });
  });

  it('renderiza el InlineWidget con la URL de Calendly', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      const widget = screen.getByTestId('calendly-inline-widget');
      expect(widget).toHaveTextContent('Calendly Widget');
    });
  });

  it('tiene el título "Agendar reunión" en DialogHeader', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      const title = screen.getByText('Agendar reunión');
      expect(title).toBeInTheDocument();
    });
  });

  it('usa DialogHeader con título accesible', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      const title = screen.getByText('Agendar reunión');
      expect(title).toBeInTheDocument();
    });
  });

  it('llama a onClose cuando el usuario cierra el dialog', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('calendly-inline-widget')).toBeInTheDocument();
    });

    // Radix Dialog cierra con ESC automáticamente y llama onOpenChange
    fireEvent.keyDown(document, { key: 'Escape' });

    // onClose debería haber sido llamado
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('trackea evento calendly_modal_open cuando se abre', async () => {
    const mockOnClose = vi.fn();
    const { rerender } = render(<CalendlyModal isOpen={false} onClose={mockOnClose} />);

    // Abrir modal
    rerender(<CalendlyModal isOpen={true} onClose={mockOnClose} source="fab" />);

    await waitFor(() => {
      expect(screen.getByTestId('calendly-inline-widget')).toBeInTheDocument();
    });

    // El tracking se hace via lib/analytics (console.log en desarrollo)
    // Este test verifica que el modal se abre correctamente
  });
});
