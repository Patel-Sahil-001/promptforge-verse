/**
 * aiService.ts — Thin HTTP client for PromptForge Verse backend API
 *
 * All AI provider logic now lives in the serverless functions under /api/.
 * This file forwards requests to the server using the centralized apiFetch
 * utility, which automatically attaches the Firebase ID token.
 */
import { apiFetch } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// ─── Prompt Enhancement ───────────────────────────────────────────────────────

export async function enhancePrompt(
    userPrompt: string,
    isRegeneration = false
): Promise<string> {
    if (!userPrompt.trim()) {
        throw new Error("Please enter a prompt to enhance.");
    }

    const data = await apiFetch<{ result: string }>(`${API_BASE}/api/enhance`, {
        method: "POST",
        body: JSON.stringify({ userPrompt, isRegeneration }),
    });

    return data.result;
}

// ─── Image Analysis ───────────────────────────────────────────────────────────

export async function analyzeImage(
    base64Image: string,
    mimeType: string
): Promise<string> {
    // Strip data URL prefix (server also does this, but defensive is good)
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const data = await apiFetch<{ result: string }>(`${API_BASE}/api/analyze-image`, {
        method: "POST",
        body: JSON.stringify({ base64Image: cleanBase64, mimeType }),
    });

    return data.result;
}
