"use client";

import { useEffect } from 'react';
import { ArrowRight, TrendingUp, Clock, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASOS_MVP } from '@/data/cases';
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
    CASOS_MVP.forEach((caso) => {
      trackEvent('case_view', {
        case_id: caso.id,
        sector: caso.sector,
      });
    });
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Casos reales, resultados tangibles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No es teoría. Son soluciones implementadas en empresas reales con ROI medible.
          </p>
        </div>

        <div 
          data-testid="case-grid-container"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CASOS_MVP.map((caso) => (
            <Card key={caso.id} data-testid="case-card" className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{caso.sector}</Badge>
                  <span className="text-sm text-muted-foreground font-medium">{caso.company_size}</span>
                </div>
                <CardTitle className="text-xl mb-1 line-clamp-2 min-h-14">
                  {caso.pain}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  Solución: {caso.solution}
                </CardDescription>
                <p className="text-xs text-green-700 font-semibold mt-2">
                  Validado con CEO (email/contrato)
                </p>
              </CardHeader>
              
              <CardContent className="grow flex flex-col justify-between pt-0">
                <div className="bg-muted/30 rounded-lg p-4 my-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Banknote className="w-4 h-4" /> Inversión
                    </span>
                    <span className="font-semibold">{caso.investment}€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Ahorro Anual
                    </span>
                    <span className="font-bold text-green-700">{caso.savings_annual}€/año</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Payback
                    </span>
                    <span className="font-bold text-blue-700">{caso.payback_weeks} semanas</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full mt-2 group"
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
