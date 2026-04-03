import { Request, Response } from 'express';
import crypto from 'crypto';
import { generateReceipt, ReceiptData } from './_lib/receipt-generator.js';
import { sendReceiptEmail, ReceiptEmailData } from './_lib/email-service.js';

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
    
    // 4. Generate PDF
    const pdfBuffer = await generateReceipt(data);

    // 5. Send Email
    await sendReceiptEmail(data, pdfBuffer);

    // Return 200 properly so Razorpay knows we succeeded
    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process Razorpay Webhook:', error.message || error);
    // Important: we still return 200 if the error isn't critical to Razorpay OR 500 if we want them to retry
    res.status(500).json({ error: 'Internal Server Processing Error' });
  }
}

// -----------------------------------------------------------------------------
// Data Normalisation
// -----------------------------------------------------------------------------

function extractPaymentData(event: any): ReceiptData & ReceiptEmailData {
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
  let planName = payment.notes?.plan_name || 'Premium Script Access';
  let customerName = payment.notes?.name || 'Valued Customer';
  let customerEmail = payment.email;

  // Sometimes email is missing directly on payment payload
  if (!customerEmail && subscription && subscription.notes?.email) {
      customerEmail = subscription.notes.email;
  }
  if (!customerEmail) {
      customerEmail = "Customer"; // Fallback, though Razopay typically enforces this
  }

  // Derive Method specifics
  const paymentMethod = payment.method.toUpperCase();
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
    
    // Attempt logic to parse billing cycle, generic is Monthly if not specified on Razorpay plan
    billingCycle = 'Recurring'; // Adjust based on subscription metadata if you store it
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
  };
}
