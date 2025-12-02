"use client";

import { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { trackEvent } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'hero' | 'fab'; // Para diferenciar origen del click
  onBookingComplete?: () => void; // Callback para cuando se complete el booking
}

export default function CalendlyModal({
  isOpen,
  onClose,
  source = 'hero',
  onBookingComplete
}: CalendlyModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer mounting to avoid hydration issues
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Track modal open/close events
  useEffect(() => {
    if (isOpen) {
      trackEvent('calendly_modal_open', { source });
    } else if (mounted) {
      // Track close event when modal closes (but only after initial mount)
      trackEvent('calendly_modal_close', { method: 'click', source });
    }
  }, [isOpen, source, mounted]);

  // Calendly event listener para tracking de booking completado
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Calendly envía mensajes postMessage cuando ocurren eventos
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        // Evento: calendly.event_scheduled
        if (e.data.event === 'calendly.event_scheduled') {
          const payload = e.data.payload || {};

          trackEvent('calendly_booking_completed', {
            source,
            event_uri: payload.event?.uri,
            invitee_uri: payload.invitee?.uri,
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
  }, [isOpen, source, onBookingComplete]);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/";

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
