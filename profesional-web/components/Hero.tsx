import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroProps {
  headline: string;
  subtitle: string;
  ctaText: string;
  badgeText: string;
  onCtaClick?: () => void;
}

export default function Hero({
  headline,
  subtitle,
  ctaText,
  badgeText,
  onCtaClick,
}: HeroProps) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-center md:min-h-screen md:flex-row md:text-left lg:px-24">
      {/* Content Container */}
      <div className="z-10 flex max-w-3xl flex-col items-center gap-6 md:items-start md:w-1/2">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
          <span className="mr-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
          {badgeText}
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
          {subtitle}
        </p>

        {/* Spacer for layout visual balance on desktop */}
        <div className="h-8 md:hidden"></div>
      </div>

      {/* Image Container */}
      <div className="relative mt-8 flex w-full max-w-md items-center justify-center md:mt-0 md:w-1/2 md:justify-end">
        <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-2xl bg-slate-200 shadow-2xl">
           <Image
            src="/hero-profile.webp" 
            alt="Hero profile - Francisco Javier González"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Floating CTA */}
      <button
        onClick={onCtaClick}
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-full",
          "bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-2xl active:scale-95",
          "md:bottom-10 md:left-auto md:right-10 md:translate-x-0"
        )}
      >
        {ctaText}
      </button>
    </section>
  );
}
