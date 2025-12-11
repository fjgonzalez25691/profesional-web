import { X } from 'lucide-react';

// Datos hardcoded para Sprint 1 (sin CMS)
const painPoints = [
  {
    id: 1,
    text: "2-4 h/día picando facturas/albaranes",
    category: "Procesos manuales"
  },
  {
    id: 2,
    text: "AWS/Azure subió >30% sin explicación",
    category: "Factura cloud"
  },
  {
    id: 3,
    text: "Previsiones Excel fallan 20-30%",
    category: "Forecasting"
  }
];

export default function PainPoints() {
  return (
    <section className="bg-surface-900 py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Título de la sección */}
        <h2 className="text-3xl font-bold text-center mb-12 text-text-primary">
          ¿Te pasa esto?
        </h2>

        {/* Grid de pain points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painPoints.map((point) => (
            <div
              key={point.id}
              data-testid="pain-point-item"
              className="flex flex-col items-start gap-3 p-6 bg-surface-800 rounded-lg shadow-sm border border-surface-700"
            >
              {/* Icono X en rojo */}
              <X
                data-testid="pain-point-icon"
                className="text-red-500 h-6 w-6 shrink-0"
                aria-label="Problema"
              />

              {/* Categoría */}
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                {point.category}
              </p>

              {/* Texto del dolor cuantificado */}
              <p className="text-lg text-text-primary leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
