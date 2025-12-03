import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CalendlyModal from '@/components/CalendlyModal';

// Mock useAnalytics
const mockTrack = vi.fn();
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

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
    mockTrack.mockClear();
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

  it('trackea evento calendly_booking_completed al recibir mensaje de Calendly', async () => {
    const mockOnClose = vi.fn();
    render(<CalendlyModal isOpen={true} onClose={mockOnClose} source="hero" />);

    // Simular evento postMessage de Calendly
    const event = new MessageEvent('message', {
      data: {
        event: 'calendly.event_scheduled',
        payload: { event: { uri: 'test-uri' } }
      },
      origin: 'https://calendly.com'
    });
    
    fireEvent(window, event);

    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('calendly_booking_completed', {
        source: 'hero'
      });
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

  it('NO emite calendly_modal_close en el montaje inicial', async () => {
    const mockOnClose = vi.fn();
    mockTrack.mockClear();

    render(<CalendlyModal isOpen={false} onClose={mockOnClose} />);

    // Esperar a que el componente monte completamente
    await waitFor(() => {
      expect(screen.queryByTestId('calendly-inline-widget')).not.toBeInTheDocument();
    });

    // NO debe haber llamado a track con 'calendly_modal_close'
    expect(mockTrack).not.toHaveBeenCalledWith('calendly_modal_close', expect.any(Object));
  });

  it('emite calendly_modal_open solo cuando isOpen cambia de false a true', async () => {
    const mockOnClose = vi.fn();
    mockTrack.mockClear();

    const { rerender } = render(<CalendlyModal isOpen={false} onClose={mockOnClose} />);

    // Esperar montaje
    await waitFor(() => {
      expect(screen.queryByTestId('calendly-inline-widget')).not.toBeInTheDocument();
    });

    // No debe haber eventos todavía
    expect(mockTrack).not.toHaveBeenCalled();

    // Cambiar a isOpen=true
    rerender(<CalendlyModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('calendly_modal_open', { source: 'hero' });
      expect(mockTrack).toHaveBeenCalledTimes(1);
    });
  });

  it('emite calendly_modal_close solo cuando isOpen cambia de true a false', async () => {
    const mockOnClose = vi.fn();
    mockTrack.mockClear();

    const { rerender } = render(<CalendlyModal isOpen={true} onClose={mockOnClose} source="fab" />);

    // Esperar a que el componente monte y emita el evento open
    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('calendly_modal_open', { source: 'fab' });
    });

    mockTrack.mockClear();

    // Cambiar a isOpen=false
    rerender(<CalendlyModal isOpen={false} onClose={mockOnClose} source="fab" />);

    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('calendly_modal_close', { method: 'click', source: 'fab' });
      expect(mockTrack).toHaveBeenCalledTimes(1);
    });
  });
});
