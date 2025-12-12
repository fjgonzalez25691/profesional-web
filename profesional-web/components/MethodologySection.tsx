import { FileSearch, ListChecks, Users } from 'lucide-react';
import type { ReactNode } from 'react';

type Phase = {
  icon: ReactNode;
  title: string;
  duration: string;
  actions: string[];
  deliverable: string;
  badge?: string;
};

function PhaseCard({ icon, title, duration, actions, deliverable, badge }: Phase) {
  return (
    <div className="relative flex h-full flex-col rounded-xl border border-surface-700 bg-surface-900 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-teal-500/20 text-accent-teal-500">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary">{duration}</p>
          </div>
        </div>
        {badge ? (
          <span
            data-testid={badge === 'anti-camello' ? 'anti-camello-badge' : undefined}
            className="rounded-full border border-accent-gold-400/50 bg-accent-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-tight text-accent-gold-400"
          >
            {badge}
          </span>
        ) : null}
      </div>

      <ul className="my-4 space-y-2 text-sm text-text-secondary">
        {actions.map((action) => (
          <li key={action} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent-teal-500" aria-hidden />
            <span>{action}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-surface-700 pt-4">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Entregable: </span>
          {deliverable}
        </p>
      </div>
    </div>
  );
}

const phases: Phase[] = [
  {
    icon: <FileSearch className="h-6 w-6" aria-hidden />,
    title: 'Fase 1: Auditoría Express 48h',
    duration: '48 horas',
    actions: [
      'Análisis factura cloud (AWS/Azure/GCP)',
      'Detección procesos manuales > 5h/semana',
      'Forecasting actual vs óptimo',
    ],
    deliverable: 'Report 1 página con 3 quick wins',
  },
  {
    icon: <ListChecks className="h-6 w-6" aria-hidden />,
    title: 'Fase 2: Roadmap Priorizado ROI',
    duration: '1 semana',
    actions: [
      'Priorizamos por payback <6 meses',
      'Evitamos over-engineering ("anti-camello")',
      'Roadmap 90 días máximo',
    ],
    deliverable: 'Roadmap con inversión/ahorro cada item',
    badge: 'anti-camello',
  },
  {
    icon: <Users className="h-6 w-6" aria-hidden />,
    title: 'Fase 3: Implementación Supervisada',
    duration: '90 días',
    actions: [
      'Tu equipo ejecuta, yo superviso',
      'Revisiones semanales 1h',
      'Transferencia conocimiento incluida',
    ],
    deliverable: 'Garantía: Si no reduces >20% → no cobro',
  },
];

export default function MethodologySection() {
  return (
    <section
      id="methodology"
      aria-label="metodología"
      className="w-full bg-surface-950 py-16 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Cómo Trabajo: 3 Fases Enfocadas en P&L
          </h2>
          <p className="mx-auto max-w-3xl text-base text-text-secondary">
            Transparencia total: auditoría express, roadmap ROI anti-camello y supervisión con garantía
            de impacto en P&amp;L.
          </p>
        </div>

        <div className="relative">
          <div
            data-testid="methodology-timeline-desktop"
            className="pointer-events-none absolute left-4 right-4 top-10 hidden items-center justify-between md:flex"
            aria-hidden="true"
          >
            <div className="h-0.5 w-full bg-linear-to-r from-accent-teal-500 via-accent-gold-400 to-accent-sage" />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-surface-950 bg-accent-teal-500 shadow"
              style={{ left: '16.6%' }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-surface-950 bg-accent-gold-400 shadow"
              style={{ left: '50%' }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-surface-950 bg-accent-sage shadow"
              style={{ right: '16.6%' }}
            />
          </div>

          <div
            data-testid="methodology-timeline-mobile"
            className="pointer-events-none absolute left-4 top-6 bottom-6 w-0.5 bg-linear-to-b from-accent-teal-500 via-accent-gold-400 to-accent-sage md:hidden"
            aria-hidden
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {phases.map((phase) => (
              <div key={phase.title} className="relative">
                <div
                  className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-surface-950 bg-accent-teal-500 shadow md:hidden"
                  aria-hidden
                />
                <PhaseCard {...phase} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
