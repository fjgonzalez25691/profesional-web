"use client";

import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

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
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-surface-950 w-full py-12 text-center scroll-mt-24 md:min-h-screen md:flex-row md:text-left"
    >
      {/* Content Container */}
      <div className="z-10 flex w-full max-w-7xl flex-col items-center gap-6 px-6 lg:px-8 md:flex-row md:items-start">
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-center gap-6 md:w-7/12 md:items-start md:pr-6 lg:pr-10">
          {/* Badge/Support text */}
          <p className="max-w-2xl text-sm text-accent-sage font-medium leading-relaxed">
            {badgeText}
          </p>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
            {headline}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-text-secondary md:text-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={handleCtaClick}
              className="bg-accent-gold-500 text-primary-950 text-lg font-semibold hover:bg-accent-gold-400"
            >
              Agendar diagnóstico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {onSecondaryCta && (
              <Button
                size="lg"
                variant="outline"
                onClick={onSecondaryCta}
                className="border-accent-teal-500 text-accent-teal-500 hover:bg-accent-teal-500/10 inline-flex items-center gap-2"
              >
                <Bot className="h-5 w-5" aria-hidden />
                Hablar con el asistente IA
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Image Container */}
        <div className="relative mt-8 flex w-full items-center justify-center md:mt-0 md:w-5/12 md:justify-end">
          <div className="relative aspect-square w-full max-w-[340px] md:max-w-[380px] overflow-hidden rounded-2xl bg-surface-900/50 shadow-2xl border border-surface-700">
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
    </section>
  );
}
