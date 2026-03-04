import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function enhancePrompt(userPrompt: string, apiKey: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Please enter your Gemini API key to use prompt enhancement.");
    }
    if (!userPrompt.trim()) {
        throw new Error("Please enter a prompt to enhance.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    { text: `${SYSTEM_PROMPT}\n\n---\n\nUser's prompt to enhance:\n"${userPrompt.trim()}"` },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        },
    });

    const response = result.response;
    const text = response.text();

    if (!text) {
        throw new Error("The AI returned an empty response. Please try again.");
    }

    return text.trim();
}
