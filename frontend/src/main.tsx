import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import { validateEnv } from "./lib/env";

const rootElement = document.getElementById("root");

try {
  // Fail fast if misconfigured
  validateEnv();

  createRoot(rootElement!).render(
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  );
} catch (error) {
  console.error("Initialization Error:", error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #0F1014; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; font-family: system-ui, sans-serif;">
        <div style="max-width: 600px; width: 100%; background: #1A1112; border: 1px solid rgba(232, 25, 44, 0.4); border-radius: 16px; padding: 32px; box-shadow: 0 0 40px rgba(232, 25, 44, 0.15);">
          <h1 style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 24px; margin-top: 0; display: flex; align-items: center; gap: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8192c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Initialization Error
          </h1>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px; font-size: 14px; line-height: 1.6;">The application failed to start. This is usually due to missing environment variables on the deployment platform (e.g. Vercel).</p>
          <pre style="background: rgba(0,0,0,0.8); color: rgba(255,255,255,0.9); padding: 20px; border-radius: 12px; overflow-x: auto; font-size: 13px; font-family: monospace; white-space: pre-wrap; line-height: 1.6; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 0;">${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>
    `;
  }
}
