import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db, admin, logPaymentEvent, logPlanUpgrade } from './_lib/firebaseAdmin';
import { rateLimit, rateLimitResponse } from './_lib/rateLimit';

// ─── Plan Duration Map ────────────────────────────────────────────────────────
const PLAN_DURATIONS: Record<string, { months: number; label: string; amountINR: number }> = {
  pro_6month: { months: 6,  label: 'Pro 6-Month', amountINR: 25 },
  pro_yearly: { months: 12, label: 'Pro Yearly',  amountINR: 50 },
};

// ─── Timing-Safe Signature Comparison ────────────────────────────────────────
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method guard
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Rate limit
  const { allowed, retryAfter, remaining } = rateLimit(req, { max: 3, windowMs: 60_000, prefix: 'verify-payment' });
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json(rateLimitResponse(retryAfter));
  }

  // 3. Auth — NEVER trust userId from request body; only use the verified JWT uid
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }

  let verifiedUid: string;
  let userEmail: string;
  let displayName: string;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    verifiedUid = decoded.uid;
    userEmail   = decoded.email   || '';
    displayName = decoded.name    || decoded.email || 'User';
  } catch {
    return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
  }

  // 4. Input validation
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
    return res.status(400).json({ message: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, razorpay_signature, planId' });
  }

  const planConfig = PLAN_DURATIONS[planId];
  if (!planConfig) {
    return res.status(400).json({ message: `Unknown planId: '${planId}'` });
  }

  // 5. HMAC-SHA256 signature verification (timing-safe)
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const isAuthentic = timingSafeCompare(expectedSignature, razorpay_signature);

  if (!isAuthentic) {
    void logPaymentEvent({
      userId: verifiedUid, planId,
      orderId: razorpay_order_id, paymentId: razorpay_payment_id,
      status: 'signature_mismatch',
    });
    return res.status(400).json({ message: 'Invalid payment signature', success: false });
  }

  if (!db) {
    console.error('[verify-razorpay-payment] Firebase Admin DB not initialized.');
    return res.status(500).json({ message: 'Database misconfigured on backend.', success: false });
  }

  // 6. Calculate plan dates
  const now       = new Date();
  const startedAt = now.toISOString();
  const expires   = new Date(now);
  expires.setMonth(expires.getMonth() + planConfig.months);
  const expiresAt = expires.toISOString();

  // 7. Firestore write — THE CRITICAL FIX: use .set({ merge: true }) NOT .update()
  // .update() throws if the doc doesn't exist; .set(merge:true) creates-or-merges safely.
  try {
    await db.collection('profiles').doc(verifiedUid).set(
      {
        plan: planId,
        plan_started_at: startedAt,
        plan_expires_at: expiresAt,
      },
      { merge: true }
    );
  } catch (err: any) {
    console.error('[verify-razorpay-payment] Firestore write failed:', err);
    void logPaymentEvent({
      userId: verifiedUid, planId,
      orderId: razorpay_order_id, paymentId: razorpay_payment_id,
      status: 'failed', errorMsg: err.message,
      amountINR: planConfig.amountINR,
    });
    return res.status(500).json({
      message: 'Payment was verified but failed to update your profile. Please contact support.',
      success: false,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  }

  // 8. Fire-and-forget logging (non-blocking)
  void logPaymentEvent({
    userId: verifiedUid, planId,
    orderId: razorpay_order_id, paymentId: razorpay_payment_id,
    status: 'success', amountINR: planConfig.amountINR,
  });
  void logPlanUpgrade({
    userId: verifiedUid, email: userEmail, displayName,
    planId, planStartedAt: startedAt, planExpiresAt: expiresAt,
    orderId: razorpay_order_id, paymentId: razorpay_payment_id,
  });

  // 9. Success response — include profile snapshot for instant frontend state update
  return res.status(200).json({
    success: true,
    message: 'Payment verified and plan upgraded successfully.',
    planId,
    planLabel: planConfig.label,
    profile: {
      plan: planId,
      plan_started_at: startedAt,
      plan_expires_at: expiresAt,
    },
  });
}
