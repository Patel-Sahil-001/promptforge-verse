import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import { validateEnv } from "./lib/env";

// Fail fast if misconfigured
validateEnv();

createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>
);
