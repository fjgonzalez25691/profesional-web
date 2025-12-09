import Image from 'next/image';
import { TECH_STACK_MVP } from '@/data/tech-stack';

type TechBadgeProps = {
  name: string;
  purpose: string;
};

function TechBadge({ name, purpose }: TechBadgeProps) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-sm font-semibold text-slate-900">{name}</span>
      <span className="text-xs text-slate-500">{purpose}</span>
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
      className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Stack Tecnológico Transparente
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Esta web es un caso de estudio. Tecnologías modernas, 0 legacy, deploy automático.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-4xl">
          <Image
            src="/diagrams/tech-stack.svg"
            alt="Diagrama arquitectura tech stack: Frontend (Next.js, React, TypeScript), Backend (API Routes, Postgres, Groq), Infraestructura (Vercel, GitHub Actions, Vercel Cron), Analytics (Vercel Analytics, Postgres Logs)"
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
