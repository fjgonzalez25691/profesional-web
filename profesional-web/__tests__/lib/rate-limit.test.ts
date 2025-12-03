import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as rateLimit from '@/lib/rate-limit';

describe('rate limit', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('allows first 10 requests and blocks afterwards (memory fallback)', async () => {
    vi.spyOn(rateLimit, 'kvAvailable').mockReturnValue(false);
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(await rateLimit.checkRateLimit('1.1.1.1'));
    }
    const blocked = await rateLimit.checkRateLimit('1.1.1.1');

    expect(results.every((r) => r.ok)).toBe(true);
    expect(blocked.ok).toBe(false);
  });
});
