"use client";

import { RefObject } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FloatingCalendlyButtonProps {
  onClick: () => void;
  desktopRef?: RefObject<HTMLButtonElement | null>;
  mobileRef?: RefObject<HTMLButtonElement | null>;
  visible?: boolean;
}

export default function FloatingCalendlyButton({
  onClick,
  desktopRef,
  mobileRef,
  visible = true,
}: FloatingCalendlyButtonProps) {
  const { track } = useAnalytics();

  if (!visible) {
    return null;
  }

  // Handler con tracking
  const handleClick = () => {
    track('cta_calendly_click', { cta_id: 'floating' });
    onClick();
  };

  // Handler para teclas Enter y Space (accessibility)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      track('cta_calendly_click', { cta_id: 'floating', method: 'keyboard' });
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
        aria-label="🗓️ Reserva 30 min"
        className="fixed top-6 right-6 z-50
                   hidden md:flex items-center gap-2
                   bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                   text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl
                   transition-all duration-300 ease-out font-bold text-sm
                   hover:scale-110 active:scale-95
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   border border-blue-500/20 backdrop-blur-sm"
        type="button"
      >
        <span className="font-bold">🗓️ Reserva 30 min</span>
      </button>

      {/* Mobile: Bottom-left icon only */}
      <button
        ref={mobileRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="🗓️ Reserva 30 min"
        className="fixed bottom-20 right-4 z-[90]
                   flex md:hidden items-center justify-center
                   h-12 w-12 rounded-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                   text-white shadow-xl hover:shadow-2xl
                   transition-all duration-300 ease-out
                   hover:scale-110 active:scale-95
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   border border-blue-500/20 backdrop-blur-sm"
        type="button"
      >
        <span aria-hidden className="text-xl">
          🗓️
        </span>
      </button>
    </>
  );
}
