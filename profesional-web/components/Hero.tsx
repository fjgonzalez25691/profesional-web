"use client";

import Image from "next/image";
import { ArrowRight, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

// Pain points data integrados en Hero
const painPoints = [
  {
    id: 1,
    text: "2-4 h/día introduciendo facturas/albaranes",
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

interface HeroProps {
  headline: string;
  subtitle: string;
  badgeText: string;
  onCtaClick?: () => void;
  onSecondaryCta?: () => void;
}

export default function Hero({
  headline,
  subtitle,
  badgeText,
  onCtaClick,
  onSecondaryCta,
}: HeroProps) {
  const { track } = useAnalytics();

  const handleCtaClick = () => {
    track("cta_calendly_click", { cta_id: "hero" });
    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden bg-surface-950 w-full py-16 md:py-20 text-center scroll-mt-24 md:text-left"
    >
      {/* Content Container */}
      <div className="z-10 flex w-full max-w-7xl flex-col items-center gap-6 md:gap-9 px-6 lg:px-8">
        {/* Fila superior: Texto + Foto */}
        <div className="w-full flex flex-col md:flex-row md:items-start gap-5 md:gap-7">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center gap-4 md:gap-5 md:w-7/12 md:items-start md:pr-6 lg:pr-10">
            {/* Badge/Support text */}
            <p className="max-w-2xl text-sm text-accent-sage font-medium leading-relaxed">
              {badgeText}
            </p>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
              {headline}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base md:text-lg text-text-secondary">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-3 md:mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleCtaClick}
                className="bg-accent-gold-500 text-primary-950 text-base md:text-lg font-semibold transition-all duration-300 hover:bg-accent-gold-400 hover:scale-105 focus:ring-2 focus:ring-accent-gold-400 focus:ring-offset-2 focus:ring-offset-surface-950"
              >
                Agendar diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {onSecondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onSecondaryCta}
                  className="border-accent-teal-500 text-accent-teal-500 transition-all duration-300 hover:bg-accent-teal-500/10 hover:scale-105 hover:border-accent-teal-400 focus:ring-2 focus:ring-accent-teal-500 focus:ring-offset-2 focus:ring-offset-surface-950 inline-flex items-center gap-2"
                >
                  <Bot className="h-5 w-5" aria-hidden />
                  Hablar con el asistente IA
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Image Container */}
          <div className="relative flex w-full items-center justify-center md:w-5/12 md:justify-end">
            <div className="relative aspect-square w-full max-w-[280px] md:max-w-[320px] overflow-hidden rounded-2xl bg-surface-900/50 shadow-2xl border border-surface-700">
              <Image
                src="/hero-profile.webp"
                alt="Hero profile - Francisco Javier Gonzalez"
                width={380}
                height={380}
                className="object-cover w-full h-full"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIWFRUVFRcYFRUVFRUVFRUVFhUXFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKAAoAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAMEBgcBAv/EADgQAAIBAwMCBAMGBgIDAAAAAAECAwAEEQUSITFBEyJRYXGBBhQykaGx8EJSscHh8RVDYnKC4TMk/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAIBAwQF/8QAKREAAgICAgIBBAIDAQAAAAAAAAICEQMhEjMEQRMiUWEUMkJxgZGx8P/aAAwDAQACEQMRAD8A9eqiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="
              />
            </div>
          </div>
        </div>

        {/* Pain Points integrados - Tarjeta grande debajo */}
        <div className="w-full mt-8 md:mt-10">
          <div className="bg-surface-900 rounded-xl p-6 md:p-8 shadow-lg border border-surface-800">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-text-primary">
              ¿Te pasa esto?
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {painPoints.map((point) => (
                <div
                  key={point.id}
                  data-testid="pain-point-item"
                  className="flex flex-col items-start gap-2.5 p-5 bg-surface-800 rounded-lg shadow-sm border border-surface-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-surface-600"
                >
                  <X
                    data-testid="pain-point-icon"
                    className="text-red-500 h-5 w-5 shrink-0"
                    aria-label="Problema"
                  />
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    {point.category}
                  </p>
                  <p className="text-base text-text-primary leading-relaxed">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
