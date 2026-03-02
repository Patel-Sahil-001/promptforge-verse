

# PROMPT.LAB — AI Prompt Generator

## Overview
A full-stack AI prompt generator with scoring, enhancement, and multi-model optimization. Dark, editorial design with custom cursor, grain textures, parallax effects, and smooth scroll animations — matching the provided HTML layout exactly.

---

## Phase 1: Foundation & Core UI

### 1.1 Design System & Layout Shell
- Implement the exact design system: black background, Syne + DM Mono fonts, red/blue/purple accent colors, grain overlay, custom cursor with trail, progress bar
- Navigation bar with blur backdrop, logo, links, and badge
- Smooth scroll animations and scroll-triggered reveal effects throughout

### 1.2 Hero Section
- Full-viewport hero with staggered line-by-line text reveal animation
- Gradient text effect on second line
- Mono-spaced subtitle with fade-up animation
- CTA buttons with clip-path skewed shapes and sweep hover effects
- Scroll hint with animated pulse line
- Marquee ticker rows with dual-direction infinite scroll

### 1.3 Auth System (Supabase)
- User registration and login pages matching the dark editorial aesthetic
- JWT-based auth via Supabase Auth
- User profiles table with username storage
- Protected routes and session management

### 1.4 Prompt Builder (Core Feature)
- **Category Selector**: 5 pill-shaped buttons (LLM, Image Gen, Coding, Creative Writing, Marketing) with slide-in hover fills
- **Dynamic Form**: Data-driven form system — each category defines its own fields (text, textarea, select) rendered automatically
- **Live Preview Panel**: Split-panel layout (form left, preview right) with real-time template rendering as user types
- **Copy to clipboard** with toast confirmation
- Character count display
- All 5 category templates with their specific fields and assembly logic

### 1.5 Prompt CRUD
- Save prompts to Supabase database
- User dashboard showing saved prompts
- Edit and delete functionality
- Prompt versioning (save each edit as a version)

---

## Phase 2: AI Scoring & Enhancement

### 2.1 Prompt Scoring
- "Score My Prompt" button triggers AI evaluation via Supabase Edge Function (using Lovable AI gateway)
- Animated score reveal counting from 0 to final score
- Circular SVG progress ring with gradient fill
- 5-dimension breakdown bars (Clarity, Specificity, Context, Format, Constraints — each /20)
- Color-coded grades: red (0-40), amber (41-70), green (71-100)
- Per-dimension feedback cards with improvement suggestions

### 2.2 AI Enhancement + Diff Viewer
- "Enhance with AI" button sends prompt for AI improvement
- Side-by-side diff viewer showing original vs enhanced (green additions, red removals)
- List of changes displayed as improvement badges
- "Use Enhanced Version" button to replace the current prompt

### 2.3 Loading & Error States
- Skeleton loaders for all AI operations
- Toast notifications for errors and rate limits
- Rate limit handling (display remaining uses)

---

## Phase 3: Multi-Model Optimizer

### 3.1 Model Optimization Engine
- Supabase Edge Function that reformats prompts for 5 target models (GPT-4, Claude, Gemini, Midjourney, DALL-E)
- Model-specific transformation rules (system roles, XML tags, style flags, etc.)

### 3.2 Optimizer UI
- Checkbox grid to select target models
- 3-column results grid — one card per model with the reformatted prompt
- Badge chips showing which optimization rules were applied per model
- Copy button per model output
- Staggered card reveal animations

---

## Phase 4: Additional Sections & Polish

### 4.1 A/B Testing Panel (UI ready)
- Two side-by-side textarea editors for Variant A and B
- Model selector dropdown
- "Run Test" button (connected to AI for simultaneous comparison)
- Winner picker buttons and test history

### 4.2 Marketplace (UI ready)
- Card grid with category badges, score badges, upvote counts
- Search bar with filter chips (category, sort by trending/newest/top)
- Prompt detail view with Fork and Upvote actions
- Publish flow from user's prompt library

### 4.3 Features Strip
- 4-column feature highlight grid with scroll-triggered reveals and hover underline animations

### 4.4 Parallax Text Row
- Large stroke-outlined text that moves on scroll

### 4.5 Scroll Animations
- Intersection Observer-based scroll reveal for all sections
- Magnetic button hover effects
- Card tilt/glow effects on mouse move
- Smooth section transitions

---

## Technical Architecture

- **Frontend**: React + Vite + Tailwind CSS + TypeScript
- **State**: Zustand for global state (auth, prompts, UI)
- **Backend**: Supabase (Auth, PostgreSQL database, Edge Functions)
- **AI**: Lovable AI Gateway (via Supabase Edge Functions) for scoring, enhancement, and optimization
- **Database Tables**: profiles, prompts, prompt_versions, ab_tests, favorites, user_roles
- **Fonts**: Google Fonts — Syne (display) + DM Mono (monospace)

