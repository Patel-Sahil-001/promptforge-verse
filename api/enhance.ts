import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runTextWithFallback, extractBearerToken } from "./_lib/providers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Require a Firebase Bearer token (the user must be signed in)
    const token = extractBearerToken(req);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. Please sign in to use this feature." });
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
