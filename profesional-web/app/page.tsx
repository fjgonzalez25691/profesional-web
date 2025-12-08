"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import CaseGrid from "@/components/CaseGrid";
import CalendlyModal from "@/components/CalendlyModal";
import FloatingCalendlyButton from "@/components/FloatingCalendlyButton";
import { ChatbotWidget } from "@/components/Chatbot";
import MethodologySection from "@/components/MethodologySection";

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
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const desktopFabRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

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

  // Mostrar FAB de Calendly y botón flotante de chatbot solo tras 25% de scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || body.scrollHeight || 1;
      const clientHeight = doc.clientHeight || window.innerHeight || 1;
      const maxScrollable = scrollHeight - clientHeight;
      const percent = maxScrollable > 0 ? (scrollTop / maxScrollable) * 100 : 0;
      setShowFloatingCTA(percent > 30);
      setShowFloatingChat(percent > 30);
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

      <div ref={chatbotRef}>
        <ChatbotWidget visible={showFloatingChat} />
      </div>
    </main>
  );
}
