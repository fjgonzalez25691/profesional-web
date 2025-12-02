"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import CalendlyModal from "@/components/CalendlyModal";
import FloatingCalendlyButton from "@/components/FloatingCalendlyButton";

export default function Home() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; source: 'hero' | 'fab' }>({
    isOpen: false,
    source: 'hero'
  });
  const desktopFabRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);

  const openModal = (source: 'hero' | 'fab') => {
    setModalState({ isOpen: true, source });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Restaurar el foco al FAB tras cerrar el modal (según breakpoint y origen)
  useEffect(() => {
    if (!modalState.isOpen && modalState.source === 'fab') {
      const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
      const targetRef = isDesktop ? desktopFabRef : mobileFabRef;
      targetRef.current?.focus();
    }
  }, [modalState.isOpen, modalState.source]);

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-start">
      <Hero
        headline="Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
        subtitle="Para empresas que quieren optimizar costes y ganar eficiencia"
        ctaText="Diagnóstico gratuito 30 min"
        badgeText="+37 años gestionando P&L"
        onCtaClick={() => openModal('hero')}
      />

      {/* Sección de dolores cuantificados */}
      <PainPoints />

      <CalendlyModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        source={modalState.source}
      />

      {/* Botón flotante para acceso rápido a Calendly */}
      <FloatingCalendlyButton
        onClick={() => openModal('fab')}
        desktopRef={desktopFabRef}
        mobileRef={mobileFabRef}
      />
    </main>
  );
}
