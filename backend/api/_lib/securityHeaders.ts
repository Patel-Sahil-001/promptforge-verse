/**
 * api/_lib/securityHeaders.ts
 *
 * Applies production-grade security headers to every API response.
 * Call `applySecurityHeaders(res)` at the start of every serverless handler.
 *
 * These headers supplement `vercel.json` headers — serverless function
 * responses don't automatically inherit those, so we set them in code.
 */
import type { VercelResponse } from "@vercel/node";

export function applySecurityHeaders(res: VercelResponse): void {
    // Strict Transport Security — force HTTPS for 2 years
    res.setHeader(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
    );
    // Prevent MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Disallow embedding in iframes
    res.setHeader("X-Frame-Options", "DENY");
    // Send only origin (no path) in Referer header
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Restrict browser features
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
    );
    // No caching for API responses
    res.setHeader("Cache-Control", "no-store, no-cache");
}
