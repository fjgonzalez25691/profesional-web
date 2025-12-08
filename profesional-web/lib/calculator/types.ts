export type CompanySize = '5-10M' | '10-25M' | '25-50M' | '50M+';
export type Sector =
  | 'industrial'
  | 'logistica'
  | 'agencia'
  | 'farmaceutica'
  | 'retail'
  | 'otro';

export type PainPoint = 'cloud-costs' | 'manual-processes' | 'forecasting' | 'inventory';

export interface CalculatorInputs {
  companySize: CompanySize;
  sector: Sector;
  pains: PainPoint[];
  cloudSpendMonthly?: number;
  manualHoursWeekly?: number;
  forecastErrorPercent?: number;
}

export interface ROIResult {
  investment: number;
  savingsAnnual: number;
  paybackMonths: number;
  roi3Years: number;
  inventorySavingsCapped?: boolean;
}

export interface ROISuccess {
  type: 'success';
  investment: number;
  savingsAnnual: number;
  paybackMonths: number;
  roi3Years: number;
  inventorySavingsCapped?: boolean;
}

export interface ROIFallback {
  type: 'fallback';
  reason: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range' | 'extreme_roi';
  message: string;
  recommendedAction: string;
}

export type ROICalculationResult = ROISuccess | ROIFallback;

export function isROISuccess(result: ROICalculationResult): result is ROISuccess {
  return result.type === 'success';
}

export function isROIFallback(result: ROICalculationResult): result is ROIFallback {
  return result.type === 'fallback';
}

export type CalculatorWarningType = 'cloud-coherence' | 'forecast-coherence' | 'roi-extreme';

export interface CalculatorWarning {
  type: CalculatorWarningType;
  message: string;
}
