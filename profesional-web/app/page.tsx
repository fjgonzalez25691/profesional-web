"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import CalendlyModal from "@/components/CalendlyModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-between">
      <Hero
        headline="Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
        subtitle="Para empresas que quieren optimizar costes y ganar eficiencia"
        ctaText="Diagnóstico gratuito 30 min"
        badgeText="+37 años gestionando P&L"
        onCtaClick={() => setIsModalOpen(true)}
      />
      <CalendlyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}

