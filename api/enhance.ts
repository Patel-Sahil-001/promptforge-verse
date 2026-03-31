import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runTextWithFallback, extractBearerToken } from "./_lib/providers";
import { deductCredits } from "./_lib/firebaseAdmin";
import { rateLimit, rateLimitResponse } from "./_lib/rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Rate limit — checked BEFORE any business logic
    const { allowed, retryAfter, remaining } = rateLimit(req, {
        max: 20, windowMs: 60_000, prefix: "enhance",
    });
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    if (!allowed) {
        res.setHeader("Retry-After", String(retryAfter));
        return res.status(429).json(rateLimitResponse(retryAfter));
    }

    // Require a Firebase Bearer token (the user must be signed in)
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
    const { userPrompt, isRegeneration = false } = req.body ?? {};

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
        return res.status(400).json({ error: "userPrompt is required and must be a non-empty string." });
    }

    if (userPrompt.trim().length > 5000) {
        return res.status(400).json({ error: "userPrompt is too long (max 5000 characters)." });
    }

    try {
        const result = await runTextWithFallback(userPrompt, Boolean(isRegeneration));
        return res.status(200).json({ result });
    } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        console.error("[/api/enhance] Error:", message);
        return res.status(502).json({ error: message });
    }
}
