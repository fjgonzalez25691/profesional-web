import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../../hooks/useAnalytics';
import * as analyticsLib from '../../lib/analytics';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
}));

describe('useAnalytics Hook', () => {
  const trackEventSpy = vi.spyOn(analyticsLib, 'trackEvent');

  beforeEach(() => {
    trackEventSpy.mockClear();
  });
  
  afterEach(() => {
      vi.clearAllMocks();
  });

  it('should call trackEvent with correct name and properties including pathname', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.track('cta_calendly_click', { cta_id: 'hero' });

    expect(trackEventSpy).toHaveBeenCalledWith(
      'cta_calendly_click',
      expect.objectContaining({
        cta_id: 'hero',
        pathname: '/test-path',
      })
    );
  });

  it('should handle events without extra properties', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.track('calendly_booking_completed');

    expect(trackEventSpy).toHaveBeenCalledWith(
      'calendly_booking_completed',
      expect.objectContaining({
        pathname: '/test-path',
      })
    );
  });

  it('should memoize track function to prevent unnecessary re-renders', () => {
    const { result, rerender } = renderHook(() => useAnalytics());

    const firstTrack = result.current.track;

    // Re-render sin cambiar pathname
    rerender();

    const secondTrack = result.current.track;

    // track debe ser la misma referencia
    expect(firstTrack).toBe(secondTrack);
  });
});
