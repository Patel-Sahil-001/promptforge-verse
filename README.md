# PROMPT FORGE VERSE — AI Prompt Generator

**"Stop guessing. Start crafting."**

Prompt Forge Verse is an advanced, visually stunning React web application designed specifically as an AI tool for "Prompt Engineering" and creative AI generation. It acts as "The Laboratory," sitting between a user's raw ideas and the complex inputs required by powerful AI models, enabling anyone to generate highly optimized, professional-grade prompts.

## Key Features

- **LLM Enhancer (Text Prompt Builder)**: Turn vague or simple ideas into structured, model-ready prompts for ChatGPT, Claude, and Gemini.
- **Image Alchemy (Image-to-Prompt Analyzer)**: Upload any image and extract a high-fidelity Midjourney or Stable Diffusion prompt by reverse-engineering the subject, setting, lighting, colors, camera angle, and art style.
- **Creative Studio**: Generate perfectly toned emails, stories, and summaries with targeted audience alignment.
- **Intelligent Fallback Architecture**: The AI backend connects to multiple providers (Gemini, OpenAI, Groq, DeepSeek, OpenRouter, and Hugging Face). If one key hits a rate limit or exhaust credits (`429 Quota Exceeded`), the system instantaneously caches the failure, skips the exhausted provider for the rest of the session, and prioritizes the next working key—ensuring 100% uptime without user-facing errors.

## Tech Stack & Highlights

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Class Variance Authority
- **State Management**: Zustand
- **Animations**: Framer Motion (smooth page transitions, custom particle fields, animated grid lines, scanning effects)
- **Routing**: React Router DOM (Animated Routes)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   Copy `.env.example` to `.env` (or create a new `.env` file) and add your AI API keys. To ensure the fallback system works, add as many as you'd like:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   VITE_OPENAI_API_KEY=your_key_here
   VITE_GROQ_API_KEY=your_key_here
   VITE_DEEPSEEK_API_KEY=your_key_here
   VITE_OPENROUTER_API_KEY=your_key_here
   VITE_HF_API_KEY=your_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080` (or whichever port Vite automatically selects).

## Architecture & Logic

**How Fallback Works (The `aiService.ts` Module)**
The application maintains a `disabledProviders` cache during any session. Whenever `enhancePrompt` is triggered, it maps over an array of available providers. If a provider throws an HTTP 429 or 401 error, the error is caught, the provider is instantly blacklisted, and the very next engine processes the request. The next time you hit "Generate", the app checks `lastWorkingTextProvider` to immediately begin the request with your functioning API Key, skipping the standard retry-latency inherent in sequential fallback chains.
