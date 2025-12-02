// Utilidad simple para tracking de eventos
// En producción, esto se conectaría a Google Analytics, Posthog, etc.

type AnalyticsEvent =
  | 'calendly_fab_click'
  | 'calendly_hero_cta_click'
  | 'calendly_modal_open'
  | 'calendly_modal_close'
  | 'calendly_booking_completed'
  | 'case_view'
  | 'case_cta_click';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(eventName: AnalyticsEvent, properties?: EventProperties) {
  // En desarrollo, solo loguear
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }

  // TODO: En producción, enviar a analytics provider
  // Ejemplo con Google Analytics:
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', eventName, properties);
  // }

  // Ejemplo con Posthog:
  // if (typeof window !== 'undefined' && (window as any).posthog) {
  //   (window as any).posthog.capture(eventName, properties);
  // }
}
