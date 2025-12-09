// calculatorConfig.ts

export type Sector =
  | 'industrial'
  | 'logistica'
  | 'agencia'
  | 'farmaceutica'
  | 'retail'
  | 'otro';

export type CompanySize = '5-10M' | '10-25M' | '25-50M' | '50M+';

export type PainId = 'cloud-costs' | 'manual-processes' | 'forecasting' | 'inventory';

export interface CompanySizeConfig {
  estimatedRevenue: number;      // € / año
  estimatedInventory: number;    // € valor medio inventario
  investmentMultiplier: number;  // factor para escalar inversión base
}

export interface InputRanges {
  cloudSpendMonthly: { min: number; max: number };
  manualHoursWeekly: { min: number; max: number };
  forecastErrorPercent: { min: number; max: number; extremeHigh: number };
}

export interface GlobalThresholds {
  minPaybackMonths: number;
  roi3yCapPercent: number;
  maxCloudToRevenueRatio: number;    // p.ej. 0.5 => 50% de la facturación
  maxInventorySavingsRatio: number;  // p.ej. 1.0 => 100% del inventario
  cloudRevenueWarningRatio: number;  // aviso cuando el gasto cloud es alto vs revenue
  forecastWarningThreshold: number;  // % a partir del cual el error de forecast dispara warning
  maxPainsSelected?: number;         // número máximo de dolores antes de forzar sesión
}

export interface CloudConfig {
  baseSavingsPercent: number; // sobre gasto cloud anual (DEPRECATED - usar progresivo)
  maxSavingsPercent: number;
  baseInvestment: number; // DEPRECATED - usar porcentaje sobre facturación
  investmentPercentBySize: Record<CompanySize, number>; // % de facturación para inversión cloud
}

export interface ManualConfig {
  hourlyCost: number;
  recoverableHoursFactor: number; // % de horas manuales recuperables (0.5 = 50%)
  baseInvestment: number;
}

export interface ForecastConfig {
  impactOnRevenuePercent: number; // % de revenue afectado por el forecast
  improvementRate: number;        // % de reducción del error (0.3 = 30%)
  baseInvestment: number;
}

export interface InventoryConfig {
  inventoryCostRate: number;      // coste anual % del inventario
  improvementRate: number;        // % mejora sobre ese coste
  baseInvestment: number;
}

export interface SectorPainWeights {
  [painId: string]: 'alta' | 'media' | 'baja';
}

export interface SectorConfig {
  painWeights: SectorPainWeights;
}

export interface ROIConfig {
  companySizes: Record<CompanySize, CompanySizeConfig>;
  inputs: InputRanges;
  thresholds: GlobalThresholds;
  pains: {
    cloud: CloudConfig;
    manual: ManualConfig;
    forecast: ForecastConfig;
    inventory: InventoryConfig;
  };
  sectors: Record<Sector, SectorConfig>;
}

export const roiConfig: ROIConfig = {
  companySizes: {
    '5-10M': {
      estimatedRevenue: 7_500_000,
      estimatedInventory: 400_000,
      investmentMultiplier: 1.0,
    },
    '10-25M': {
      estimatedRevenue: 17_500_000,
      estimatedInventory: 800_000,
      investmentMultiplier: 1.3,
    },
    '25-50M': {
      estimatedRevenue: 35_000_000,
      estimatedInventory: 1_500_000,
      investmentMultiplier: 1.6,
    },
    '50M+': {
      estimatedRevenue: 60_000_000,
      estimatedInventory: 3_000_000,
      investmentMultiplier: 2.0,
    },
  },

  inputs: {
    cloudSpendMonthly: { min: 500, max: 100_000 },
    manualHoursWeekly: { min: 5, max: 200 },
    forecastErrorPercent: { min: 5, max: 60, extremeHigh: 80 },
  },

  thresholds: {
    minPaybackMonths: 3,
    roi3yCapPercent: 80,          // si sale más, se capa visualmente o se trata como extremo
    maxCloudToRevenueRatio: 0.5,  // gasto cloud anual máx 50% revenue estimado
    maxInventorySavingsRatio: 1.0, // ahorro inventario anual <= 100% inventario
    cloudRevenueWarningRatio: 0.15, // FJG-94: warning suave si cloud >15% revenue (antes 0.2)
    forecastWarningThreshold: 50,  // warning si error forecast >= 50%
    maxPainsSelected: 1, // FJG-98: multi-dolor fuerza sesión personalizada
  },

  pains: {
    cloud: {
      baseSavingsPercent: 0.20,   // DEPRECATED - usar getCloudSavingsRate()
      maxSavingsPercent: 0.30,    // techo interno si algún cálculo escala
      baseInvestment: 15_000,     // DEPRECATED - usar investmentPercentBySize
      investmentPercentBySize: {
        '5-10M': 0.0030,   // 0.30% de facturación
        '10-25M': 0.0040,  // 0.40% de facturación
        '25-50M': 0.0050,  // 0.50% de facturación
        '50M+': 0.0060,    // 0.60% de facturación
      },
    },
    manual: {
      hourlyCost: 25,
      recoverableHoursFactor: 0.5, // 50% horas recuperables
      baseInvestment: 12_000,
    },
    forecast: {
      impactOnRevenuePercent: 0.05, // 5% revenue afectado
      improvementRate: 0.35,       // 35% mejora del error
      baseInvestment: 25_000,
    },
    inventory: {
      inventoryCostRate: 0.10,     // 10% coste anual del inventario
      improvementRate: 0.30,       // 30% mejora
      baseInvestment: 20_000,
    },
  },

  sectors: {
    industrial: {
      painWeights: {
        'cloud-costs': 'media',
        'manual-processes': 'media',
        forecasting: 'alta',
        inventory: 'alta',
      },
    },
    logistica: {
      painWeights: {
        'cloud-costs': 'media',
        'manual-processes': 'media',
        forecasting: 'alta',
        inventory: 'alta',
      },
    },
    retail: {
      painWeights: {
        'cloud-costs': 'media',
        'manual-processes': 'media',
        forecasting: 'alta',
        inventory: 'alta',
      },
    },
    agencia: {
      painWeights: {
        'cloud-costs': 'baja',
        'manual-processes': 'alta',
        forecasting: 'media',
        inventory: 'baja',
      },
    },
    farmaceutica: {
      painWeights: {
        'cloud-costs': 'media',
        'manual-processes': 'media',
        forecasting: 'alta',
        inventory: 'media',
      },
    },
    otro: {
      painWeights: {
        'cloud-costs': 'media',
        'manual-processes': 'media',
        forecasting: 'media',
        inventory: 'media',
      },
    },
  },
};
