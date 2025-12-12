"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import CaseGrid from "@/components/CaseGrid";
import CalendlyModal from "@/components/CalendlyModal";
import FloatingCalendlyButton from "@/components/FloatingCalendlyButton";
import MethodologySection from "@/components/MethodologySection";
import TechStackDiagram from "@/components/TechStackDiagram";

type ModalSource = 'hero' | 'fab' | 'case_grid' | 'header';

type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_content?: string;
};

const ChatbotWidget = dynamic(
  () => import("@/components/Chatbot").then((mod) => mod.ChatbotWidget),
  {
    ssr: false,
  }
);

export default function Home() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; source: ModalSource; utmParams?: UtmParams }>({
    isOpen: false,
    source: 'hero'
  });
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const desktopFabRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);

  const openModal = useCallback((source: ModalSource, utmParams?: UtmParams) => {
    setModalState({ isOpen: true, source, utmParams });
  }, []);

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

  useEffect(() => {
    const handleOpenCalendly = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: ModalSource; utmParams?: UtmParams }>).detail;
      openModal(detail?.source ?? 'header', detail?.utmParams);
    };

    window.addEventListener('open-calendly', handleOpenCalendly as EventListener);
    return () => window.removeEventListener('open-calendly', handleOpenCalendly as EventListener);
  }, [openModal]);

  // Mostrar FAB de Calendly y botón flotante de chatbot cuando el Hero ya no está visible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const headerHeight = 80; // Altura aproximada del header sticky

      // Mostrar flotantes cuando el Hero sale completamente de la vista
      const shouldShow = heroBottom < headerHeight;
      setShowFloatingCTA(shouldShow);
      setShowFloatingChat(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-start">
      <Hero
        headline="Hago que tu negocio gane más y gaste menos usando IA, automatización y soluciones Cloud"
        subtitle="Menos costes, menos errores y más tiempo para lo importante."
        badgeText="+37 años dirigiendo operaciones y equipos en empresas reales. Ahora uso la tecnología para mejorar tus números, no para complicarte la vida."
        onCtaClick={() => openModal('hero')}
        onSecondaryCta={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-chatbot'));
          }
        }}
      />

      {/* Sección de dolores cuantificados */}
      <PainPoints />

      {/* Grid de casos de éxito con ROI */}
      <CaseGrid
        onCtaClick={(caseId, utmParams) => {
          openModal('case_grid', utmParams);
        }}
      />

      <MethodologySection />

      <TechStackDiagram />

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
        visible={showFloatingCTA}
      />

      <ChatbotWidget visible={showFloatingChat} />
    </main>
  );
}
