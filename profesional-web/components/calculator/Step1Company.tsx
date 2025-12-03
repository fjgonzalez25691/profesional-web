import type { CalculatorInputs, CompanySize, Sector } from '@/lib/calculator/types';
import { cn } from '@/lib/utils';

type Step1CompanyProps = {
  companySize: CompanySize;
  sector: Sector;
  onChange: (values: Partial<CalculatorInputs>) => void;
};

const sectorOptions: Array<{ value: Sector; label: string; helper: string }> = [
  { value: 'industrial', label: 'Industrial', helper: 'Manufactura, plantas, fábricas' },
  { value: 'logistica', label: 'Logística', helper: 'Transporte, última milla, almacenes' },
  { value: 'agencia', label: 'Agencia Marketing', helper: 'Agencias creativas y performance' },
  { value: 'farmaceutica', label: 'Farmacéutica', helper: 'Regulación, calidad, supply' },
  { value: 'retail', label: 'Retail', helper: 'Omnicanal, inventario, tiendas' },
  { value: 'otro', label: 'Otro', helper: 'Software, servicios profesionales, etc.' },
];

const sizeOptions: Array<{ value: CompanySize; label: string }> = [
  { value: '5-10M', label: '5-10M' },
  { value: '10-25M', label: '10-25M' },
  { value: '25-50M', label: '25-50M' },
  { value: '50M+', label: '50M+' },
];

export function Step1Company({ companySize, sector, onChange }: Step1CompanyProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Sector</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {sectorOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`sector-${option.value}`}
              className={cn(
                'cursor-pointer rounded-xl border p-4 shadow-sm transition hover:shadow-md',
                sector === option.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
              )}
            >
              <div className="flex items-center gap-3">
                <input
                  id={`sector-${option.value}`}
                  type="radio"
                  name="sector"
                  value={option.value}
                  className="h-4 w-4"
                  checked={sector === option.value}
                  onChange={() => onChange({ sector: option.value })}
                />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-600">{option.helper}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Tamaño de empresa</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {sizeOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`size-${option.value}`}
              className={cn(
                'cursor-pointer rounded-xl border p-4 text-center shadow-sm transition hover:shadow-md',
                companySize === option.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
              )}
            >
              <input
                id={`size-${option.value}`}
                type="radio"
                name="companySize"
                value={option.value}
                className="sr-only"
                checked={companySize === option.value}
                onChange={() => onChange({ companySize: option.value })}
              />
              <p className="text-base font-semibold text-slate-900">{option.label}</p>
              <p className="mt-1 text-xs text-slate-600">Facturación anual</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
