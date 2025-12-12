"use client";

import { useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASOS_VISIBLES } from '@/data/cases';
import { trackEvent } from '@/lib/analytics';

type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_content: string;
};

interface CaseGridProps {
  onCtaClick?: (caseId: string, utm: UtmParams) => void;
}

const UTM_SOURCE = 'web';
const UTM_MEDIUM = 'case_grid';

export default function CaseGrid({ onCtaClick }: CaseGridProps) {
  useEffect(() => {
    CASOS_VISIBLES.forEach((caso) => {
      trackEvent('case_view', {
        case_id: caso.id,
        sector: caso.sector,
      });
    });
  }, []);

  return (
    <section id="cases" className="w-full py-20 bg-surface-950 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-text-primary">
            Casos reales, resultados tangibles
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No es teoría. Son soluciones implementadas en empresas reales con ROI medible.
          </p>
        </div>

        <div 
          data-testid="case-grid-container"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CASOS_VISIBLES.map((caso) => (
            <Card key={caso.id} data-testid={`case-card-${caso.id}`} className="flex flex-col h-full bg-surface-900 border-surface-700 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary-500/20 text-primary-400 border-primary-500/30">{caso.sector}</Badge>
                  <span className="text-sm text-text-secondary font-medium">{caso.company_size}</span>
                </div>
                <CardTitle className="text-xl mb-1 line-clamp-2 min-h-14 text-text-primary">
                  {caso.pain}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-10 text-text-secondary">
                  Solución: {caso.solution}
                </CardDescription>
                <p className="text-xs text-accent-sage font-semibold mt-2">
                  Validado con CEO (email/contrato)
                </p>
              </CardHeader>
              
              <CardContent className="grow flex flex-col justify-between pt-0">
                <div className="bg-surface-800/30 rounded-lg p-4 my-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 mt-0.5 text-accent-teal-500 shrink-0" />
                    <div className="space-y-1">
                      <span className="text-accent-teal-500 font-medium">Impacto en el trabajo</span>
                      <p className="font-bold text-text-primary">{caso.impact_time}</p>
                      <p className="text-text-secondary text-xs">{caso.impact_detail}</p>
                      <p className="text-accent-teal-400 font-bold text-sm mt-2">
                        Payback del proyecto: {caso.payback_weeks} semanas
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full mt-2 group bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => {
                    const utmParams: UtmParams = {
                      utm_source: UTM_SOURCE,
                      utm_medium: UTM_MEDIUM,
                      utm_content: caso.id,
                    };

                    trackEvent('case_cta_click', {
                      case_id: caso.id,
                      sector: caso.sector,
                      ...utmParams,
                    });

                    onCtaClick?.(caso.id, utmParams);
                  }}
                >
                  Ver detalles 
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
