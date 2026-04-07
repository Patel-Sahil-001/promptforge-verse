import { Request, Response } from 'express';
import crypto from 'crypto';
import { db, logPlanUpgrade } from './_lib/firebaseAdmin.js';
import { generateReceipt, ReceiptData } from './_lib/receipt-generator.js';
import { sendReceiptEmail, ReceiptEmailData } from './_lib/email-service.js';

// ─── Plan Duration Map (Keep sync with verify-razorpay-payment.ts) ────────────
const PLAN_DURATIONS: Record<string, { months: number; label: string }> = {
  pro_monthly: { months: 1,  label: 'Pro Monthly' },
  pro_yearly:  { months: 12, label: 'Pro Yearly'  },
};

// Extends Request to access our new raw buffer populated in index.ts
export interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

export default async function razorpayWebhookHandler(req: RawBodyRequest, res: Response): Promise<void> {
  try {
    const rawBody = req.rawBody;
    const signature = req.headers['x-razorpay-signature'] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!rawBody || !signature || !secret) {
      console.warn('Webhook called without valid signature headers or missing server secret configuration.');
      res.status(400).send('Bad Request / Missing Configuration');
      return;
    }

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay Webhook Signature!');
      res.status(400).send('Invalid signature');
      return;
    }

    // 2. Parse Payload
    const event = req.body;
    console.log(`Received Razorpay Webhook Event: ${event.event}`);

    // If it's an event we don't care about, acknowledge and ignore
    if (event.event !== 'payment.captured' && event.event !== 'subscription.charged') {
      res.status(200).send('Event Ignored');
      return;
    }

    // 3. Extract Normalised Data
    const data = extractPaymentData(event);
    
    // 4. Update Database (If userId and planId exist in metadata/notes)
    if (data.userId && data.planId && db) {
      const planConfig = PLAN_DURATIONS[data.planId] || { months: 1, label: data.planName };
      
      const now = new Date();
      const startedAt = now.toISOString();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + planConfig.months);
      const expiresAt = expires.toISOString();

      try {
        // Update user profile for credit check
        await db.collection('profiles').doc(data.userId).set(
          {
            plan: data.planId,
            plan_started_at: startedAt,
            plan_expires_at: expiresAt,
          },
          { merge: true }
        );

        // Update technical registry for auto-heal
        await logPlanUpgrade({
          userId: data.userId,
          email: data.customerEmail,
          displayName: data.customerName,
          planId: data.planId,
          planStartedAt: startedAt,
          planExpiresAt: expiresAt,
          orderId: data.orderId,
          paymentId: data.transactionId,
        });

        console.log(`[Webhook] Success: Upgraded user ${data.userId} to ${data.planId}`);
      } catch (dbErr) {
        console.error('[Webhook] Database update failed:', dbErr);
        // We still continue to send the receipt even if DB update fails 
        // (though this shouldn't happen with valid creds)
      }
    } else {
      console.warn(`[Webhook] Skipped DB update: Missing userId (${data.userId}) or planId (${data.planId})`);
    }

    // 5. Generate PDF
    const pdfBuffer = await generateReceipt(data);

    // 6. Send Email
    await sendReceiptEmail(data, pdfBuffer);

    // Return 200 properly so Razorpay knows we succeeded
    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process Razorpay Webhook:', error.message || error);
    res.status(500).json({ error: 'Internal Server Processing Error' });
  }
}

// -----------------------------------------------------------------------------
// Data Normalisation
// -----------------------------------------------------------------------------

function extractPaymentData(event: any): ReceiptData & ReceiptEmailData & { userId?: string; planId?: string } {
  const payment = event.payload.payment.entity;
  const subscription = event.payload.subscription?.entity; 

  // Basic payment extraction
  const amountFormatted = `INR ${(payment.amount / 100).toFixed(2)}`;
  const transactionId = payment.id;
  const status = payment.status === 'captured' ? 'PAID' : payment.status.toUpperCase();
  const dateObj = new Date(payment.created_at * 1000);
  const paymentDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  // Extract Plan details and Customer Info
  let planName = payment.notes?.plan_name || payment.notes?.planLabel || 'Premium Script Access';
  let userId = payment.notes?.userId;
  let planId = payment.notes?.planId;
  let customerName = payment.notes?.name || 'Valued Customer';
  let customerEmail = payment.email;

  // If this is a subscription event, notes might be in the subscription object
  if (subscription) {
    userId = userId || subscription.notes?.userId;
    planId = planId || subscription.notes?.planId;
    if (subscription.notes?.email) customerEmail = customerEmail || subscription.notes.email;
  }

  // Sometimes email is missing directly on payment payload
  if (!customerEmail) {
      customerEmail = "Customer"; // Fallback, though Razopay typically enforces this
  }

  // Derive Method specifics
  const paymentMethod = payment.method?.toUpperCase() || 'UNKNOWN';
  let paymentDetails = 'N/A';
  if (paymentMethod === 'CARD' && payment.card) {
    paymentDetails = `${payment.card.network} ending in ${payment.card.last4}`;
  } else if (paymentMethod === 'UPI' && payment.vpa) {
    paymentDetails = `VPA: ${payment.vpa}`;
  } else if (paymentMethod === 'NETBANKING' && payment.bank) {
    paymentDetails = payment.bank;
  }

  // Handle differences between Subscription and One-Time Orders
  let orderId = payment.order_id || 'N/A'; 
  let receiptNo = payment.receipt || `RCPT-${Math.floor(Math.random() * 1000000)}`;
  let billingCycle = 'One-Time';
  let nextBillingDate: string | null = null;

  if (event.event === 'subscription.charged' && subscription) {
    orderId = subscription.id; // Override to Subscription ID
    const nextDateObj = new Date(subscription.current_end * 1000);
    nextBillingDate = nextDateObj.toLocaleDateString('en-US', {
       year: 'numeric', month: 'short', day: 'numeric'
    });
    
    billingCycle = 'Recurring';
  }

  return {
    receiptNo,
    transactionId,
    orderId,
    date: paymentDate,
    paymentDate, 
    status,
    billingCycle,
    customerName,
    customerEmail,
    planName,
    amountFormatted,
    paymentMethod,
    paymentDetails,
    nextBillingDate,
    userId,
    planId,
  };
}
