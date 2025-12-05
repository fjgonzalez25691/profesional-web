import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ROICalculator from '@/components/calculator/ROICalculator';

const completeStep1 = () => {
  fireEvent.click(screen.getByLabelText(/Agencia Marketing/i));
  fireEvent.click(screen.getByLabelText(/10-25M/i));
  fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
};

const originalFetch = global.fetch;

describe('ROICalculator wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('calcula escenario cloud y muestra resultados + form email', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '8500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/Ahorro estimado: ~28\.050€\/año/i)).toBeInTheDocument();
    expect(screen.getByText(/Inversión: ~3\.220€/i)).toBeInTheDocument();
    expect(screen.getByText(/Payback: 1 mes/i)).toBeInTheDocument();
    expect(screen.getByText(/ROI 3 años: > 1\.000%/i)).toBeInTheDocument();
    expect(screen.getByText(/Recibe análisis completo/i)).toBeInTheDocument();
  });

  it('bloquea valores fuera de rango en gasto cloud', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '50' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/gasto cloud mensual debe estar entre/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('valida que el gasto cloud anual no supere el 40% de la facturación estimada', () => {
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Industrial/i));
    fireEvent.click(screen.getByLabelText(/5-10M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '280000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/supera el 40% de la facturación estimada/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('requiere importe cloud cuando se selecciona el dolor', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/Campo requerido/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ahorro estimado/i)).not.toBeInTheDocument();
  });

  it('bloquea valores fuera de rango en horas manuales', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir procesos manuales/i));
    fireEvent.change(screen.getByLabelText(/Horas manuales a la semana/i), {
      target: { value: '200' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/manuales semanales deben estar entre/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('envía el lead y el email y muestra confirmación', async () => {
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, leadId: 'lead-1' }),
    });
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ROICalculator />);
    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '8500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ceo@empresa.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar resultados/i }));

    await screen.findByText(/Revisa tu email/i);
    expect((global.fetch as unknown as vi.Mock).mock.calls[0][0]).toBe('/api/leads');
    expect((global.fetch as unknown as vi.Mock).mock.calls[1][0]).toBe('/api/send-roi-email');
  });

  it('muestra error cuando el envío falla', async () => {
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'No pudimos guardar tu lead' }),
    });
    (global.fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'No pudimos enviar email' }),
    });

    render(<ROICalculator />);
    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '8500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ceo@empresa.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar resultados/i }));

    await waitFor(() => {
      expect(screen.getByText(/No pudimos guardar tu lead/i)).toBeInTheDocument();
    });
  });
});
