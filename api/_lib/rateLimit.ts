import type { VercelRequest } from "@vercel/node";

// ─── In-Process Store ────────────────────────────────────────────────────────
// Lives for the lifetime of a warm serverless instance.
const store = new Map<string, { count: number; resetAt: number }>();

// ─── IP Extraction ───────────────────────────────────────────────────────────
function getClientIp(req: VercelRequest): string {
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
    max?: number;       // default: 20
    windowMs?: number;  // default: 60_000
    prefix?: string;    // default: 'global'
}

export interface RateLimitResult {
    allowed: boolean;
    retryAfter: number;
    remaining: number;
}

// ─── Main Rate Limiter ────────────────────────────────────────────────────────
export function rateLimit(req: VercelRequest, options: RateLimitOptions = {}): RateLimitResult {
    const { max = 20, windowMs = 60_000, prefix = "global" } = options;

    // Lazy pruning (~2% probability)
    if (Math.random() < 0.02) {
        prune();
    }

    const ip = getClientIp(req);
    const key = `${prefix}:${ip}`;
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
