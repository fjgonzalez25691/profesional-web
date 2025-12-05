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
