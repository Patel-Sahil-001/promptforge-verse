import type { Request, Response } from "express";
import { runTextWithFallback, extractBearerToken } from "./_lib/providers.js";
import { deductCredits } from "./_lib/firebaseAdmin.js";
import { rateLimit, rateLimitResponse } from "./_lib/rateLimit.js";

function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // remove control chars
        .slice(0, 5000); // hard length cap
}

export default async function handler(req: Request, res: Response) {

    // Guard 1: Body Size
    const MAX_BODY_SIZE = 10 * 1024; // 10KB
    const bodyStr = JSON.stringify(req.body ?? {});
    if (Buffer.byteLength(bodyStr, "utf8") > MAX_BODY_SIZE) {
        return res.status(413).json({ error: "Request body too large.", code: "BODY_TOO_LARGE" });
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
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unauthorized";
        const code = (err as any).code || "UNAUTHORIZED";
        const status = (msg.includes("free credits") || code === "PLAN_EXPIRED" || code === "INSUFFICIENT_CREDITS") ? 402 : 401;
        return res.status(status).json({ error: msg, code });
    }

    // Parse & validate body
    const { userPrompt, isRegeneration = false } = req.body ?? {};

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
        return res.status(400).json({ error: "userPrompt is required.", code: "INVALID_INPUT" });
    }

    const sanitizedPrompt = sanitizeInput(userPrompt);
    if (!sanitizedPrompt) {
        return res.status(400).json({ error: "userPrompt is empty after sanitization.", code: "INVALID_INPUT" });
    }

    try {
        const result = await runTextWithFallback(sanitizedPrompt, Boolean(isRegeneration));
        return res.status(200).json({ result });
    } catch (err) {
        const message = err instanceof Error ? err.message : "AI service unavailable.";
        console.error("[/api/enhance] Error:", message);
        return res.status(502).json({ error: "AI service failed. Please try again shortly.", code: "AI_SERVICE_ERROR" });
    }
}
