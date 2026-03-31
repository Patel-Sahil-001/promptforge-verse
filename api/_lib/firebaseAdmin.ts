import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
    // 1. Remove surrounding single quotes or double quotes
    privateKey = privateKey.replace(/^['"]|['"]$/g, "");
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
            // Pro users have unlimited credits
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
