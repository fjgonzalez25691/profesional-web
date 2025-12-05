import type { ChangeEvent } from 'react';
import type { CalculatorInputs, PainPoint } from '@/lib/calculator/types';
import { cn } from '@/lib/utils';

type Step2PainsProps = {
  pains: PainPoint[];
  values: Pick<CalculatorInputs, 'cloudSpendMonthly' | 'manualHoursWeekly' | 'forecastErrorPercent'>;
  errors: Partial<Record<'cloudSpendMonthly' | 'manualHoursWeekly', string>>;
  onTogglePain: (pain: PainPoint) => void;
  onChange: (values: Partial<CalculatorInputs>) => void;
};

const painOptions: Array<{ value: PainPoint; label: string; helper: string }> = [
  {
    value: 'cloud-costs',
    label: 'Reducir costes cloud',
    helper: 'Optimiza AWS/GCP/Azure sin sacrificar performance',
  },
  {
    value: 'manual-processes',
    label: 'Reducir procesos manuales',
    helper: 'Automatiza tareas repetitivas de operaciones y reporting',
  },
  {
    value: 'forecasting',
    label: 'Forecasting / planificación',
    helper: 'Mejor precisión en demanda, supply y cashflow',
  },
  {
    value: 'inventory',
    label: 'Inventario y roturas',
    helper: 'Menos stock muerto, menos roturas de stock',
  },
];

export function Step2Pains({ pains, values, errors, onTogglePain, onChange }: Step2PainsProps) {
  const handleNumberChange =
    (field: keyof Pick<CalculatorInputs, 'cloudSpendMonthly' | 'manualHoursWeekly' | 'forecastErrorPercent'>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? undefined : Number(e.target.value);
      onChange({ [field]: value } as Partial<CalculatorInputs>);
    };

  return (
    <div className="space-y-6">
      <p className="text-slate-600">Selecciona los dolores más relevantes y añade datos si aplica.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {painOptions.map((option) => {
          const isActive = pains.includes(option.value);
          return (
            <div
              key={option.value}
              className={cn(
                'relative flex flex-col gap-2 rounded-xl border p-4 shadow-sm transition hover:shadow-md',
                isActive ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  id={`pain-${option.value}`}
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={isActive}
                  onChange={() => onTogglePain(option.value)}
                />
                <label className="space-y-1 cursor-pointer" htmlFor={`pain-${option.value}`}>
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-600">{option.helper}</p>
                </label>
              </div>

              {option.value === 'cloud-costs' && isActive && (
                <div className="space-y-2 rounded-lg bg-white p-3">
                  <label htmlFor="cloudSpendMonthly" className="text-sm font-medium text-slate-800">
                    Gasto mensual en cloud (€)
                  </label>
                  <input
                    id="cloudSpendMonthly"
                    type="number"
                    inputMode="decimal"
                    min={100}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={values.cloudSpendMonthly ?? ''}
                    onChange={handleNumberChange('cloudSpendMonthly')}
                    placeholder="Ej. 8500"
                  />
                  {errors.cloudSpendMonthly && (
                    <p className="text-sm font-medium text-red-600">{errors.cloudSpendMonthly}</p>
                  )}
                </div>
              )}

              {option.value === 'manual-processes' && isActive && (
                <div className="space-y-2 rounded-lg bg-white p-3">
                  <label htmlFor="manualHoursWeekly" className="text-sm font-medium text-slate-800">
                    Horas manuales a la semana
                  </label>
                  <input
                    id="manualHoursWeekly"
                    type="number"
                    inputMode="decimal"
                    min={1}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={values.manualHoursWeekly ?? ''}
                    onChange={handleNumberChange('manualHoursWeekly')}
                    placeholder="Ej. 20"
                  />
                  {errors.manualHoursWeekly && (
                    <p className="text-sm font-medium text-red-600">{errors.manualHoursWeekly}</p>
                  )}
                </div>
              )}

              {option.value === 'forecasting' && isActive && (
                <div className="space-y-2 rounded-lg bg-white p-3">
                  <label htmlFor="forecastErrorPercent" className="text-sm font-medium text-slate-800">
                    Error de forecast (%)
                  </label>
                  <input
                    id="forecastErrorPercent"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={values.forecastErrorPercent ?? ''}
                    onChange={handleNumberChange('forecastErrorPercent')}
                    placeholder="Ej. 18"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
