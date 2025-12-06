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
    expect(screen.getAllByText(/ROI extremo \(> 1\.000%\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Supuestos conservadores/i).length).toBeGreaterThan(0);
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

    expect(screen.getByText(/El gasto mínimo es 100€/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('muestra aviso de coherencia cuando el gasto cloud supera el 20% de la facturación estimada', () => {
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Industrial/i));
    fireEvent.click(screen.getByLabelText(/5-10M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '200000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/gasto cloud alto/i)).toBeInTheDocument();
    expect(screen.getByText(/Resultados estimados/i)).toBeInTheDocument();
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

    expect(screen.getByText(/Una semana tiene 168 horas máximo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('valida rango mínimo y máximo en error de forecast', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Forecasting \/ planificaci/i));
    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/El error mínimo es 1%/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '120' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/El error máximo razonable es 100%/i)).toBeInTheDocument();
  });

  it('muestra aviso cuando el error de forecast es inusualmente alto', () => {
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Industrial/i));
    fireEvent.click(screen.getByLabelText(/25-50M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByLabelText(/Forecasting \/ planificaci/i));
    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '75' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/error de forecast muy alto/i)).toBeInTheDocument();
  });

  it('muestra fallback cuando no hay datos para calcular ROI', () => {
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Agencia Marketing/i));
    fireEvent.click(screen.getByLabelText(/10-25M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/ℹ️ No hemos podido calcular el ROI porque faltan datos/i)).toBeInTheDocument();
    expect(screen.queryByText(/ROI 3 años:/i)).not.toBeInTheDocument();
  });

  it('envía el lead y el email y muestra confirmación', async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, leadId: 'lead-1' }),
    } as Response);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

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
    expect(mockFetch.mock.calls[0][0]).toBe('/api/leads');
    expect(mockFetch.mock.calls[1][0]).toBe('/api/send-roi-email');
  });

  it('muestra error cuando el envío falla', async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'No pudimos guardar tu lead' }),
    } as Response);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'No pudimos enviar email' }),
    } as Response);

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
