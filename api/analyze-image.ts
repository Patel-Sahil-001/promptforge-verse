import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runVisionWithFallback, extractBearerToken } from "./_lib/providers";
import { deductCredits } from "./_lib/firebaseAdmin";
import { rateLimit, rateLimitResponse } from "./_lib/rateLimit";

// Vercel's body size limit is 4.5 MB. A base64-encoded image is ~33% larger than
// the original binary, so we enforce a ~3 MB binary-equivalent limit client-side.
// This handler rejects requests that are clearly too large.
const MAX_BASE64_LENGTH = 4_000_000; // ~3 MB original → ~4 MB base64

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Rate limit (tighter: vision inference is more expensive) — checked BEFORE business logic
    const { allowed, retryAfter, remaining } = rateLimit(req, {
        max: 10, windowMs: 60_000, prefix: "analyze-image",
    });
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    if (!allowed) {
        res.setHeader("Retry-After", String(retryAfter));
        return res.status(429).json(rateLimitResponse(retryAfter));
    }

    // Require a Firebase Bearer token
    const token = extractBearerToken(req);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. Please sign in to use this feature." });
    }

    try {
        await deductCredits(token);
    } catch (err: any) {
        const msg = err.message || "Unauthorized";
        const code = (err as any).code;
        const status = (msg.includes("free credits") || code === "PLAN_EXPIRED" || code === "INSUFFICIENT_CREDITS") ? 402 : 401;
        return res.status(status).json({ error: msg });
    }

    // Parse & validate body
    const { base64Image, mimeType } = req.body ?? {};

    if (!base64Image || typeof base64Image !== "string") {
        return res.status(400).json({ error: "base64Image is required." });
    }

    if (!mimeType || typeof mimeType !== "string") {
        return res.status(400).json({ error: "mimeType is required (e.g. image/jpeg)." });
    }

    // Strip data URL prefix if caller included it
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    if (cleanBase64.length > MAX_BASE64_LENGTH) {
        return res.status(413).json({
            error:
                "Image is too large. Please resize or compress the image to under ~3 MB before uploading.",
        });
    }

    try {
        const result = await runVisionWithFallback(cleanBase64, mimeType);
        return res.status(200).json({ result });
    } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        console.error("[/api/analyze-image] Error:", message);
        return res.status(502).json({ error: message });
    }
}
