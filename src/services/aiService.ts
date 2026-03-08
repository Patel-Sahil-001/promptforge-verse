/**
 * aiService.ts — Thin HTTP client for PromptForge Verse backend API
 *
 * All AI provider logic now lives in the serverless functions under /api/.
 * This file simply forwards requests to the server, attaching the Firebase
 * ID token so the server can verify the user is authenticated.
 */
import { auth } from "@/lib/firebaseClient";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// ─── Auth Helper ──────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await auth.currentUser?.getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

// ─── Prompt Enhancement ───────────────────────────────────────────────────────

export async function enhancePrompt(
    userPrompt: string,
    isRegeneration = false
): Promise<string> {
    if (!userPrompt.trim()) {
        throw new Error("Please enter a prompt to enhance.");
    }

    const res = await fetch(`${API_BASE}/api/enhance`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ userPrompt, isRegeneration }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error((data as { error?: string }).error || `Server error ${res.status}`);
    }

    return (data as { result: string }).result;
}

// ─── Image Analysis ───────────────────────────────────────────────────────────

export async function analyzeImage(
    base64Image: string,
    mimeType: string
): Promise<string> {
    // Strip data URL prefix if present (the server also does this, but be safe)
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const res = await fetch(`${API_BASE}/api/analyze-image`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ base64Image: cleanBase64, mimeType }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error((data as { error?: string }).error || `Server error ${res.status}`);
    }

    return (data as { result: string }).result;
}
