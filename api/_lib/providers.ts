import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// ─── System Prompts ───────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to take a user's simple, rough prompt idea and transform it into a highly detailed, comprehensive, and effective prompt.

Rules:
1. Start with a clear role assignment (e.g., "Act as a...")
2. Break down the request into specific, actionable instructions
3. Add relevant context, constraints, and best practices
4. Include suggestions for output structure (headers, bullet points, etc.)
5. Add a section of related follow-up topics or considerations as bullet points
6. Keep the tone professional yet approachable
7. Make the prompt beginner-friendly and jargon-free where possible
8. Output ONLY the enhanced prompt text — no explanations, no meta-commentary, no markdown code fences

The enhanced prompt should be significantly more detailed than the input while staying true to the user's original intent.`;

export const REGENERATE_PROMPT = `You are an expert prompt engineer. The user was not satisfied with the previous prompt enhancement.
Your task is to take the user's rough prompt idea and transform it into a highly detailed, comprehensive, and effective prompt that takes a DIFFERENT, MORE CREATIVE, and SIGNIFICANTLY BETTER approach than a standard enhancement.

Rules:
1. Start with a clear role assignment (e.g., "Act as a...")
2. Break down the request into specific, actionable instructions
3. Add relevant context, constraints, and best practices
4. Include suggestions for output structure (headers, bullet points, etc.)
5. Add a section of related follow-up topics or considerations as bullet points
6. Keep the tone professional yet approachable
7. Make the prompt beginner-friendly and jargon-free where possible
8. Output ONLY the enhanced prompt text — no explanations, no meta-commentary, no markdown code fences
9. Ensure this version is completely distinct, heavily optimized, and definitively improved.`;

export const IMAGE_PROMPT_SYSTEM = `You are an expert AI image generation prompt engineer.
The user has provided an image. Your task is to analyze it entirely and write a highly detailed, professional prompt that could be used in Midjourney, DALL-E 3, or Stable Diffusion to recreate this EXACT image or a very similar high-quality version of it.

Rules:
1. Analyze the subject, setting, lighting, colors, mood, camera angle, and art style.
2. Structure the prompt with clear keywords, separated by commas (e.g., "A photograph of..., dynamic lighting, 8k resolution, cinematic, photorealistic").
3. Include specific artistic mediums or styles if applicable (e.g., "oil painting", "3d render in Unreal Engine 5", "anime style").
4. Output ONLY the raw prompt text. Do not include introductory text, explanations, or quotes.`;

// ─── Text Provider Factories ──────────────────────────────────────────────────

export async function callGemini(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key not configured");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const result = await model.generateContent({
        contents: [
            { role: "user", parts: [{ text: `${sysPrompt}\n\nEnhance this prompt:\n"${userPrompt.trim()}"` }] },
        ],
    });

    const text = result.response.text();
    if (!text) throw new Error("Gemini returned an empty response.");
    return text.trim();
}

export async function callOpenAI(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const openai = new OpenAI({ apiKey });
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: `Enhance this prompt:\n"${userPrompt.trim()}"` },
        ],
        temperature: isRegeneration ? 0.9 : 0.7,
        max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("OpenAI returned an empty response.");
    return text.trim();
}

export async function callGroq(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");

    const groq = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: `Enhance this prompt:\n"${userPrompt.trim()}"` },
        ],
        temperature: isRegeneration ? 0.9 : 0.7,
        max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Groq returned an empty response.");
    return text.trim();
}

export async function callDeepSeek(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DeepSeek API key not configured");

    const deepseek = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: `Enhance this prompt:\n"${userPrompt.trim()}"` },
        ],
        temperature: isRegeneration ? 0.9 : 0.7,
        max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("DeepSeek returned an empty response.");
    return text.trim();
}

export async function callOpenRouter(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter API key not configured");

    const openrouter = new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await openrouter.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: `Enhance this prompt:\n"${userPrompt.trim()}"` },
        ],
        temperature: isRegeneration ? 0.9 : 0.7,
        max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("OpenRouter returned an empty response.");
    return text.trim();
}

export async function callHuggingFace(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) throw new Error("Hugging Face API key not configured");
    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `<s>[INST] ${sysPrompt}\n\nEnhance this prompt:\n"${userPrompt.trim()}" [/INST]`,
                parameters: {
                    max_new_tokens: 2048,
                    temperature: isRegeneration ? 0.9 : 0.7,
                    return_full_text: false,
                },
            }),
        }
    );

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Hugging Face error ${response.status}: ${errBody}`);
    }

    const data: any = await response.json();
    const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    if (!text) throw new Error("Hugging Face returned an empty response.");
    return text.trim();
}

// ─── Vision Provider Factories ────────────────────────────────────────────────

export async function callGeminiVision(base64Image: string, mimeType: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key not configured");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
        IMAGE_PROMPT_SYSTEM,
        { inlineData: { data: base64Image, mimeType } },
    ]);
    const text = result.response.text();
    if (!text) throw new Error("Gemini Vision returned an empty response.");
    return text.trim();
}

async function callOpenAICompatibleVision(
    apiKey: string,
    baseURL: string | undefined,
    model: string,
    base64Image: string,
    mimeType: string
): Promise<string> {
    const openai = new OpenAI({ apiKey, baseURL });

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: IMAGE_PROMPT_SYSTEM },
            {
                role: "user",
                content: [
                    { type: "text", text: "Please generate a prompt for this image." },
                    {
                        type: "image_url",
                        image_url: { url: `data:${mimeType};base64,${base64Image}` },
                    },
                ],
            },
        ],
        max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Vision provider returned an empty response.");
    return text.trim();
}

export async function callOpenAIVision(base64Image: string, mimeType: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");
    return callOpenAICompatibleVision(apiKey, undefined, "gpt-4o-mini", base64Image, mimeType);
}

export async function callGroqVision(base64Image: string, mimeType: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");
    return callOpenAICompatibleVision(
        apiKey,
        "https://api.groq.com/openai/v1",
        "llama-3.2-90b-vision-preview",
        base64Image,
        mimeType
    );
}

export async function callOpenRouterVision(base64Image: string, mimeType: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter API key not configured");
    return callOpenAICompatibleVision(
        apiKey,
        "https://openrouter.ai/api/v1",
        "google/gemini-2.0-flash-exp:free",
        base64Image,
        mimeType
    );
}

// ─── Generic Fallback Runner ──────────────────────────────────────────────────

export type TextProvider = {
    name: string;
    enabled: boolean;
    call: (userPrompt: string, isRegeneration?: boolean) => Promise<string>;
};

export type VisionProvider = {
    name: string;
    enabled: boolean;
    call: (base64Image: string, mimeType: string) => Promise<string>;
};

export async function runTextWithFallback(
    userPrompt: string,
    isRegeneration: boolean
): Promise<string> {
    const providers: TextProvider[] = [
        { name: "Gemini", enabled: !!process.env.GEMINI_API_KEY, call: callGemini },
        { name: "OpenAI", enabled: !!process.env.OPENAI_API_KEY, call: callOpenAI },
        { name: "Groq", enabled: !!process.env.GROQ_API_KEY, call: callGroq },
        { name: "DeepSeek", enabled: !!process.env.DEEPSEEK_API_KEY, call: callDeepSeek },
        { name: "OpenRouter", enabled: !!process.env.OPENROUTER_API_KEY, call: callOpenRouter },
        { name: "HuggingFace", enabled: !!process.env.HF_API_KEY, call: callHuggingFace },
    ];

    const available = providers.filter((p) => p.enabled);
    if (available.length === 0) {
        throw new Error("No AI API keys configured on the server.");
    }

    const errors: string[] = [];
    for (const provider of available) {
        try {
            console.log(`🤖 Trying ${provider.name}...`);
            const result = await provider.call(userPrompt, isRegeneration);
            console.log(`✅ ${provider.name} succeeded!`);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`⚠️ ${provider.name} failed: ${message}`);
            errors.push(`${provider.name}: ${message}`);
        }
    }

    throw new Error(`All AI providers failed.\n${errors.map((e) => `• ${e}`).join("\n")}`);
}

export async function runVisionWithFallback(
    base64Image: string,
    mimeType: string
): Promise<string> {
    const providers: VisionProvider[] = [
        { name: "Gemini Vision", enabled: !!process.env.GEMINI_API_KEY, call: callGeminiVision },
        { name: "OpenAI Vision", enabled: !!process.env.OPENAI_API_KEY, call: callOpenAIVision },
        { name: "Groq Vision", enabled: !!process.env.GROQ_API_KEY, call: callGroqVision },
        {
            name: "OpenRouter Vision",
            enabled: !!process.env.OPENROUTER_API_KEY,
            call: callOpenRouterVision,
        },
    ];

    const available = providers.filter((p) => p.enabled);
    if (available.length === 0) {
        throw new Error(
            "No vision-capable AI provider configured. Add a Gemini, OpenAI, Groq, or OpenRouter key."
        );
    }

    const errors: string[] = [];
    for (const provider of available) {
        try {
            console.log(`📸 Trying ${provider.name} for image analysis...`);
            const result = await provider.call(base64Image, mimeType);
            console.log(`✅ ${provider.name} succeeded!`);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`⚠️ ${provider.name} failed: ${message}`);
            errors.push(`${provider.name}: ${message}`);
        }
    }

    throw new Error(`All Vision AI providers failed.\n${errors.map((e) => `• ${e}`).join("\n")}`);
}

// ─── Auth helper ──────────────────────────────────────────────────────────────

/**
 * Validates that a Bearer token is present in the Authorization header.
 * Returns the token string, or null if missing/malformed.
 * (Full Firebase Admin SDK verification can be added as Phase 2.)
 */
export function extractBearerToken(req: VercelRequest): string | null {
    const auth = req.headers["authorization"];
    if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        return auth.slice(7);
    }
    return null;
}
