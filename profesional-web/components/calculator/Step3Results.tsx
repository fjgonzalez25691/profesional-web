import type { ROIResult } from '@/lib/calculator/types';
import { cn } from '@/lib/utils';

type Step3ResultsProps = {
  result: ROIResult;
  email: string;
  onEmailChange: (value: string) => void;
};

const formatCurrency = (value: number) => {
  const rounded = Math.round(value);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export function Step3Results({ result, email, onEmailChange }: Step3ResultsProps) {
  const hasData = result.savingsAnnual > 0 || result.investment > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resultados estimados</h3>
        <p className="mt-1 text-sm text-slate-600">Cálculo rápido basado en tus inputs.</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 text-blue-900">
            <p className="text-sm font-medium">Ahorro estimado</p>
            <p className="text-2xl font-bold">~{formatCurrency(result.savingsAnnual)}€/año</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-slate-900">
            <p className="text-sm font-medium">Inversión</p>
            <p className="text-2xl font-bold">~{formatCurrency(result.investment)}€</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 text-emerald-900">
            <p className="text-sm font-medium">Payback</p>
            <p className="text-2xl font-bold">
              {hasData ? `${result.paybackMonths} mes${result.paybackMonths === 1 ? '' : 'es'}` : 'N/A'}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-medium">ROI 3 años</p>
            <p className="text-2xl font-bold">{hasData ? `${result.roi3Years}%` : 'N/A'}</p>
          </div>
        </div>

        <div className="mt-5 space-y-1 text-slate-800">
          <p>Ahorro estimado: ~{formatCurrency(result.savingsAnnual)}€/año</p>
          <p>Inversión: ~{formatCurrency(result.investment)}€</p>
          <p>Payback: {hasData ? `${result.paybackMonths} mes${result.paybackMonths === 1 ? '' : 'es'}` : 'N/A'}</p>
        </div>
      </div>

      <form
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Recibe análisis completo</h3>
          <p className="text-sm text-slate-600">
            Guardamos tu email para enviarte el reporte detallado (envío siguiente US, sin envío automático ahora).
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="roi-email">
            Email
          </label>
          <input
            id="roi-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="tuemail@empresa.com"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className={cn(
              'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition',
              'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            Guardar (sin enviar)
          </button>
        </div>
      </form>
    </div>
  );
}
