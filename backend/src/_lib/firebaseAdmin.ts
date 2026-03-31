import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Required backend env vars
const REQUIRED_BACKEND_ENV = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET'
] as const;

const missing = REQUIRED_BACKEND_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`[PromptForge Backend] Missing essential environment variables: ${missing.join(', ')}`);
}

if (privateKey) {
    // 1. Remove surrounding single quotes or double quotes
    privateKey = privateKey.replace(/^['\"]|['\"]$/g, "");
    // 2. Replace any literal \n characters with actual newlines
    privateKey = privateKey.replace(/\\n/g, "\n");
    // 3. Optional: Clean up any carriage returns that cause Node.js OpenSSL 3 to fail
    privateKey = privateKey.replace(/\r/g, "");
}

if (!admin.apps.length) {
    if (!projectId || !clientEmail || !privateKey) {
        console.warn("⚠️ Firebase Admin credentials not fully provided. Credit limits won't be fully enforced if missing.");
    } else {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }
}

export const db = admin.apps.length ? admin.firestore() : null;
export { admin };

/**
 * Validates a Firebase Bearer token and deducts/checks credits.
 * If out of credits, throws an Error that the route should catch and return as 403.
 *
 * @param token Firebase JWT Token
 */
export async function deductCredits(token: string): Promise<void> {
    if (!admin.apps.length || !db) {
        // Fallback for local development if admin is not configured.
        // It allows the generation to pass.
        console.warn("Admin not initialized, skipping credit deduction.");
        return;
    }

    // 1. Verify token
    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
        throw new Error("Unauthorized. Invalid or expired token.");
    }

    const uid = decodedToken.uid;

    // 2. Read user profile for subscription plan
    const profileRef = db.collection("profiles").doc(uid);
    const profileSnap = await profileRef.get();

    if (profileSnap.exists) {
        const profileData = profileSnap.data();
        if (profileData && profileData.plan && profileData.plan.startsWith("pro_")) {
            // Check expiry before granting unlimited access
            if (profileData.plan_expires_at) {
                const expiresAt = new Date(profileData.plan_expires_at);
                if (expiresAt < new Date()) {
                    // Plan has expired — downgrade user
                    await db.collection("profiles").doc(uid).set(
                        { plan: "free", plan_expires_at: null, plan_started_at: null },
                        { merge: true }
                    );
                    void markPlanExpired(uid);
                    const err = new Error("Your Pro plan has expired. Please renew.");
                    (err as any).code = "PLAN_EXPIRED";
                    throw err;
                }
            }
            // Pro users with valid plan have unlimited credits
            return;
        }
    }

    // 3. Increment/Check Daily Credits
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const dailyCreditRef = db.collection("daily_credits").doc(`${uid}_${today}`);

    try {
        await db.runTransaction(async (transaction) => {
            const dailyCreditDoc = await transaction.get(dailyCreditRef);
            let used = 0;

            if (dailyCreditDoc.exists) {
                const data = dailyCreditDoc.data();
                used = data?.credits_used || 0;
            }

            if (used >= 10) {
                throw new Error("INSUFFICIENT_CREDITS");
            }

            // Deduct / Use credit
            if (!dailyCreditDoc.exists) {
                transaction.set(dailyCreditRef, {
                    user_id: uid,
                    date: today,
                    credits_used: 1,
                });
            } else {
                transaction.update(dailyCreditRef, {
                    credits_used: admin.firestore.FieldValue.increment(1),
                });
            }
        });
    } catch (error) {
        if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
            throw new Error("You have run out of daily free credits. Please upgrade your plan for unlimited generations.");
        }
        throw error; // Let other transaction errors bubble up
    }
}

// ─── Payment Event Logging ────────────────────────────────────────────────────

interface PaymentEventParams {
    userId: string;
    planId: string;
    orderId: string;
    paymentId: string;
    status: "success" | "failed" | "signature_mismatch";
    errorMsg?: string;
    amountINR?: number;
}

/**
 * Logs a payment event to Firestore. This function NEVER throws.
 */
export async function logPaymentEvent(params: PaymentEventParams): Promise<void> {
    try {
        if (!db) return;
        await db.collection("payment_logs").add({
            ...params,
            timestamp: new Date().toISOString(),
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (err) {
        console.error("[logPaymentEvent] Failed to write payment log:", err);
    }
}

// ─── Plan Upgrade Logging ─────────────────────────────────────────────────────

interface PlanUpgradeParams {
    userId: string;
    email: string;
    displayName: string;
    planId: string;
    planStartedAt: string;
    planExpiresAt: string;
    orderId: string;
    paymentId: string;
}

/**
 * Logs a successful plan upgrade to the pro_plan_users collection.
 * Uses userId as the document ID so there's exactly one document per user.
 * This function NEVER throws.
 */
export async function logPlanUpgrade(params: PlanUpgradeParams): Promise<void> {
    try {
        if (!db) return;
        await db.collection("pro_plan_users").doc(params.userId).set({
            ...params,
            upgradedAt: new Date().toISOString(),
            server_ts: admin.firestore.FieldValue.serverTimestamp(),
            active: true,
        });
    } catch (err) {
        console.error("[logPlanUpgrade] Failed to write plan upgrade log:", err);
    }
}

// ─── Mark Plan Expired ────────────────────────────────────────────────────────

/**
 * Marks a user's plan as expired in the pro_plan_users collection.
 * This function NEVER throws.
 */
export async function markPlanExpired(userId: string): Promise<void> {
    try {
        if (!db) return;
        await db.collection("pro_plan_users").doc(userId).set(
            { active: false, expiredAt: new Date().toISOString() },
            { merge: true }
        );
    } catch (err) {
        console.error("[markPlanExpired] Failed to mark plan as expired:", err);
    }
}
