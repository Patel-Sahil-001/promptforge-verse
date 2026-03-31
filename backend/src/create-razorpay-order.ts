import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { db, admin } from './_lib/firebaseAdmin.js';
import { rateLimit, rateLimitResponse } from './_lib/rateLimit.js';

// ─── Server-Side Price Map ────────────────────────────────────────────────────
// CRITICAL: Amount is NEVER taken from the request body. Server price only.
const PLAN_PRICES: Record<string, { amountPaise: number; displayINR: number; label: string }> = {
  pro_monthly: { amountPaise: 2500, displayINR: 25, label: 'Pro Monthly' },
  pro_yearly: { amountPaise: 9900, displayINR: 99, label: 'Pro Yearly' },
};

export default async function handler(req: Request, res: Response) {

  // 1. Method guard
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  // Guard: Body Size
  const MAX_BODY_SIZE = 10 * 1024; // 10KB
  const bodyStr = JSON.stringify(req.body ?? {});
  if (Buffer.byteLength(bodyStr, 'utf8') > MAX_BODY_SIZE) {
    return res.status(413).json({ error: 'Request body too large.', code: 'BODY_TOO_LARGE' });
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
    return res.status(401).json({ error: 'Unauthorized. Please sign in.', code: 'UNAUTHORIZED' });
  }

  let verifiedUid: string;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    verifiedUid = decoded.uid;
  } catch {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.', code: 'UNAUTHORIZED' });
  }

  // 4. Input validation — only read planId and currency from body (NOT amount)
  const { planId, currency = 'INR' } = req.body ?? {};

  if (!planId || !PLAN_PRICES[planId]) {
    return res.status(400).json({ error: `Unknown planId: '${planId}'.`, code: 'INVALID_INPUT' });
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
            error: `You already have an active ${plan.label} plan.`,
            code: 'ALREADY_ACTIVE'
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
  } catch (error: unknown) {
    console.error('[create-razorpay-order] Error creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
  }
}
