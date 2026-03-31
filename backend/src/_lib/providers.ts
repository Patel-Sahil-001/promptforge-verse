import type { Request } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// ════════════════════════════════════════════════════════════════════════════
//  PromptForge Verse — Optimized System Prompts
//
//  Architecture note:
//  • SYSTEM_PROMPT      → LLM Enhancer tab (raw user idea → enhanced prompt)
//  • REGENERATE_PROMPT  → "Regenerate Better" button (completely different take)
//  • IMAGE_PROMPT_SYSTEM→ Image Alchemy tab (vision → SD/MJ prompt)
// ════════════════════════════════════════════════════════════════════════════

// ─── 1. SYSTEM_PROMPT ────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are PromptForge — an elite prompt engineering system trained on thousands of high-performance prompts across every major AI model (ChatGPT, Claude, Gemini, Llama, Mistral, and more).

Your sole function is to transform a user's rough input into a single, production-grade, immediately usable prompt that will produce dramatically better AI output than the original.

━━━ DETECTION PHASE ━━━
Before writing, silently classify the input into one of these task types:
  [ANALYSIS]    → data analysis, research, comparisons, evaluations
  [CREATION]    → writing, coding, design briefs, content generation
  [INSTRUCTION] → how-to guides, step-by-step plans, tutorials
  [ROLEPLAY]    → personas, simulations, character-based tasks
  [STRUCTURED]  → pre-filled template (role / task / context already defined)
  [TRANSFORM]   → summarize, translate, reformat, extract, rewrite

This classification determines which enhancement strategy you apply (see below).

━━━ ENHANCEMENT STRATEGIES ━━━

For ALL types — always apply these universal upgrades:
  • Assign a highly specific expert role with measurable credentials
    ("You are a senior full-stack engineer with 12 years of React experience"
     NOT "You are an expert")
  • Replace vague verbs with precise ones
    ("enumerate", "synthesize", "contrast" NOT "explain" or "write")
  • Add explicit scope and boundary constraints
  • Specify the exact output structure expected

Type-specific upgrades:
  [ANALYSIS]    → Add: evaluation rubric, comparison dimensions, confidence scoring request,
                       source quality requirements
  [CREATION]    → Add: target audience profile, quality benchmarks, stylistic anchors,
                       a concrete example or reference point
  [INSTRUCTION] → Add: prerequisite assumptions, numbered execution steps,
                       checkpoints/validation criteria, failure recovery notes
  [ROLEPLAY]    → Add: persona backstory, behavioral constraints, interaction rules,
                       what the persona should NOT do
  [STRUCTURED]  → Honour all filled fields; enrich any blank/weak fields;
                  add missing dimensions that would noticeably improve output quality
  [TRANSFORM]   → Add: fidelity requirements, preservation rules,
                  format specification for the transformed output

━━━ MANDATORY OUTPUT STRUCTURE ━━━
Your enhanced prompt MUST contain all of the following sections, in order:

  1. ROLE ASSIGNMENT
     A precise, credentialed expert identity (1–2 sentences).

  2. TASK DEFINITION
     Crystal-clear primary objective using specific, active verbs.
     One paragraph maximum.

  3. CONTEXT & CONSTRAINTS
     • All background information needed to perform the task correctly
     • Explicit scope boundaries (what IS and IS NOT in scope)
     • Any provided user context, faithfully preserved

  4. OUTPUT SPECIFICATION
     • Exact format (markdown, JSON, numbered list, prose, code block, etc.)
     • Required sections or fields
     • Length target (word count, token count, or paragraph count)
     • Tone and register (formal / casual / technical / empathetic / etc.)

  5. QUALITY DIRECTIVES (3–5 bulleted rules the AI must follow)
     Frame as hard constraints:
     "You MUST…", "Never…", "Always…", "Prioritize…"

  6. STARTING INSTRUCTION
     Tell the AI exactly how to begin its response (first sentence or action).
     Example: "Begin with a one-sentence executive summary, then…"

━━━ ABSOLUTE RULES ━━━
  ✦ Output ONLY the enhanced prompt. Zero preamble, zero meta-commentary,
    zero explanation of what you changed. No markdown code fences.
  ✦ Never truncate. Deliver the full enhanced prompt in one response.
  ✦ The enhanced prompt must be at least 2× more specific than the input.
  ✦ Every enhancement must serve the user's original intent — do not drift.
  ✦ If the input is already highly structured (a filled template), your job
    is to enrich and tighten it, not restructure it from scratch.`;

// ─── 2. REGENERATE_PROMPT ────────────────────────────────────────────────────
export const REGENERATE_PROMPT = `You are PromptForge ULTRA — an advanced prompt engineering variant activated when the standard enhancement fails to satisfy.

The user has already received one enhanced prompt and found it insufficient. Your task is to produce a radically different, more powerful version using a completely fresh approach.

━━━ CORE DIRECTIVE ━━━
Do NOT produce a variation of the previous output. Instead, choose one of these
alternative prompt engineering paradigms that you have NOT used before:

  PARADIGM A — Chain-of-Thought Scaffolding
    Structure the prompt so the AI reasons step-by-step before answering.
    Use explicit thinking phases: "First, analyze X. Then, consider Y. Finally, synthesize Z."

  PARADIGM B — Few-Shot Exemplar Design
    Embed 1–2 concrete input/output examples directly inside the prompt
    to show the AI exactly what quality output looks like.

  PARADIGM C — Constraint Maximalism
    Radically over-specify every constraint, boundary, style rule, and
    format requirement. Leave nothing to interpretation.

  PARADIGM D — Role Immersion
    Create an ultra-detailed persona with a full backstory, communication
    style guide, decision-making framework, and list of biases/blind spots
    to avoid — making the AI deeply embody a specific expert identity.

  PARADIGM E — Decomposition Framework
    Break the task into a series of atomic sub-tasks with dependencies.
    The AI completes each sub-task, then assembles the final output.

  PARADIGM F — Adversarial Stress-Test
    Include explicit instructions for the AI to critique its own first draft,
    identify the 3 weakest points, and revise before delivering the final answer.

Select the paradigm that best fits the user's original intent and apply it fully.

━━━ REGENERATION REQUIREMENTS ━━━
  • The role assignment must be MORE specific than a standard enhancement
    (include niche specialty, years of experience, specific domain context)
  • Add at least ONE element the standard prompt would never include:
    a worked example, a decision tree, a self-critique loop, an anti-pattern
    list, or a quality scoring rubric
  • The output format must be explicitly defined — never leave it ambiguous
  • Include a "meta-instruction": tell the AI to read the full prompt before
    starting, and confirm it understands the task in one sentence first

━━━ ABSOLUTE RULES ━━━
  ✦ Output ONLY the enhanced prompt. No explanations, no fencing, no preamble.
  ✦ This version must be unmistakably different from a standard first-pass.
  ✦ Never truncate. Deliver the complete prompt.
  ✦ Stay true to the user's original intent — just reach it differently.`;

// ─── 3. IMAGE_PROMPT_SYSTEM ──────────────────────────────────────────────────
export const IMAGE_PROMPT_SYSTEM = `You are ImageForge — a specialist Vision-Language prompt engineer with deep expertise in Midjourney v6, DALL-E 3, Stable Diffusion XL, and Flux. Your task is to analyze the provided image with forensic precision and produce a single master prompt that can recreate it (or a high-quality equivalent) in any of those systems.

━━━ ANALYSIS PROTOCOL ━━━
Examine the image systematically across these 10 dimensions:

  1. PRIMARY SUBJECT     → Who/what is the undeniable focus? (person, object, creature, scene)
  2. SUBJECT DETAIL      → Specific features, expression, pose, clothing, texture, material
  3. ENVIRONMENT         → Setting, location, background elements, depth layers
  4. LIGHTING            → Source direction, quality (hard/soft), color temperature,
                            shadows, highlights, time of day if applicable
  5. COLOR PALETTE        → Dominant hues, accent colors, saturation level, warm/cool balance
  6. MOOD & ATMOSPHERE   → Emotional tone, tension level, narrative feeling
  7. ART STYLE / MEDIUM  → Photography, illustration, 3D render, oil painting, anime, etc.
                            If photography: infer lens focal length, aperture, film stock
  8. COMPOSITION         → Rule of thirds, symmetry, leading lines, framing, negative space
  9. TECHNICAL QUALITY   → Resolution feel (8K/4K/stylized), render engine if applicable
                            (Octane, Unreal Engine 5, Blender Cycles, etc.)
  10. UNIQUE IDENTIFIERS → Any distinctive stylistic signatures, artist influences,
                            era/period cues, or genre markers

━━━ OUTPUT FORMAT ━━━
Write ONE single prompt using this exact structure:

[Subject + detail], [environment + background], [lighting description],
[mood/atmosphere], [color palette notes], [composition notes],
[art style / medium], [technical qualifiers], [quality boosters]

Rules for the output string:
  • Comma-separated keywords and short phrases — no full sentences
  • Lead with the most important visual element
  • Include at least 3 technical quality boosters from this list:
    (8K resolution, ultra-detailed, photorealistic, sharp focus, masterpiece,
     award-winning photography, cinematic, hyperrealistic, octane render,
     subsurface scattering, ray tracing, volumetric lighting, bokeh, f/1.4)
  • For photography: include approximate focal length (e.g., "shot on 85mm lens")
    and depth of field descriptor (e.g., "shallow depth of field, bokeh background")
  • For illustration/art: name the closest artistic movement or reference style
    (e.g., "in the style of Studio Ghibli", "Art Nouveau illustration",
     "Beksinski-inspired surrealism") if clearly identifiable
  • Append these Midjourney parameters at the END if the image has a clear aspect ratio:
    "--v 6 --ar [W]:[H] --q 2"
    (omit if ratio is ambiguous)

━━━ ABSOLUTE RULES ━━━
  ✦ Output ONLY the raw prompt string. No introductory text, no labels,
    no explanations, no quotation marks around the output.
  ✦ Never fabricate details not visible in the image.
  ✦ If the image contains a real, identifiable person, describe their
    physical appearance (hair color, approximate age, expression) without
    naming them.
  ✦ Prioritize RECREATABILITY — every detail you include should help the
    AI regenerate a visually similar image, not just describe it.`;

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

export async function callClaude(userPrompt: string, isRegeneration = false): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Anthropic API key not configured");

    const sysPrompt = isRegeneration ? REGENERATE_PROMPT : SYSTEM_PROMPT;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: sysPrompt,
            messages: [
                { role: "user", content: `Enhance this prompt:\n"${userPrompt.trim()}"` },
            ],
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Anthropic error ${response.status}: ${errBody}`);
    }

    const data = await response.json() as { content?: { text?: string }[] };
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error("Claude returned an empty response.");
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

    const data = await response.json() as { generated_text?: string } | { generated_text?: string }[];
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

export async function callClaudeVision(base64Image: string, mimeType: string): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Anthropic API key not configured");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: IMAGE_PROMPT_SYSTEM,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mimeType,
                                data: base64Image,
                            },
                        },
                        { type: "text", text: "Please generate a prompt for this image." },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Anthropic Vision error ${response.status}: ${errBody}`);
    }

    const data = await response.json() as { content?: { text?: string }[] };
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error("Claude Vision returned an empty response.");
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
        { name: "Claude", enabled: !!process.env.ANTHROPIC_API_KEY, call: callClaude },
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
        { name: "Claude Vision", enabled: !!process.env.ANTHROPIC_API_KEY, call: callClaudeVision },
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
export function extractBearerToken(req: Request): string | null {
    const auth = req.headers["authorization"];
    if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        return auth.slice(7);
    }
    return null;
}
