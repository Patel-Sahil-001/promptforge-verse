import { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { db, admin } from './_lib/firebaseAdmin';
import { rateLimit, rateLimitResponse } from './_lib/rateLimit';

// ─── Server-Side Price Map ────────────────────────────────────────────────────
// CRITICAL: Amount is NEVER taken from the request body. Server price only.
const PLAN_PRICES: Record<string, { amountPaise: number; displayINR: number; label: string }> = {
  pro_6month: { amountPaise: 2500, displayINR: 25, label: 'Pro 6-Month' },
  pro_yearly: { amountPaise: 5000, displayINR: 50, label: 'Pro Yearly' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method guard
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Rate limit
  const { allowed, retryAfter, remaining } = rateLimit(req, { max: 5, windowMs: 60_000, prefix: 'create-order' });
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json(rateLimitResponse(retryAfter));
  }

  // 3. Auth — verify JWT token, do NOT trust userId from body
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }

  let verifiedUid: string;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    verifiedUid = decoded.uid;
  } catch {
    return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }

  // 4. Input validation — only read planId and currency from body (NOT amount)
  const { planId, currency = 'INR' } = req.body ?? {};

  if (!planId || !PLAN_PRICES[planId]) {
    return res.status(400).json({ message: `Unknown planId: '${planId}'. Valid values: pro_6month, pro_yearly` });
  }

  const plan = PLAN_PRICES[planId];

  // 5. Idempotency guard — don't re-charge if already on this plan and not expired
  try {
    if (db) {
      const profileSnap = await db.collection('profiles').doc(verifiedUid).get();
      if (profileSnap.exists) {
        const profileData = profileSnap.data();
        if (
          profileData &&
          profileData.plan === planId &&
          profileData.plan_expires_at &&
          new Date(profileData.plan_expires_at) > new Date()
        ) {
          return res.status(409).json({
            message: `You already have an active ${plan.label} plan. It expires on ${new Date(profileData.plan_expires_at).toLocaleDateString()}.`,
          });
        }
      }
    }
  } catch (err) {
    // Non-fatal — proceed to order creation even if this check fails
    console.warn('[create-razorpay-order] Idempotency check failed (non-fatal):', err);
  }

  // 6. Create Razorpay order
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: plan.amountPaise,  // ← from server map, NEVER from request body
      currency: 'INR',           // ← always INR regardless of what client sends
      receipt: `pfv_${verifiedUid.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId: verifiedUid,
        planId,
        planLabel: plan.label,
        amountINR: String(plan.displayINR),
      },
    });

    // 7. Response
    return res.status(200).json({
      ...order,
      displayAmountINR: plan.displayINR,
      planLabel: plan.label,
    });
  } catch (error: any) {
    console.error('[create-razorpay-order] Error creating order:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
