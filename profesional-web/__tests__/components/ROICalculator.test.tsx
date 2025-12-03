import { fireEvent, render, screen } from '@testing-library/react';
import ROICalculator from '@/components/calculator/ROICalculator';

const completeStep1 = () => {
  fireEvent.click(screen.getByLabelText(/Agencia Marketing/i));
  fireEvent.click(screen.getByLabelText(/10-25M/i));
  fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));
};

describe('ROICalculator wizard', () => {
  it('calcula escenario cloud y muestra resultados + form email', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.change(screen.getByLabelText(/Gasto mensual en cloud/i), {
      target: { value: '8500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/Ahorro estimado: ~35\.700€\/año/i)).toBeInTheDocument();
    expect(screen.getByText(/Inversión: ~3\.200€/i)).toBeInTheDocument();
    expect(screen.getByText(/Payback: 1 mes/i)).toBeInTheDocument();
    expect(screen.getByText(/Recibe análisis completo/i)).toBeInTheDocument();
  });

  it('requiere importe cloud cuando se selecciona el dolor', () => {
    render(<ROICalculator />);

    completeStep1();

    fireEvent.click(screen.getByLabelText(/Reducir costes cloud/i));
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    expect(screen.getByText(/Campo requerido/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ahorro estimado/i)).not.toBeInTheDocument();
  });
});
