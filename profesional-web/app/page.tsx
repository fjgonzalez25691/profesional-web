"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import CaseGrid from "@/components/CaseGrid";
import CalendlyModal from "@/components/CalendlyModal";
import FloatingCalendlyButton from "@/components/FloatingCalendlyButton";

type ModalSource = 'hero' | 'fab' | 'case_grid';

type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_content?: string;
};

export default function Home() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; source: ModalSource; utmParams?: UtmParams }>({
    isOpen: false,
    source: 'hero'
  });
  const desktopFabRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);

  const openModal = (source: ModalSource, utmParams?: UtmParams) => {
    setModalState({ isOpen: true, source, utmParams });
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
        badgeText="+37 años gestionando P&L"
      />

      {/* Sección de dolores cuantificados */}
      <PainPoints />

      {/* Grid de casos de éxito con ROI */}
      <CaseGrid
        onCtaClick={(caseId, utmParams) => {
          openModal('case_grid', utmParams);
        }}
      />

      <CalendlyModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        source={modalState.source}
        utmParams={modalState.utmParams}
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
