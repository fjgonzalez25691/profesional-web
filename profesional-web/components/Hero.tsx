import Image from "next/image";

interface HeroProps {
  headline: string;
  subtitle: string;
  badgeText: string;
}

export default function Hero({
  headline,
  subtitle,
  badgeText,
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
    </section>
  );
}
