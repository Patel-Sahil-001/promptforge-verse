<div align="center">

<img src="./frontend/public/Logo.png" alt="Prompt Forge Verse Logo" width="250" />

# ✨ PROMPT FORGE VERSE

### 🎯 AI Prompt Generator

**"Stop guessing. Start crafting."**

[![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

---

**An advanced, visually stunning React web application designed as your AI Prompt Engineering Laboratory**

Sitting between raw ideas and complex AI model inputs, Prompt Forge Verse transforms anyone into a professional prompt engineer.

[🚀 Getting Started](#-getting-started) • [✨ Features](#-key-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Architecture](#-intelligent-architecture)

---

</div>

## 📖 Description

Prompt Forge Verse is a state-of-the-art AI Prompt Engineering platform that bridges the gap between raw ideas and highly optimized AI inputs. Built for creators, developers, and professionals, it offers a visually immersive, high-performance environment to forge perfect prompts for any AI model. With its dynamic multi-provider fallback system and robust capabilities—ranging from advanced text prompt optimization to deep image analysis—Prompt Forge Verse ensures zero downtime and endless creativity.

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 **LLM Enhancer**
> Transform vague ideas into structured, model-ready prompts

Turn simple concepts into professionally optimized prompts for Claude, ChatGPT, and Gemini with precision engineering.

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

### 🔄 **Intelligent Fallback & Payments**
> Never face downtime again

Multi-provider AI backend guarantees uptime by auto-switching between top AI models (Claude, Gemini, OpenAI, Groq, DeepSeek, OpenRouter, & Hugging Face). Integrated with **Razorpay** supporting Cards, UPI, QR, and Wallets for seamless access management.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|:--------:|:-------------|
| **Frontend** | React 18 • Vite • TypeScript |
| **Styling & UI** | Tailwind CSS • Radix UI • Class Variance Authority |
| **State & Data** | Zustand • React Query |
| **Animation** | Framer Motion (smooth transitions, particle fields, scanning effects) |
| **Backend & Auth** | Node.js • Express • Firebase (Auth/DB) • Admin SDK • Render |
| **Monitoring & Testing** | Sentry (Error Tracking) • Playwright (E2E Testing) |
| **Payments** | Razorpay Integration (Multi-method: UPI, Cards, Wallets) |
| **Routing** | React Router DOM with Animated Routes |

</div>

---

## 🚀 Getting Started

### 📋 Prerequisites

```bash
Node.js v18+ 
npm or yarn
```

### ⚡ Local Setup

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/Patel-Sahil-001/promptforge-verse.git
cd promptforge-verse
```

**2️⃣ Configure Environment**

For Frontend:
Copy `.env.example` to `.env.local` inside the `frontend` directory and populate it:
```bash
cd frontend
cp .env.example .env.local
```
Required keys include Firebase credentials and Vite public keys.

For Backend:
Copy `.env.example` to `.env` inside the `backend` directory and populate it:
```bash
cd ../backend
cp .env.example .env
```
Required keys include Firebase Admin credentials, Razorpay public/secret keys, and your choice of LLM provider keys.

**3️⃣ Launch Development Servers**

You will need two terminal windows to run both servers simultaneously.

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*(Runs the Vite frontend server at `localhost:5173`)*

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```
*(Runs the Node.js/Express backend)*

---

## ⚡ Architecture & Firebase Data Map

### 🌐 Overview
* **Frontend**: React SPA served by Vite. Uses code-splitting for heavy routes and optimized mobile layout.
* **API Routes**: REST API powered by Node.js and Express, securely deployed on Render with helmet headers and strict CORS.
* **Auth**: Firebase Client SDK handles login. The backend verifies Firebase Admin JWTs per request.
* **Payments**: Razorpay widget processes payments on the client. A secure backend webhook validates HMAC signatures to update Firestore reliably.

### 🔥 Firestore Collection Map

| Collection | Document Shape | Read Access | Write Access | Purpose |
|:---|:---|:---|:---|:---|
| `profiles` | `{ uid, email, displayName, plan: "free"\|"pro" }` | Self (Authenticated) | Backend Only (Admin) | Primary user profile and subscription tier state. |
| `daily_credits` | `{ uid, credits, date }` | Self (Authenticated) | Backend Only (Admin) | Tracks daily API quotas for free users. |
| `pro_plan_users` | `{ uid, orderId, paymentId, date, active: bool }` | Self (Authenticated) | Backend Only (Admin) | Audit trail of active Pro subscriptions. |
| `payment_logs` | `{ orderId, uid, planId, status, timestamp }` | None (Backend only) | Backend Only (Admin) | Secure webhook idempotency track / transaction history. |

---

## 🎨 Visual Features

- 🌊 **Smooth Page Transitions** powered by Framer Motion
- ✨ **Custom Particle Fields** for immersive backgrounds
- 📊 **Animated Grid Lines** with scanning effects
- 📱 **Mobile Optimized** with disableable heavy animations for performance
- 🎭 **Dynamic UI States** with elegant micro-interactions
- 🌈 **Modern Color Palettes** with gradient accents

---

## 🚀 Deployment Guide

### Deploying the Frontend to Vercel

1. Push your code to GitHub.
2. Import the `frontend` directory into your Vercel dashboard as the root directory.
3. Configure the **Environment Variables** matching `.env`:
   * `VITE_FIREBASE_*`
4. Click **Deploy**. Vercel will build and host your React UI.

### Deploying the Backend to Render

1. Import the `backend` directory into your Render dashboard as a Web Service.
2. Ensure you have the Build Command set to `npm install && npm run build` and Start Command set to `npm start`.
3. Configure Backend **Environment Variables**:
   * `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   * `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   * LLM API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY` etc.)
4. Click **Deploy**. Render will host the Express API endpoints.

### Deploying Firestore Security Rules

To enforce the backend-only write security rules:

```bash
npx firebase-tools deploy --only firestore:rules
```

---

<div align="center">

### 🌟 **Built with passion for prompt engineers**

**Prompt Forge Verse** • *Where ideas become reality*

---

Made with ❤️ by the Prompt Engineering Community

</div>