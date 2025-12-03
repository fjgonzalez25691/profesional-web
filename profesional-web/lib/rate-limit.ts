import { kv } from "@vercel/kv";

type RateLimitResult = { ok: boolean; remaining?: number; resetIn?: number };

const memoryStore = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 10;

export function kvAvailable() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `chat:ip:${ip}`;
  const now = Date.now();

  if (kvAvailable()) {
    try {
      const current = await kv.incr(key);
      if (current === 1) {
        await kv.expire(key, WINDOW_MS / 1000);
      }
      if (current > LIMIT) {
        const ttl = await kv.ttl(key);
        return { ok: false, remaining: 0, resetIn: ttl > 0 ? ttl : WINDOW_MS / 1000 };
      }
      return { ok: true, remaining: Math.max(LIMIT - current, 0) };
    } catch (error) {
      console.error("Rate limit KV error", error);
      // fallthrough to memory store
    }
  }

  const record = memoryStore.get(key);
  if (!record || record.expires < now) {
    memoryStore.set(key, { count: 1, expires: now + WINDOW_MS });
    return { ok: true, remaining: LIMIT - 1 };
  }

  if (record.count >= LIMIT) {
    return { ok: false, remaining: 0, resetIn: Math.max(0, record.expires - now) / 1000 };
  }

  record.count += 1;
  memoryStore.set(key, record);
  return { ok: true, remaining: LIMIT - record.count };
}
