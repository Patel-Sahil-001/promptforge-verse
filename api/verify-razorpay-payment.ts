import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db } from './_lib/firebaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
    userId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !planId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Create a signature using the secret and the order details
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      if (!db) {
         console.error("Firebase Admin DB not initialized. Can not update user plan.");
         return res.status(500).json({ message: 'Database misconfigured on backend.', success: false });
      }

      const now = new Date();
      let expiresAt = new Date();
      if (planId === "pro_6month") {
          expiresAt.setMonth(now.getMonth() + 6);
      } else if (planId === "pro_yearly") {
          expiresAt.setFullYear(now.getFullYear() + 1);
      }

      try {
          await db.collection('profiles').doc(userId).update({
              plan: planId,
              plan_started_at: now.toISOString(),
              plan_expires_at: expiresAt.toISOString()
          });
      } catch (dbError) {
          console.error("Error updating profile doc during verification:", dbError);
          return res.status(500).json({ message: 'Failed to update user profile.', success: false });
      }

      res.status(200).json({ 
        message: 'Payment verified and plan updated successfully',
        success: true,
        planId 
      });
    } else {
      res.status(400).json({ message: 'Invalid payment signature', success: false });
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
