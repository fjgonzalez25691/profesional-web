'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, AnalyticsEvent } from '../lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();

  const track = useCallback(
    (eventName: AnalyticsEvent, properties?: Record<string, string | number | boolean>) => {
      trackEvent(eventName, {
        ...properties,
        pathname: pathname || 'unknown',
      });
    },
    [pathname]
  );

  return { track };
}
