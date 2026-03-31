import type { Request } from "express";

// ─── In-Process Store ────────────────────────────────────────────────────────
// Lives for the lifetime of a warm serverless instance.
const store = new Map<string, { count: number; resetAt: number }>();

// ─── IP Extraction ───────────────────────────────────────────────────────────
function getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }
    return "unknown";
}

// ─── Pruner ──────────────────────────────────────────────────────────────────
function prune(): void {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}

// ─── Options ─────────────────────────────────────────────────────────────────
export interface RateLimitOptions {
    /** Max requests per window. Default 20 (IP) or 60 (UID). */
    max?: number;
    /** Window duration in ms. Default 60_000 (1 min). */
    windowMs?: number;
    /** Key prefix to namespace separate limits. Default 'global'. */
    prefix?: string;
    /**
     * Authenticated user ID.
     * When provided, rate limiting keys on `uid:{userId}` instead of
     * `ip:{ip}` — preventing bypass via shared IPs / proxy abuse.
     * UID-keyed limits default to a *tighter* cap than IP-keyed limits.
     */
    userId?: string;
}

export interface RateLimitResult {
    allowed: boolean;
    retryAfter: number;
    remaining: number;
}

// ─── Main Rate Limiter ────────────────────────────────────────────────────────
export function rateLimit(req: Request, options: RateLimitOptions = {}): RateLimitResult {
    const { windowMs = 60_000, prefix = "global", userId } = options;

    // UID-keyed: tighter limit (default 60/min). IP-keyed: looser (default 20/min).
    const isUidKeyed = Boolean(userId);
    const max = options.max ?? (isUidKeyed ? 60 : 20);

    // Lazy pruning (~2% probability)
    if (Math.random() < 0.02) {
        prune();
    }

    // Derive the rate-limit key: prefer UID to prevent IP-sharing bypass
    const rawKey = isUidKeyed ? `uid:${userId}` : `ip:${getClientIp(req)}`;
    const key = `${prefix}:${rawKey}`;
    const now = Date.now();

    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        // Fresh window
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfter: 0, remaining: max - 1 };
    }

    if (entry.count < max) {
        entry.count += 1;
        return { allowed: true, retryAfter: 0, remaining: max - entry.count };
    }

    // Denied
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter, remaining: 0 };
}

// ─── Response Helper ──────────────────────────────────────────────────────────
export function rateLimitResponse(retryAfter: number) {
    return {
        error: "Too many requests. Please slow down.",
        retryAfter,
        retryAfterMs: retryAfter * 1000,
    };
}
