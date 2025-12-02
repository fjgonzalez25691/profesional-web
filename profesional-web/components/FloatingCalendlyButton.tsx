"use client";

import { RefObject } from 'react';
import { Calendar } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface FloatingCalendlyButtonProps {
  onClick: () => void;
  desktopRef?: RefObject<HTMLButtonElement | null>;
  mobileRef?: RefObject<HTMLButtonElement | null>;
}

export default function FloatingCalendlyButton({
  onClick,
  desktopRef,
  mobileRef,
}: FloatingCalendlyButtonProps) {
  // Handler con tracking
  const handleClick = () => {
    trackEvent('calendly_fab_click');
    onClick();
  };

  // Handler para teclas Enter y Space (accessibility)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trackEvent('calendly_fab_click', { method: 'keyboard' });
      onClick();
    }
  };

  return (
    <>
      {/* Desktop: Top-right sticky */}
      <button
        ref={desktopRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Agendar reunión"
        className="fixed top-6 right-6 z-50
                   hidden md:flex items-center gap-2
                   bg-primary text-primary-foreground
                   px-4 py-2 rounded-lg shadow-lg
                   transition-all duration-200
                   hover:scale-105 hover:shadow-xl
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                   active:scale-95"
        type="button"
      >
        <Calendar
          data-testid="calendar-icon-desktop"
          className="w-5 h-5"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">Diagnóstico 30 min</span>
      </button>

      {/* Mobile: Bottom-center */}
      <button
        ref={mobileRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Agendar reunión"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                   flex md:hidden items-center gap-2
                   bg-primary text-primary-foreground
                   px-6 py-3 rounded-full shadow-lg
                   transition-all duration-200
                   hover:scale-105 hover:shadow-xl
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                   active:scale-95"
        type="button"
      >
        <Calendar
          data-testid="calendar-icon-mobile"
          className="w-5 h-5"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">Diagnóstico 30 min</span>
      </button>
    </>
  );
}
