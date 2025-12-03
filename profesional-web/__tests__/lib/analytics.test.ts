import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from '../../lib/analytics';

describe('Analytics Utility', () => {
  const mockGtag = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('gtag', mockGtag);
    vi.resetAllMocks();
    // Default to development
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'true');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('should NOT send event to gtag in development environment', () => {
    trackEvent('cta_calendly_click', { cta_id: 'hero' });
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('should send event to gtag in production environment', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    trackEvent('cta_calendly_click', { cta_id: 'hero' });
    
    expect(mockGtag).toHaveBeenCalledTimes(1);
    expect(mockGtag).toHaveBeenCalledWith('event', 'cta_calendly_click', expect.objectContaining({
      cta_id: 'hero',
      timestamp: expect.any(String)
    }));
  });

  it('should NOT send event if NEXT_PUBLIC_ANALYTICS_ENABLED is false', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'false');

    trackEvent('cta_calendly_click', { cta_id: 'hero' });
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('should include timestamp in event properties', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    trackEvent('cta_calendly_click', { cta_id: 'floating' });
    
    expect(mockGtag).toHaveBeenCalledWith(
      'event', 
      'cta_calendly_click', 
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    );
  });

  it('should handle calendly_booking_completed event', () => {
     vi.stubEnv('NODE_ENV', 'production');
     
     trackEvent('calendly_booking_completed', { source_page: '/' });

     expect(mockGtag).toHaveBeenCalledWith(
       'event',
       'calendly_booking_completed',
       expect.objectContaining({
         source_page: '/',
         timestamp: expect.any(String)
       })
     );
  });
});
