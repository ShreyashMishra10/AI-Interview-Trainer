import { Ratelimit } from "@upstash/ratelimit";
import { Redis }     from "@upstash/redis";

// ─── Upstash Redis rate limiter (production) ──────────────────────────────────
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment.
// Falls back to in-memory when those vars are absent (local dev / CI).

let upstashLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  upstashLimiter = new Ratelimit({
    redis:     Redis.fromEnv(),
    limiter:   Ratelimit.slidingWindow(30, "60 s"),
    analytics: false,
    prefix:    "rl",
  });
}

// ─── In-memory fallback (single-instance / dev only) ─────────────────────────

interface Entry { count: number; resetAt: number }
const store = new Map<string, Entry>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; remaining: number } {
  const now   = Date.now();
  const entry = store.get(key);

  if (store.size >= 500) {
    for (const [k, e] of store.entries()) {
      if (now > e.resetAt) store.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { success: false, remaining: 0 };
  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ success: boolean; remaining: number }> {
  if (upstashLimiter) {
    const { success, remaining } = await upstashLimiter.limit(key);
    return { success, remaining: remaining ?? 0 };
  }
  return memoryRateLimit(key, limit, windowMs);
}
