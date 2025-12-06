import { useState } from 'react';
import type {
  CalculatorInputs,
  CalculatorWarning,
  CompanySize,
  ROIResult,
  Sector,
} from '@/lib/calculator/types';
import { formatRoiWithCap } from '@/lib/calculator/calculateROI';
import { cn } from '@/lib/utils';

type Step3ResultsProps = {
  result: ROIResult;
  warnings: CalculatorWarning[];
  email: string;
  userData: { sector: Sector; companySize: CompanySize };
  pains: CalculatorInputs['pains'];
  onEmailChange: (value: string) => void;
};

const formatCurrency = (value: number) => {
  const rounded = Math.round(value);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export function Step3Results({ result, warnings, email, userData, pains, onEmailChange }: Step3ResultsProps) {
  const hasData = result.savingsAnnual > 0 || result.investment > 0;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const roiDisplay = formatRoiWithCap(result.roi3Years);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage('Introduce un email');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage(null);

    try {
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sector: userData.sector,
          companySize: userData.companySize,
          pains,
          roiData: result,
        }),
      });

      if (!leadResponse.ok) {
        throw new Error('No pudimos guardar tu lead');
      }

      const response = await fetch('/api/send-roi-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          roiData: result,
          userData,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || 'No pudimos enviar email');
      }

      setStatus('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No pudimos enviar email';
      setErrorMessage(message);
      setStatus('error');
    }
  };

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
            <p className="text-2xl font-bold" data-testid="roi-3y">
              {hasData ? roiDisplay.label : 'N/A'}
            </p>
            {hasData && roiDisplay.isCapped && (
              <p className="mt-1 text-xs font-semibold text-amber-700">
                Resultado extremo (&gt; 1.000%). Valida el dato con números reales antes de presentarlo.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-1 text-slate-800">
          <p>Ahorro estimado: ~{formatCurrency(result.savingsAnnual)}€/año</p>
          <p>Inversión: ~{formatCurrency(result.investment)}€</p>
          <p>Payback: {hasData ? `${result.paybackMonths} mes${result.paybackMonths === 1 ? '' : 'es'}` : 'N/A'}</p>
          <p>ROI 3 años: {hasData ? roiDisplay.label : 'N/A'}</p>
        </div>

        {warnings.length > 0 && (
          <div className="mt-4 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-800">Avisos de coherencia</p>
            <ul className="space-y-1 text-sm text-amber-900">
              {warnings.map((warning) => (
                <li key={warning.type}>{warning.message}</li>
              ))}
            </ul>
          </div>
        )}

        {result.inventorySavingsCapped && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-800">
              Aviso: el ahorro estimado en inventario ha sido ajustado para no superar un umbral razonable respecto al
              valor de inventario de tu empresa.
            </p>
          </div>
        )}
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Recibe análisis completo</h3>
          <p className="text-sm text-slate-600">
            Enviamos tus métricas ROI al email que indiques para que puedas compartirlas con tu equipo/CFO.
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
            disabled={status === 'sending'}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition',
              'bg-blue-600 text-white hover:bg-blue-700',
              status === 'sending' ? 'opacity-80' : ''
            )}
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar resultados'}
          </button>
        </div>

        {status === 'success' && (
          <p className="mt-3 text-sm font-semibold text-emerald-700">Revisa tu email</p>
        )}

        {status === 'error' && errorMessage && (
          <p className="mt-3 text-sm font-semibold text-red-700">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
