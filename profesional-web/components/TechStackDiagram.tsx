import Image from 'next/image';
import { TECH_STACK_MVP } from '@/data/tech-stack';

type TechBadgeProps = {
  name: string;
  purpose: string;
};

function TechBadge({ name, purpose }: TechBadgeProps) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-surface-700 bg-surface-900 p-3 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-sm font-semibold text-text-primary">{name}</span>
      <span className="text-xs text-text-secondary">{purpose}</span>
    </div>
  );
}

export default function TechStackDiagram() {
  const badges = [
    ...TECH_STACK_MVP.frontend,
    ...TECH_STACK_MVP.backend,
    ...TECH_STACK_MVP.infra,
    ...TECH_STACK_MVP.analytics,
  ];

  return (
    <section
      id="tech-stack"
      aria-label="tech-stack"
      className="w-full bg-surface-950 py-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
            Stack Tecnológico Transparente
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-secondary">
            Esta web es un caso de estudio. Tecnologías modernas, 0 legacy, deploy automático.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-4xl">
          <Image
            src="/diagrams/tech-stack.svg"
            alt="Diagrama arquitectura tech stack: Frontend (Next.js, React, TypeScript), Backend (API Routes, Neon Postgres, Groq), Infraestructura (Vercel, GitHub Actions, Vercel Cron), Analytics (Vercel Analytics, Neon Logs)"
            width={1290}
            height={720}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {badges.map((tech) => (
            <TechBadge key={tech.name} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
