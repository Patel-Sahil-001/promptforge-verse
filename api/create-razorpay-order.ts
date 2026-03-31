import { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, currency = 'INR', userId, planId } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay amount is in subunits (e.g. cents)
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
      notes: {
        userId: userId || 'unknown',
        planId: planId || 'unknown'
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
