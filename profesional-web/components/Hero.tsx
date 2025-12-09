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
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-center md:min-h-screen md:flex-row md:text-left lg:px-24">
      {/* Content Container */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center gap-6 md:w-7/12 md:max-w-2xl md:items-start md:pr-6 lg:w-3/5 lg:pr-10">
        {/* Badge/Support text */}
        <p className="max-w-2xl text-sm text-slate-500 font-medium leading-relaxed">
          {badgeText}
        </p>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleCtaClick}
            className="bg-blue-600 text-lg font-semibold hover:bg-blue-700"
          >
            Agendar diagnóstico
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {onSecondaryCta && (
            <Button
              size="lg"
              variant="outline"
              onClick={onSecondaryCta}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 inline-flex items-center gap-2"
            >
              <Bot className="h-5 w-5" aria-hidden />
              Hablar con el asistente IA
            </Button>
          )}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative mt-8 flex w-full max-w-md items-center justify-center md:mt-0 md:w-5/12 md:justify-end md:pl-6 lg:w-2/5 lg:pl-10">
        <div className="relative aspect-square w-full max-w-[340px] md:max-w-[380px] overflow-hidden rounded-2xl bg-slate-200 shadow-2xl">
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
    </section>
  );
}
