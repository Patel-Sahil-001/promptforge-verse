/**
 * api/_lib/sentry.ts
 *
 * Server-side Sentry initialisation for Vercel serverless functions.
 * Import captureApiError in any handler to report errors to Sentry.
 *
 * Requires SENTRY_DSN env var set in Vercel dashboard.
 */
import * as Sentry from "@sentry/node";

let initialised = false;

function ensureInit(): void {
    if (initialised) return;
    const dsn = process.env.SENTRY_DSN;
    if (!dsn) return; // Sentry is optional — degrade gracefully if not configured
    Sentry.init({
        dsn,
        environment: process.env.VERCEL_ENV ?? "development",
        tracesSampleRate: 0.1,
    });
    initialised = true;
}

export function captureApiError(
    error: unknown,
    context?: Record<string, unknown>
): void {
    ensureInit();
    Sentry.withScope((scope) => {
        if (context) scope.setExtras(context);
        Sentry.captureException(error);
    });
}
