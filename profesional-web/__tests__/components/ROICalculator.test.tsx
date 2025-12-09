import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ROICalculator from '@/components/calculator/ROICalculator';
import { Step3Results } from '@/components/calculator/Step3Results';

const completeStep1 = (sectorLabel: RegExp | string = /Agencia Marketing/i, sizeLabel: RegExp | string = /10-25M/i) => {
  fireEvent.click(screen.getByLabelText(sectorLabel));
  fireEvent.click(screen.getByLabelText(sizeLabel));
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

    // Empresa 5-10M: revenue 7.5M, inversión cloud 0.30% = 22.500€
    // Gasto 3.000€/mes (<=5k): savings rate 12%, ahorro = 3.000*12*0.12 = 4.320€/año
    // Payback = (22.500 / 4.320) * 12 = 62.5 meses
    // ROI 3y = ((4.320*3 - 22.500) / 22.500) * 100 = -42% (negativo, no sirve)

    // Probemos con empresa 10-25M y gasto mayor:
    // Empresa 10-25M: revenue 17.5M, inversión cloud 0.40% = 70.000€
    // Gasto 8.000€/mes (5-10k): savings rate 10%, ahorro = 8.000*12*0.10 = 9.600€/año
    // Payback = (70.000 / 9.600) * 12 = 87.5 meses
    // ROI 3y = ((9.600*3 - 70.000) / 70.000) * 100 = -58% (negativo)

    // Intentemos con gasto más alto para empresa mediana:
    // Empresa 10-25M, gasto 30.000€/mes (>25k): savings 6%, ahorro = 30.000*12*0.06 = 21.600€/año
    // Inversión: 70.000€
    // Payback = (70.000 / 21.600) * 12 = 38.9 ≈ 39 meses
    // ROI 3y = ((21.600*3 - 70.000) / 70.000) * 100 = -7% (aún negativo)

    // Usemos empresa pequeña 5-10M con gasto moderado-alto:
    // Empresa 5-10M, gasto 5.000€/mes: savings 10% (<=5k usa 12%, pero 5k justo usa 10%), ahorro = 5.000*12*0.10 = 6.000€/año
    // Inversión: 22.500€
    // Payback = (22.500 / 6.000) * 12 = 45 meses
    // ROI 3y = ((6.000*3 - 22.500) / 22.500) * 100 = -20% (negativo)

    // El problema es que con los nuevos savings rates (6-12%) la inversión es demasiado alta
    // Vamos a usar empresa pequeña con gasto alto para maximizar ahorro:
    // Empresa 5-10M, gasto 4.000€/mes: savings 12%, ahorro = 4.000*12*0.12 = 5.760€/año
    // Inversión: 22.500€
    // Payback = (22.500 / 5.760) * 12 = 46.9 ≈ 47 meses
    // ROI 3y = ((5.760*3 - 22.500) / 22.500) * 100 = -23% (negativo)

    completeStep1(/Industrial/i, /5-10M/i);

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '4000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Con los valores actuales, esperamos:
    // Ahorro: 5.760€/año, Inversión: 22.500€, Payback: 47 meses, ROI 3y: -23%
    expect(screen.getByText(/Ahorro estimado: ~5\.760€\/año/i)).toBeInTheDocument();
    expect(screen.getByText(/Inversión: ~22\.500€/i)).toBeInTheDocument();
    expect(screen.getByText(/Payback: 47 meses/i)).toBeInTheDocument();
    expect(screen.getByText(/ROI 3 años: -23%/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Supuestos conservadores/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Recibe análisis completo/i)).toBeInTheDocument();
  });

  it('bloquea valores fuera de rango en gasto cloud', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/El gasto mínimo es 500€\/mes/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('muestra aviso de coherencia cuando el gasto cloud supera el 15% de la facturación estimada', () => {
    // FJG-94: Resuelto con cloudRevenueWarningRatio=0.15
    // Para empresa 5-10M (revenue 7.5M): 15% = 1,125,000€/año = 93,750€/mes
    // Usando 95,000€/mes que dispara el warning
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Industrial/i));
    fireEvent.click(screen.getByLabelText(/5-10M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '95000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeInTheDocument();
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
      target: { value: '250' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/No puede superar 200 horas\/semana/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();
  });

  it('valida rango mínimo y máximo en error de forecast', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Forecasting \/ planificaci/i));
    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/El error mínimo es 5%/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultados estimados/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '70' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/El error máximo razonable es 60%/i)).toBeInTheDocument();
  });

  it('muestra aviso cuando el error de forecast es inusualmente alto', () => {
    render(<ROICalculator />);

    fireEvent.click(screen.getByLabelText(/Industrial/i));
    fireEvent.click(screen.getByLabelText(/25-50M/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.click(screen.getByLabelText(/Forecasting \/ planificaci/i));
    fireEvent.change(screen.getByLabelText(/Error de forecast/i), { target: { value: '55' } });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeInTheDocument();
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
    completeStep1(/Industrial/i, /5-10M/i);

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '4000' },
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
    completeStep1(/Industrial/i, /5-10M/i);

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '4000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ceo@empresa.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar resultados/i }));

    await waitFor(() => {
      expect(screen.getByText(/No pudimos guardar tu lead/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje y CTA cuando el resultado es fallback extreme_roi', () => {
    render(
      <Step3Results
        result={{
          type: 'fallback',
          reason: 'extreme_roi',
          message: 'Escenario extremadamente optimista detectado. Necesitamos revisarlo contigo.',
          recommendedAction: 'Agenda una consulta gratuita para validar los datos y recibir una estimación realista.',
        }}
        warnings={[]}
        email=""
        userData={{ sector: 'industrial', companySize: '5-10M' }}
        pains={['cloud-costs']}
        onEmailChange={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: /escenario extremadamente optimista/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /consulta gratuita/i })).toBeInTheDocument();
    expect(screen.queryByText(/ROI 3 años/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ahorro estimado/i)).not.toBeInTheDocument();
  });
});
