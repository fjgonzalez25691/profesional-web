import { Button } from "@/components/ui/button";

type CTAFinalProps = {
  onCtaClick: () => void;
};

export default function CTAFinal({ onCtaClick }: CTAFinalProps) {
  return (
    <section
      role="region"
      aria-label="Llamada a la acción final"
      className="relative w-full bg-surface-900 py-12 md:py-20"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Agenda un diagnóstico gratuito de 30 minutos. Sin compromiso. Identificamos dónde están los ahorros en Cloud, IA y automatización.
        </p>
        <Button
          onClick={onCtaClick}
          size="lg"
          className="bg-accent-gold-500 text-surface-950 hover:bg-accent-gold-600 font-bold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold-500"
        >
          Agenda tu diagnóstico gratuito
        </Button>
      </div>
    </section>
  );
}
