import type { Metadata } from 'next';
import ROICalculator from '@/components/calculator/ROICalculator';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Calculadora ROI (Admin) | Arquitecto P&L',
  description: 'Calculadora ROI interactiva - Acceso restringido para pruebas internas.',
  robots: 'noindex,nofollow',
};

export default function CalculatorPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin"
            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Volver al dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-blue-700">Admin - Calculadora ROI</p>
              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                Acceso Restringido
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Calcula tu ROI en 2 minutos</h1>
            <p className="max-w-3xl text-slate-600">
              Wizard de 3 pasos con datos mínimos: sector, dolores y inputs clave. Entorno de pruebas interno.
            </p>
          </div>
        </div>

        <ROICalculator />
      </div>
    </div>
  );
}
