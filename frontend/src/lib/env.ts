// Validates all required environment variables at app start.
// Throws immediately if any are missing — fail fast, never silently.

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_RAZORPAY_KEY_ID',
] as const;

export function validateEnv(): void {
  const missing = required.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[PromptForge] Missing required environment variables:\n${missing.map((k) => `  • ${k}`).join('\n')}\n` +
      `Check your .env.local file or Vercel dashboard.`
    );
  }
}
