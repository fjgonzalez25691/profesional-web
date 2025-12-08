import fs from 'node:fs';
import path from 'node:path';
import { roiConfig } from '@/components/calculator/calculatorConfig';
import { calculateROI, ROI_CAP_PERCENT } from '@/lib/calculator/calculateROI';
import { getCalculatorWarnings, validateCalculatorInputs } from '@/lib/calculator/validation';
import type {
  CalculatorInputs,
  CalculatorWarning,
  CompanySize,
  PainPoint,
  Sector,
  ROICalculationResult,
} from '@/lib/calculator/types';
import { isROISuccess } from '@/lib/calculator/types';

type ValidationStatus = 'pass' | 'fail' | 'fallback';

export type ValidationFlags =
  | 'roi_cap'
  | 'payback_below_min'
  | 'savings_over_revenue'
  | 'savings_over_inventory'
  | 'cloud_ratio_high'
  | 'forecast_warning';

export interface ValidationCase {
  id: string;
  inputs: CalculatorInputs & {
    cloudSpendMonthly?: number;
    manualHoursWeekly?: number;
    forecastErrorPercent?: number;
  };
  result: ROICalculationResult;
  warnings: CalculatorWarning[];
  errors: string[];
  flags: ValidationFlags[];
  ratios: {
    cloudToRevenue?: number;
    savingsToRevenue: number;
    savingsToInventory: number;
  };
  status: ValidationStatus;
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface ValidationSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  fallbackTests: number;
  extremesCount: number;
  flags: Record<ValidationFlags, number>;
  warnings: Record<string, number>;
  averages: {
    roi3Years: number;
    paybackMonths: number;
    savingsAnnual: number;
  };
}

export interface ValidationReport {
  metadata: {
    timestamp: string;
    sourceFile: string;
    thresholds: {
      minPaybackMonths: number;
      maxCloudToRevenueRatio: number;
      cloudRevenueWarningRatio: number;
      forecastWarningThreshold: number;
      roiCapPercent: number;
    };
    inputs: {
      cloudSpendMonthly: { min: number; max: number };
      manualHoursWeekly: { min: number; max: number };
      forecastErrorPercent: { min: number; max: number; extremeHigh: number };
    };
  };
  summary: ValidationSummary;
  validations: ValidationCase[];
  extremes: ValidationCase[];
}

const painsSets: PainPoint[][] = [
  ['cloud-costs'],
  ['manual-processes'],
  ['forecasting'],
  ['inventory'],
  ['cloud-costs', 'manual-processes'],
  ['cloud-costs', 'forecasting'],
  ['manual-processes', 'forecasting'],
  ['cloud-costs', 'manual-processes', 'forecasting'],
  ['cloud-costs', 'manual-processes', 'forecasting', 'inventory'],
];

function buildValueGrid() {
  const { cloudSpendMonthly, manualHoursWeekly, forecastErrorPercent } = roiConfig.inputs;

  const cloudValues = [
    cloudSpendMonthly.min,
    Math.round(cloudSpendMonthly.min * 4),
    Math.round(cloudSpendMonthly.max * 0.25),
    Math.round(cloudSpendMonthly.max * 0.6),
    cloudSpendMonthly.max,
  ];

  const manualValues = [
    manualHoursWeekly.min,
    Math.round(manualHoursWeekly.max * 0.1),
    Math.round(manualHoursWeekly.max * 0.25),
    Math.round(manualHoursWeekly.max * 0.5),
    manualHoursWeekly.max,
  ];

  const forecastValues = [
    forecastErrorPercent.min,
    Math.round((forecastErrorPercent.min + forecastErrorPercent.max) / 3),
    Math.round(forecastErrorPercent.max * 0.5),
    forecastErrorPercent.max,
    forecastErrorPercent.extremeHigh,
  ];

  return { cloudValues, manualValues, forecastValues };
}

function generateTestInputs(): CalculatorInputs[] {
  const companySizes = Object.keys(roiConfig.companySizes) as CompanySize[];
  const sectors = Object.keys(roiConfig.sectors) as Sector[];
  const { cloudValues, manualValues, forecastValues } = buildValueGrid();

  const inputs: CalculatorInputs[] = [];

  companySizes.forEach((companySize) => {
    sectors.forEach((sector) => {
      painsSets.forEach((pains, painsIndex) => {
        for (let i = 0; i < cloudValues.length; i += 1) {
          const cloudValue = cloudValues[i];
          const manualValue = manualValues[(i + painsIndex) % manualValues.length];
          const forecastValue = forecastValues[(i + painsIndex) % forecastValues.length];

          inputs.push({
            companySize,
            sector,
            pains,
            cloudSpendMonthly: pains.includes('cloud-costs') ? cloudValue : undefined,
            manualHoursWeekly: pains.includes('manual-processes') ? manualValue : undefined,
            forecastErrorPercent: pains.includes('forecasting') ? forecastValue : undefined,
          });
        }
      });
    });
  });

  // Casos de estrés con máximos para forzar escenarios extremos
  companySizes.forEach((companySize) => {
    inputs.push({
      companySize,
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting', 'inventory'],
      cloudSpendMonthly: roiConfig.inputs.cloudSpendMonthly.max,
      manualHoursWeekly: roiConfig.inputs.manualHoursWeekly.max,
      forecastErrorPercent: roiConfig.inputs.forecastErrorPercent.extremeHigh,
    });
  });

  return inputs;
}

function collectWarningsAndErrors(calculatorInputs: CalculatorInputs) {
  const errorsObject = validateCalculatorInputs(calculatorInputs);
  const errors = Object.values(errorsObject).filter(Boolean) as string[];
  const result = calculateROI(calculatorInputs);

  // Solo obtener warnings si el resultado es success
  const warnings = isROISuccess(result)
    ? getCalculatorWarnings(calculatorInputs, result)
    : [];

  return { result, warnings, errors };
}

function detectFlags(calculatorInputs: CalculatorInputs, result: ROICalculationResult): {
  flags: ValidationFlags[];
  ratios: ValidationCase['ratios'];
} {
  const flags: ValidationFlags[] = [];
  const companyConfig = roiConfig.companySizes[calculatorInputs.companySize];

  // Si es fallback, no calcular flags
  if (!isROISuccess(result)) {
    return {
      flags: [],
      ratios: {
        cloudToRevenue: undefined,
        savingsToRevenue: 0,
        savingsToInventory: 0,
      },
    };
  }

  const savingsToRevenue = companyConfig.estimatedRevenue
    ? result.savingsAnnual / companyConfig.estimatedRevenue
    : 0;
  const savingsToInventory = companyConfig.estimatedInventory
    ? result.savingsAnnual / companyConfig.estimatedInventory
    : 0;

  if (result.roi3Years >= ROI_CAP_PERCENT) {
    flags.push('roi_cap');
  }

  if (result.paybackMonths > 0 && result.paybackMonths < roiConfig.thresholds.minPaybackMonths) {
    flags.push('payback_below_min');
  }

  if (savingsToRevenue > 1) {
    flags.push('savings_over_revenue');
  }

  if (savingsToInventory > 1) {
    flags.push('savings_over_inventory');
  }

  let cloudToRevenue: number | undefined;
  if (calculatorInputs.cloudSpendMonthly) {
    const annualCloud = calculatorInputs.cloudSpendMonthly * 12;
    cloudToRevenue = annualCloud / companyConfig.estimatedRevenue;
    if (cloudToRevenue > roiConfig.thresholds.maxCloudToRevenueRatio) {
      flags.push('cloud_ratio_high');
    }
  }

  if (
    calculatorInputs.forecastErrorPercent !== undefined &&
    calculatorInputs.forecastErrorPercent >= roiConfig.thresholds.forecastWarningThreshold
  ) {
    flags.push('forecast_warning');
  }

  return {
    flags,
    ratios: {
      cloudToRevenue,
      savingsToRevenue,
      savingsToInventory,
    },
  };
}

export function buildValidationReport(): ValidationReport {
  const combinations = generateTestInputs();
  const validations: ValidationCase[] = combinations.map((input, index) => {
    const { result, warnings, errors } = collectWarningsAndErrors(input);
    const { flags, ratios } = detectFlags(input, result);

    const isFallback = !isROISuccess(result);
    const fallbackReason = isFallback ? result.reason : undefined;

    // FJG-85: Determinar status - fallback es un estado separado de fail
    let status: 'pass' | 'fail' | 'fallback';
    if (errors.length > 0) {
      status = 'fail';
    } else if (isFallback) {
      status = 'fallback';
    } else {
      status = 'pass';
    }

    return {
      id: `case-${index + 1}`,
      inputs: input,
      result,
      warnings,
      errors,
      flags,
      ratios,
      status,
      isFallback,
      fallbackReason,
    };
  });

  const extremes = validations.filter((v) => v.flags.length > 0);

  const flagsCounts = validations.reduce((acc, validation) => {
    validation.flags.forEach((flag) => {
      acc[flag] = (acc[flag] || 0) + 1;
    });
    return acc;
  }, {} as Record<ValidationFlags, number>);

  // Initialize missing flags to 0 for consistency
  (['roi_cap', 'payback_below_min', 'savings_over_revenue', 'savings_over_inventory', 'cloud_ratio_high', 'forecast_warning'] as ValidationFlags[]).forEach(
    (flag) => {
      if (flagsCounts[flag] === undefined) {
        flagsCounts[flag] = 0;
      }
    }
  );

  const warningsCounts = validations.reduce((acc, validation) => {
    validation.warnings.forEach((warning) => {
      acc[warning.type] = (acc[warning.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const totals = validations.reduce(
    (acc, validation) => {
      // Solo sumar si es success (tiene valores numéricos)
      if (isROISuccess(validation.result)) {
        acc.roi3Years += validation.result.roi3Years;
        acc.paybackMonths += validation.result.paybackMonths;
        acc.savingsAnnual += validation.result.savingsAnnual;
      }
      return acc;
    },
    { roi3Years: 0, paybackMonths: 0, savingsAnnual: 0 }
  );

  const summary: ValidationSummary = {
    totalTests: validations.length,
    passedTests: validations.filter((v) => v.status === 'pass').length,
    failedTests: validations.filter((v) => v.status === 'fail').length,
    fallbackTests: validations.filter((v) => v.status === 'fallback').length,
    extremesCount: extremes.length,
    flags: flagsCounts,
    warnings: warningsCounts,
    averages: {
      roi3Years: Math.round(totals.roi3Years / validations.length),
      paybackMonths: parseFloat((totals.paybackMonths / validations.length).toFixed(1)),
      savingsAnnual: Math.round(totals.savingsAnnual / validations.length),
    },
  };

  return {
    metadata: {
      timestamp: new Date().toISOString(),
      sourceFile: 'scripts/validate-roi-v2.ts',
      thresholds: {
        minPaybackMonths: roiConfig.thresholds.minPaybackMonths,
        maxCloudToRevenueRatio: roiConfig.thresholds.maxCloudToRevenueRatio,
        cloudRevenueWarningRatio: roiConfig.thresholds.cloudRevenueWarningRatio,
        forecastWarningThreshold: roiConfig.thresholds.forecastWarningThreshold,
        roiCapPercent: ROI_CAP_PERCENT,
      },
      inputs: {
        cloudSpendMonthly: roiConfig.inputs.cloudSpendMonthly,
        manualHoursWeekly: roiConfig.inputs.manualHoursWeekly,
        forecastErrorPercent: roiConfig.inputs.forecastErrorPercent,
      },
    },
    summary,
    validations,
    extremes,
  };
}

function toCsv(cases: ValidationCase[]): string {
  const header = [
    'id',
    'companySize',
    'sector',
    'pains',
    'cloudSpendMonthly',
    'manualHoursWeekly',
    'forecastErrorPercent',
    'roi3Years',
    'paybackMonths',
    'savingsAnnual',
    'investment',
    'flags',
    'warnings',
    'cloudToRevenue',
    'savingsToRevenue',
    'savingsToInventory',
  ];

  const rows = cases.map((c) => {
    const result = isROISuccess(c.result) ? c.result : null;
    return [
      c.id,
      c.inputs.companySize,
      c.inputs.sector,
      c.inputs.pains.join('+'),
      c.inputs.cloudSpendMonthly ?? '',
      c.inputs.manualHoursWeekly ?? '',
      c.inputs.forecastErrorPercent ?? '',
      result?.roi3Years ?? 'FALLBACK',
      result?.paybackMonths ?? 'FALLBACK',
      result?.savingsAnnual ?? 'FALLBACK',
      result?.investment ?? 'FALLBACK',
      c.flags.join('|'),
      c.warnings.map((w) => w.type).join('|'),
      c.ratios.cloudToRevenue?.toFixed(2) ?? '',
      c.ratios.savingsToRevenue.toFixed(2),
      c.ratios.savingsToInventory.toFixed(2),
    ];
  });

  return [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

function writeReports(report: ValidationReport) {
  const timestamp = report.metadata.timestamp.replace(/[:.]/g, '-');
  const outputDir = path.join(process.cwd(), 'scripts');
  const jsonPath = path.join(outputDir, `validation-results-${timestamp}.json`);
  const csvPath = path.join(outputDir, `validation-extremes-${timestamp}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  fs.writeFileSync(csvPath, toCsv(report.extremes), 'utf-8');

  return { jsonPath, csvPath };
}

export function runMassiveValidation() {
  const report = buildValidationReport();
  const { jsonPath, csvPath } = writeReports(report);

  // Resumen en consola
  console.log('🚀 Validación masiva ROI v2 completada');
  console.log(`Total tests: ${report.summary.totalTests}`);
  console.log(`Extremos: ${report.summary.extremesCount}`);
  console.log(`ROI medio 3y: ${report.summary.averages.roi3Years}%`);
  console.log(`Payback medio: ${report.summary.averages.paybackMonths} meses`);
  console.log('Flags principales:', report.summary.flags);
  console.log(`JSON: ${jsonPath}`);
  console.log(`CSV extremos: ${csvPath}`);

  return { report, jsonPath, csvPath };
}

if (require.main === module) {
  runMassiveValidation();
}
