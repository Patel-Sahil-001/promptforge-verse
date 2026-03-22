import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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
      // Payment is verified
      // Here you would typically update the user's plan in your database
      // e.g., using firebaseAdmin and the user's token/ID
      
      // For now, we will just return success so the frontend can update
      res.status(200).json({ 
        message: 'Payment verified successfully',
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
