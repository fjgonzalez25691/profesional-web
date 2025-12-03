import type { Metadata } from 'next';
import ROICalculator from '@/components/calculator/ROICalculator';

export const metadata: Metadata = {
  title: 'Calculadora ROI | Arquitecto P&L',
  description: 'Calculadora ROI interactiva en 3 pasos: sector, dolores y resultados instantáneos.',
};

export default function CalculatorPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold text-blue-700">Lead magnet ROI</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Calcula tu ROI en 2 minutos</h1>
          <p className="max-w-3xl text-slate-600">
            Wizard de 3 pasos con datos mínimos: sector, dolores y inputs clave. Sin envío de email (DoD S3), solo cálculo y captura.
          </p>
        </div>

        <ROICalculator />
      </div>
    </div>
  );
}
