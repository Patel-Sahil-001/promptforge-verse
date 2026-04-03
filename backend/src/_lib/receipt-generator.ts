import PDFDocument from 'pdfkit';

// Input data format based on our MASTER_PROMPT
export interface ReceiptData {
  receiptNo: string;
  transactionId: string;
  orderId: string;
  date: string;
  status: string; // e.g. "PAID"
  billingCycle: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  amountFormatted: string; // e.g. "₹499.00"
  paymentMethod: string;
  paymentDetails: string;
  nextBillingDate: string | null;
}

export async function generateReceipt(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Config
      const brandColor = '#6366f1';
      const companyName = process.env.COMPANY_NAME || 'Acme Inc.';
      const tagline = process.env.COMPANY_TAGLINE || 'Premium Subscription';
      const supportEmail = process.env.COMPANY_SUPPORT_EMAIL || 'support@domain.com';

      // --- 1. HEADER BAR ---
      doc.rect(0, 0, doc.page.width, 100).fill(brandColor);
      
      doc.fillColor('white')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text(companyName, 50, 40);
         
      doc.fontSize(12)
         .font('Helvetica')
         .text(tagline, 50, 75);

      // --- 2. TITLE & BADGE ---
      const startY = 140;
      doc.fillColor('#333333')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('Payment Receipt', 50, startY);

      if (data.status.toUpperCase() === 'PAID') {
        // Draw "PAID" badge
        doc.roundedRect(doc.page.width - 110, startY, 60, 25, 4)
           .fillAndStroke('#ecfdf5', '#10b981');
        doc.fillColor('#10b981')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('PAID', doc.page.width - 95, startY + 7);
      }

      doc.moveTo(50, startY + 40)
         .lineTo(doc.page.width - 50, startY + 40)
         .strokeColor('#e5e7eb')
         .stroke();

      // --- 3. METADATA ROW ---
      let currentY = startY + 60;
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
      doc.text('Receipt No.', 50, currentY);
      doc.text('Transaction ID', 200, currentY);
      doc.text('Order/Sub ID', 380, currentY);

      currentY += 15;
      doc.fillColor('#111827').font('Helvetica-Bold');
      doc.text(data.receiptNo, 50, currentY);
      doc.text(data.transactionId, 200, currentY);
      doc.text(data.orderId, 380, currentY);

      currentY += 30;
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
      doc.text('Date', 50, currentY);
      doc.text('Status', 200, currentY);
      doc.text('Billing', 380, currentY);

      currentY += 15;
      doc.fillColor('#111827').font('Helvetica-Bold');
      doc.text(data.date, 50, currentY);
      doc.text(data.status, 200, currentY);
      doc.text(data.billingCycle, 380, currentY);

      currentY += 30;
      doc.moveTo(50, currentY)
         .lineTo(doc.page.width - 50, currentY)
         .strokeColor('#e5e7eb')
         .stroke();

      // --- 4. BILLED TO ---
      currentY += 20;
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold')
         .text('BILLED TO', 50, currentY);
      
      currentY += 15;
      doc.fillColor('#111827').font('Helvetica');
      doc.text(data.customerName, 50, currentY);
      currentY += 15;
      doc.text(data.customerEmail, 50, currentY);

      currentY += 30;
      doc.moveTo(50, currentY)
         .lineTo(doc.page.width - 50, currentY)
         .strokeColor('#e5e7eb')
         .stroke();

      // --- 5. PLAN SUMMARY TABLE ---
      currentY += 20;
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold')
         .text('PLAN SUMMARY', 50, currentY);

      currentY += 25;
      
      // Table Header
      doc.rect(50, currentY, doc.page.width - 100, 25).fill('#f9fafb');
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold');
      doc.text('Description', 60, currentY + 8);
      doc.text('Billing Cycle', 300, currentY + 8);
      doc.text('Amount', 450, currentY + 8);

      currentY += 25;
      
      // Table Body
      doc.fillColor('#111827').font('Helvetica');
      doc.text(data.planName, 60, currentY + 15);
      doc.text(data.billingCycle, 300, currentY + 15);
      doc.text(data.amountFormatted, 450, currentY + 15);

      currentY += 45;
      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).stroke();

      // Total Row
      currentY += 10;
      doc.font('Helvetica-Bold').text('Total Paid', 300, currentY);
      doc.fillColor(brandColor).fontSize(14).text(data.amountFormatted, 450, currentY - 2);

      currentY += 30;
      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).strokeColor('#e5e7eb').stroke();

      // --- 6. PAYMENT DETAILS ---
      currentY += 20;
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold')
         .text('PAYMENT DETAILS', 50, currentY);

      currentY += 20;
      doc.font('Helvetica');
      doc.text(`Method: ${data.paymentMethod}`, 50, currentY);
      currentY += 15;
      doc.text(`Details: ${data.paymentDetails}`, 50, currentY);

      if (data.nextBillingDate) {
        currentY += 15;
        doc.text(`Next Billing: ${data.nextBillingDate}`, 50, currentY);
      }

      // --- 7. FOOTER ---
      doc.fontSize(10).fillColor('#9ca3af')
         .text(`Computer-generated receipt · ${supportEmail}`, 50, doc.page.height - 80, {
            align: 'center',
            width: doc.page.width - 100
         });

      // Bottom Accent Bar
      doc.rect(0, doc.page.height - 20, doc.page.width, 20).fill(brandColor);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
