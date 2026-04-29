/**
 * Simple in-memory sliding-window rate limiter.
 * Works on a single server instance (Vercel hobby / single-region).
 * For multi-instance production replace with Upstash: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface Entry {
  count:   number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Prune expired entries when the store grows large to prevent memory leaks
function maybePrune() {
  if (store.size < 5000) return;
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * @param key       Unique identifier, e.g. `"interviews:${userId}"`
 * @param limit     Max requests allowed in the window
 * @param windowMs  Window size in milliseconds
 * @returns `{ success: true }` if the request is allowed, `{ success: false }` if rate limited
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  maybePrune();

  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}
