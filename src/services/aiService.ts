import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to take a user's simple, rough prompt idea and transform it into a highly detailed, comprehensive, and effective prompt.

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

const REGENERATE_PROMPT = `You are an expert prompt engineer. The user was not satisfied with the previous prompt enhancement.
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

// ─── Provider types ────────────────────────────────────────────────
interface Provider {
    name: string;
    call: (userPrompt: string, isRegeneration?: boolean) => Promise<string>;
    enabled: boolean;
}

// ─── 1. Google Gemini ──────────────────────────────────────────────
async function callGemini(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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

// ─── 2. OpenAI ─────────────────────────────────────────────────────
async function callOpenAI(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
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

// ─── 3. Groq (OpenAI-compatible) ──────────────────────────────────
async function callGroq(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");

    const groq = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
        dangerouslyAllowBrowser: true,
    });
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

// ─── 4. OpenRouter (OpenAI-compatible) ─────────────────────────────
async function callOpenRouter(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter API key not configured");

    const openrouter = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
    });
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

// ─── 5. Hugging Face Inference API ─────────────────────────────────
async function callHuggingFace(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
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

    const data = await response.json();
    const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    if (!text) throw new Error("Hugging Face returned an empty response.");
    return text.trim();
}

// ─── Provider chain ────────────────────────────────────────────────
function getProviders(): Provider[] {
    return [
        { name: "Gemini", call: callGemini, enabled: !!import.meta.env.VITE_GEMINI_API_KEY },
        { name: "OpenAI", call: callOpenAI, enabled: !!import.meta.env.VITE_OPENAI_API_KEY },
        { name: "Groq", call: callGroq, enabled: !!import.meta.env.VITE_GROQ_API_KEY },
        { name: "OpenRouter", call: callOpenRouter, enabled: !!import.meta.env.VITE_OPENROUTER_API_KEY },
        { name: "Hugging Face", call: callHuggingFace, enabled: !!import.meta.env.VITE_HF_API_KEY },
    ];
}

// ─── Main entry point with fallback ────────────────────────────────
export async function enhancePrompt(userPrompt: string, isRegeneration = false): Promise<string> {
    if (!userPrompt.trim()) {
        throw new Error("Please enter a prompt to enhance.");
    }

    const providers = getProviders().filter((p) => p.enabled);

    if (providers.length === 0) {
        throw new Error("No AI API keys configured. Please add at least one key in your .env file.");
    }

    const errors: string[] = [];

    for (const provider of providers) {
        try {
            console.log(`🤖 Trying ${provider.name}...`);
            const result = await provider.call(userPrompt, isRegeneration);
            console.log(`✅ ${provider.name} succeeded!`);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`⚠️ ${provider.name} failed: ${message}`);
            errors.push(`${provider.name}: ${message}`);
            // Continue to the next provider
        }
    }

    throw new Error(
        `All AI providers failed. Errors:\n${errors.map((e) => `• ${e}`).join("\n")}`
    );
}

// ─── Image to Prompt Analyzer ──────────────────────────────────────
const IMAGE_PROMPT_SYSTEM = `You are an expert AI image generation prompt engineer.
The user has provided an image. Your task is to analyze it entirely and write a highly detailed, professional prompt that could be used in Midjourney, DALL-E 3, or Stable Diffusion to recreate this EXACT image or a very similar high-quality version of it.

Rules:
1. Analyze the subject, setting, lighting, colors, mood, camera angle, and art style.
2. Structure the prompt with clear keywords, separated by commas (e.g., "A photograph of..., dynamic lighting, 8k resolution, cinematic, photorealistic").
3. Include specific artistic mediums or styles if applicable (e.g., "oil painting", "3d render in Unreal Engine 5", "anime style").
4. Output ONLY the raw prompt text. Do not include introductory text, explanations, or quotes.`;

// Vision capable provider helper
async function callOpenAICompatibleVision(
    apiKey: string,
    baseURL: string | undefined,
    model: string,
    base64Image: string,
    mimeType: string
): Promise<string> {
    const openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });

    // Attempt standard OpenAI vision format
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
                        image_url: {
                            url: `data:${mimeType};base64,${base64Image}`,
                        },
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

export async function analyzeImage(base64Image: string, mimeType: string): Promise<string> {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // We define vision providers in preferred order: Gemini -> OpenAI -> Groq -> OpenRouter
    // Note: Hugging Face free inference API usually doesn't have a reliable generic vision model online 24/7 that takes this exact format,
    // so we will rely on the big 4 for image to text.

    const visionProviders = [
        {
            name: "Gemini Vision",
            enabled: !!import.meta.env.VITE_GEMINI_API_KEY,
            call: async () => {
                const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use latest vision model
                const result = await model.generateContent([
                    IMAGE_PROMPT_SYSTEM,
                    { inlineData: { data: cleanBase64, mimeType } }
                ]);
                return result.response.text().trim();
            }
        },
        {
            name: "OpenAI Vision",
            enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
            call: () => callOpenAICompatibleVision(import.meta.env.VITE_OPENAI_API_KEY, undefined, "gpt-4o-mini", cleanBase64, mimeType)
        },
        {
            name: "Groq Vision",
            enabled: !!import.meta.env.VITE_GROQ_API_KEY,
            call: () => callOpenAICompatibleVision(import.meta.env.VITE_GROQ_API_KEY, "https://api.groq.com/openai/v1", "llama-3.2-90b-vision-preview", cleanBase64, mimeType)
        },
        {
            name: "OpenRouter Vision",
            enabled: !!import.meta.env.VITE_OPENROUTER_API_KEY,
            call: () => callOpenAICompatibleVision(import.meta.env.VITE_OPENROUTER_API_KEY, "https://openrouter.ai/api/v1", "google/gemini-2.0-flash-exp:free", cleanBase64, mimeType)
        }
    ];

    const availableProviders = visionProviders.filter(p => p.enabled);

    if (availableProviders.length === 0) {
        throw new Error("No compatible AI provider configured for image analysis. Please add a Gemini, OpenAI, Groq, or OpenRouter key.");
    }

    const errors: string[] = [];

    // Fallback loop
    for (const provider of availableProviders) {
        try {
            console.log(`📸 Trying ${provider.name} for image analysis...`);
            const result = await provider.call();
            console.log(`✅ ${provider.name} succeeded!`);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`⚠️ ${provider.name} image analysis failed: ${message}`);
            errors.push(`${provider.name}: ${message}`);
            // loop continues to next provider
        }
    }

    throw new Error(
        `All Vision AI providers failed. Errors:\n${errors.map((e) => `• ${e}`).join("\n")}`
    );
}
