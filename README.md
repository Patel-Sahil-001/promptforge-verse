<div align="center">

# ✨ PROMPT FORGE VERSE

### 🎯 AI Prompt Generator

**"Stop guessing. Start crafting."**

[![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

**An advanced, visually stunning React web application designed as your AI Prompt Engineering Laboratory**

Sitting between raw ideas and complex AI model inputs, Prompt Forge Verse transforms anyone into a professional prompt engineer.

[🚀 Getting Started](#-getting-started) • [✨ Features](#-key-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Architecture](#-intelligent-architecture)

---

</div>

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 **LLM Enhancer**
> Transform vague ideas into structured, model-ready prompts

Turn simple concepts into professionally optimized prompts for ChatGPT, Claude, and Gemini with precision engineering.

</td>
<td width="50%">

### 🎨 **Image Alchemy**
> Reverse-engineer any image into AI prompts

Upload images and extract high-fidelity Midjourney or Stable Diffusion prompts by analyzing subject, lighting, colors, camera angles, and art style.

</td>
</tr>
<tr>
<td width="50%">

### ✍️ **Creative Studio**
> Generate perfectly toned content

Craft emails, stories, and summaries with targeted audience alignment and professional polish.

</td>
<td width="50%">

### 🔄 **Intelligent Fallback**
> Never face downtime again

Multi-provider AI backend ensures 100% uptime by automatically switching between Gemini, OpenAI, Groq, DeepSeek, OpenRouter, and Hugging Face.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|:--------:|:-------------|
| **Frontend** | React 18 • Vite • TypeScript |
| **Styling** | Tailwind CSS • Radix UI • Class Variance Authority |
| **State** | Zustand |
| **Animation** | Framer Motion (smooth transitions, particle fields, scanning effects) |
| **Routing** | React Router DOM with Animated Routes |

</div>

---

## 🚀 Getting Started

### 📋 Prerequisites

```bash
Node.js v18+ 
npm or yarn
```

### ⚡ Quick Start

**1️⃣ Clone & Install**
```bash
git clone <your-repo-url>
cd prompt-forge-verse
npm install
```

**2️⃣ Configure Environment**

Create a `.env` file with your API keys:

```env
# Add as many providers as you'd like for maximum reliability
VITE_GEMINI_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
VITE_DEEPSEEK_API_KEY=your_key_here
VITE_OPENROUTER_API_KEY=your_key_here
VITE_HF_API_KEY=your_key_here
```

**3️⃣ Launch Development Server**
```bash
npm run dev
```

🎉 **Your app is now running at** `http://localhost:8080`

---

## ⚡ Intelligent Architecture

### 🧬 **How the Fallback System Works**

The heart of Prompt Forge Verse is the **`aiService.ts`** module, featuring a sophisticated multi-provider fallback architecture:

```typescript
// Intelligent Provider Management
disabledProviders = new Set() // Runtime cache
lastWorkingTextProvider = null // Fast-path optimization
```

#### 🔄 **The Flow:**

1. **Request Initiated** → System checks `lastWorkingTextProvider` for instant routing
2. **Provider Fails** (429/401) → Error caught, provider blacklisted immediately
3. **Auto-Switch** → Next available provider processes request seamlessly
4. **Zero Downtime** → Users never see errors, just results

#### ⚙️ **Key Benefits:**

- ✅ **100% Uptime**: Never face quota exhaustion errors
- ⚡ **Instant Recovery**: Sub-second provider switching
- 🎯 **Smart Caching**: Remembers working providers across session
- 🔒 **Fault Isolation**: One provider failure doesn't affect others

---

## 🎨 Visual Features

- 🌊 **Smooth Page Transitions** powered by Framer Motion
- ✨ **Custom Particle Fields** for immersive backgrounds
- 📊 **Animated Grid Lines** with scanning effects
- 🎭 **Dynamic UI States** with elegant micro-interactions
- 🌈 **Modern Color Palettes** with gradient accents

---

## 📦 Project Structure

```
prompt-forge-verse/
├── 🎨 src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based page components
│   ├── services/       # AI service layer & fallback logic
│   ├── store/          # Zustand state management
│   └── utils/          # Helper functions
├── 🔧 public/          # Static assets
└── ⚙️ config/          # Build configuration
```

---

## 🤝 Contributing

We welcome contributions! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

---

<div align="center">

### 🌟 **Built with passion for prompt engineers**

**Prompt Forge Verse** • *Where ideas become reality*

---

Made with ❤️ by the Prompt Engineering Community

</div>