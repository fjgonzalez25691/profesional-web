import { useMemo } from "react";

export default function LegalFooter() {
  const calendlyUrl = useMemo(
    () => process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com",
    [],
  );

  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
      <p className="leading-relaxed">
        💡 Ejemplos y cifras son orientativos según experiencias previas. Cada empresa es única y
        requiere un diagnóstico de 30 minutos para estimar resultados.
        <a
          className="ml-1 font-semibold text-blue-700 underline-offset-2 hover:underline"
          href={calendlyUrl}
          target="_blank"
          rel="noreferrer"
        >
          Agenda diagnóstico →
        </a>
      </p>
    </div>
  );
}
