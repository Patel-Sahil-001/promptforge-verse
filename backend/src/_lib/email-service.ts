import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Lazily initialized transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing SMTP configuration entirely. Emails cannot be sent.');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '465', 10),
    secure: SMTP_SECURE !== 'false', // default true for 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export interface ReceiptEmailData {
  customerName: string;
  customerEmail: string;
  planName: string;
  amountFormatted: string; // e.g. "₹499.00"
  transactionId: string;
  paymentMethod: string;
  paymentDetails: string; // e.g. "Card ending in 4242" or "UPI"
  paymentDate: string;
  nextBillingDate: string | null;
}

export async function sendReceiptEmail(data: ReceiptEmailData, pdfBuffer: Buffer) {
  const companyName = process.env.COMPANY_NAME || 'Acme Inc.';
  const fromEmail = process.env.FROM_EMAIL || 'receipts@domain.com';
  const dashboardUrl = process.env.DASHBOARD_URL || 'https://domain.com/dashboard';

  try {
    const t = getTransporter();

    const subject = `🎉 Your ${data.planName} receipt — Transaction ${data.transactionId.substring(0, 10)}...`;

    // Plain-text alternative
    const textFallback = `
Thank you, ${data.customerName}!

Your payment of ${data.amountFormatted} for the ${data.planName} plan has been received.

Summary:
Transaction ID: ${data.transactionId}
Amount: ${data.amountFormatted}
Payment Method: ${data.paymentMethod} (${data.paymentDetails})
Plan: ${data.planName}
Date: ${data.paymentDate}
${data.nextBillingDate ? `Next Billing: ${data.nextBillingDate}` : ''}

Access your dashboard here: ${dashboardUrl}

Computer-generated receipt · ${process.env.COMPANY_SUPPORT_EMAIL}
    `.trim();

    // HTML Email
    const htmlBody = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #6366f1; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">${companyName}</h2>
        </div>
        <div style="padding: 30px;">
          <h3 style="margin-top: 0;">Thank you, ${data.customerName}!</h3>
          <p>We've successfully received your payment of <strong>${data.amountFormatted}</strong> for your <strong>${data.planName}</strong> plan.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.paymentDate}</p>
            <p style="margin: 5px 0;"><strong>Method:</strong> ${data.paymentMethod} (${data.paymentDetails})</p>
            ${data.nextBillingDate ? `<p style="margin: 5px 0;"><strong>Next Billing:</strong> ${data.nextBillingDate}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${dashboardUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee;">
          <p style="margin: 0;">Please find your official PDF receipt attached to this email.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await t.sendMail({
      from: `"${companyName}" <${fromEmail}>`,
      to: data.customerEmail,
      subject,
      text: textFallback,
      html: htmlBody,
      attachments: [
        {
          filename: `Receipt-${data.transactionId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`Receipt email sent to ${data.customerEmail}. Msg ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    // Don't crash the server if email fails! We just log it so Razorpay receives its 200 OK.
    return false;
  }
}
