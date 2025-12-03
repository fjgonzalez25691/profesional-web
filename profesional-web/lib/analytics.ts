// Utilidad simple para tracking de eventos
// En producción, esto se conecta a Google Analytics 4 (GA4)

export type AnalyticsEvent =
  | 'cta_calendly_click'
  | 'calendly_booking_completed'
  | 'calendly_modal_open'
  | 'calendly_modal_close'
  | 'case_view'
  | 'case_cta_click';

interface EventProperties {
  cta_id?: 'hero' | 'floating';
  source_page?: string;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(eventName: AnalyticsEvent, properties?: EventProperties) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

  // Timestamp automático para todos los eventos
  const enrichedProperties = {
    ...properties,
    timestamp: new Date().toISOString(),
  };

  // En desarrollo, solo loguear
  if (!isProduction) {
    console.log('[Analytics]', eventName, enrichedProperties);
    return;
  }

  // En producción, enviar a Google Analytics si está habilitado
  if (isAnalyticsEnabled && typeof window !== 'undefined') {
    const windowWithGtag = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', eventName, enrichedProperties);
    }
  }
}
