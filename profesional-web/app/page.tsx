const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-username/meeting";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16 sm:py-24">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-lg sm:p-12">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
            Sprint 1 · Tarjeta de visita P&L
          </p>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Arquitecto Cloud & IA para P&L
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Diagnósticos rápidos, decisiones claras y despliegues sin fricción. Next.js 16,
              TypeScript estricto y Neon PostgreSQL listos para producción.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agenda un diagnóstico
            </a>
            <span className="text-sm text-slate-200">
              Next.js 16 + TypeScript + Neon PostgreSQL
            </span>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Entrega técnica</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>✔️ App Router, linting y typecheck listos para CI.</li>
              <li>✔️ Vitest + Testing Library para UI y lógica.</li>
              <li>✔️ Configuración de entorno con plantilla `.env.example`.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Próximos pasos</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>➡️ Conectar Neon a casos de uso de ROI y agenda.</li>
              <li>➡️ Diseñar hero y CTA finales orientados a conversión.</li>
              <li>➡️ Activar pipeline de CI con build, lint y tests.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
