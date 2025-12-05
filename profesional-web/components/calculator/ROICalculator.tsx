"use client";

import { useMemo, useState } from 'react';
import { Step1Company } from '@/components/calculator/Step1Company';
import { Step2Pains } from '@/components/calculator/Step2Pains';
import { Step3Results } from '@/components/calculator/Step3Results';
import { Button } from '@/components/ui/button';
import { calculateROI, getRevenueFromSize } from '@/lib/calculator/calculateROI';
import type { CalculatorInputs, PainPoint } from '@/lib/calculator/types';
import { cn } from '@/lib/utils';

type WizardStep = 1 | 2 | 3;

const CLOUD_MIN = 100;
const CLOUD_MAX = 300_000;
const CLOUD_REVENUE_RATIO = 0.4; // 40% máximo de facturación estimada
const MANUAL_MIN = 1;
const MANUAL_MAX = 168; // 7 días * 24h

const initialInputs: CalculatorInputs = {
  companySize: '10-25M',
  sector: 'agencia',
  pains: [],
  cloudSpendMonthly: undefined,
  manualHoursWeekly: undefined,
  forecastErrorPercent: undefined,
};

export default function ROICalculator() {
  const [step, setStep] = useState<WizardStep>(1);
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [errors, setErrors] = useState<Partial<Record<'cloudSpendMonthly' | 'manualHoursWeekly', string>>>({});
  const [email, setEmail] = useState('');

  const updateInputs = (values: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...values }));
  };

  const togglePain = (pain: PainPoint) => {
    const isActive = inputs.pains.includes(pain);

    setInputs((prev) => {
      const updatedPains = isActive ? prev.pains.filter((p) => p !== pain) : [...prev.pains, pain];
      const cleanup: Partial<CalculatorInputs> = {};

      if (isActive && pain === 'cloud-costs') {
        cleanup.cloudSpendMonthly = undefined;
      }
      if (isActive && pain === 'manual-processes') {
        cleanup.manualHoursWeekly = undefined;
      }

      return { ...prev, pains: updatedPains, ...cleanup };
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...(pain === 'cloud-costs' ? { cloudSpendMonthly: undefined } : {}),
      ...(pain === 'manual-processes' ? { manualHoursWeekly: undefined } : {}),
    }));
  };

  const isMissingValue = (value: number | undefined) => value === undefined || Number.isNaN(value) || value <= 0;

  const validateStep2 = () => {
    const nextErrors: Partial<Record<'cloudSpendMonthly' | 'manualHoursWeekly', string>> = {};

    if (inputs.pains.includes('cloud-costs')) {
      const value = inputs.cloudSpendMonthly;
      if (isMissingValue(value)) {
        nextErrors.cloudSpendMonthly = 'Campo requerido';
      } else {
        if (value < CLOUD_MIN || value > CLOUD_MAX) {
          nextErrors.cloudSpendMonthly = `El gasto cloud mensual debe estar entre ${CLOUD_MIN.toLocaleString('es-ES')}€ y ${CLOUD_MAX.toLocaleString('es-ES')}€`;
        } else {
          const annualCloud = value * 12;
          const estimatedRevenue = getRevenueFromSize(inputs.companySize);
          const maxCloudAnnual = estimatedRevenue * CLOUD_REVENUE_RATIO;
          if (annualCloud > maxCloudAnnual) {
            nextErrors.cloudSpendMonthly = `El gasto cloud anual supera el ${(CLOUD_REVENUE_RATIO * 100).toFixed(0)}% de la facturación estimada`;
          }
        }
      }
    }

    if (inputs.pains.includes('manual-processes') && isMissingValue(inputs.manualHoursWeekly)) {
      nextErrors.manualHoursWeekly = 'Campo requerido';
    } else if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly !== undefined) {
      const value = inputs.manualHoursWeekly;
      if (value < MANUAL_MIN || value > MANUAL_MAX) {
        nextErrors.manualHoursWeekly = `Las horas manuales semanales deben estar entre ${MANUAL_MIN} y ${MANUAL_MAX}`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      const isValid = validateStep2();
      if (!isValid) return;
      setStep(3);
      return;
    }
  };

  const goBack = () => {
    setStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      return 1;
    });
  };

  const result = useMemo(() => calculateROI(inputs), [inputs]);

  const reset = () => {
    setStep(1);
    setInputs({ ...initialInputs, pains: [] });
    setErrors({});
    setEmail('');
  };

  const progressWidth = `${(step / 3) * 100}%`;

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-slate-50 p-6 shadow-lg md:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Calculadora ROI interactiva</p>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">3 pasos: datos, dolores, resultados</h2>
          <p className="text-sm text-slate-600">
            Calcula tu retorno potencial en menos de 2 minutos. Sin emails todavía (DoD S3).
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
        >
          Reiniciar
        </button>
      </div>

      <div aria-label="progress" className="h-2 w-full rounded-full bg-slate-200">
        <div
          className={cn('h-2 rounded-full bg-blue-600 transition-all')}
          style={{ width: progressWidth }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={(step / 3) * 100}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {step === 1 && (
          <Step1Company
            companySize={inputs.companySize}
            sector={inputs.sector}
            onChange={updateInputs}
          />
        )}

        {step === 2 && (
          <Step2Pains
            pains={inputs.pains}
            values={{
              cloudSpendMonthly: inputs.cloudSpendMonthly,
              manualHoursWeekly: inputs.manualHoursWeekly,
              forecastErrorPercent: inputs.forecastErrorPercent,
            }}
            errors={errors}
            onTogglePain={togglePain}
            onChange={updateInputs}
          />
        )}

        {step === 3 && (
          <Step3Results
            result={result}
            email={email}
            userData={{ sector: inputs.sector, companySize: inputs.companySize }}
            pains={inputs.pains}
            onEmailChange={setEmail}
          />
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={goBack}
            className="w-full sm:w-auto"
          >
            Anterior
          </Button>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {step < 3 && (
              <Button onClick={goNext} className="w-full sm:w-auto">
                Siguiente
              </Button>
            )}
            {step === 3 && (
              <Button onClick={reset} variant="default" className="w-full sm:w-auto">
                Nuevo cálculo
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
