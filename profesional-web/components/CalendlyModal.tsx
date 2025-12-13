"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { InlineWidget } from "react-calendly";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
};

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'hero' | 'fab' | 'case_grid' | 'header'; // Para diferenciar origen del click
  onBookingComplete?: () => void; // Callback para cuando se complete el booking
  utmParams?: UtmParams;
}

export default function CalendlyModal({
  isOpen,
  onClose,
  source = 'hero',
  onBookingComplete,
  utmParams,
}: CalendlyModalProps) {
  const { track } = useAnalytics();
  const [mounted, setMounted] = useState(false);
  const prevIsOpenRef = useRef<boolean | null>(null);
  const calendlyBaseUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/";

  useEffect(() => {
    // Defer mounting to avoid hydration issues
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Track modal open/close events - solo en transiciones reales
  useEffect(() => {
    if (!mounted) return;

    const prevIsOpen = prevIsOpenRef.current;

    // Solo trackear si hay un cambio real de estado (prevIsOpen !== null significa que no es el primer efecto)
    if (prevIsOpen !== null) {
      if (isOpen && !prevIsOpen) {
        // Transición: closed → open
        track('calendly_modal_open', { source });
      } else if (!isOpen && prevIsOpen) {
        // Transición: open → closed
        track('calendly_modal_close', { method: 'click', source });
      }
    } else if (isOpen) {
      // Primer render con isOpen=true → emitir open
      track('calendly_modal_open', { source });
    }

    // Actualizar referencia para próximo render
    prevIsOpenRef.current = isOpen;
  }, [isOpen, source, mounted, track]);

  // Calendly event listener para tracking de booking completado
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Calendly envía mensajes postMessage cuando ocurren eventos
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        // Evento: calendly.event_scheduled
        if (e.data.event === 'calendly.event_scheduled') {
          track('calendly_booking_completed', {
            source,
          });

          // Callback opcional para que el componente padre maneje la acción
          if (onBookingComplete) {
            onBookingComplete();
          }
        }
      }
    };

    if (isOpen && typeof window !== 'undefined') {
      window.addEventListener('message', handleCalendlyEvent);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleCalendlyEvent);
      }
    };
  }, [isOpen, source, onBookingComplete, track]);

  const calendlyUrl = useMemo(() => {
    try {
      const url = new URL(calendlyBaseUrl);

      Object.entries(utmParams || {}).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, String(value));
        }
      });

      return url.toString();
    } catch {
      return calendlyBaseUrl;
    }
  }, [utmParams, calendlyBaseUrl]);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Agendar reunión</DialogTitle>
          <DialogDescription>
            Seleccione una fecha y hora para su diagnóstico gratuito de 30 minutos
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-[650px] md:h-[700px]">
          <InlineWidget
            url={calendlyUrl}
            styles={{
              height: '100%',
              width: '100%',
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
