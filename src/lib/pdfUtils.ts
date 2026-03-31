import { jsPDF } from "jspdf";

// ─── New structured receipt API (Task 7) ────────────────────────────────────

export interface ReceiptData {
    paymentId:   string;
    orderId:     string;
    planLabel:   string;
    amountINR:   number;
    email:       string;
    displayName: string;
    expiresAt:   string;
}

export function generateReceipt(data: ReceiptData): void {
    try {
        const doc     = new jsPDF();
        const now     = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
        const expires = new Date(data.expiresAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

        // Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("PromptForge Verse", 20, 25);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Payment Receipt", 20, 33);

        // Divider
        doc.setDrawColor(200);
        doc.line(20, 38, 190, 38);

        // Details table
        const rows: [string, string][] = [
            ["Customer Name",  data.displayName || "—"],
            ["Email",          data.email        || "—"],
            ["Plan",           data.planLabel],
            ["Amount Paid",    `₹${data.amountINR} INR`],
            ["Plan Expires",   expires],
            ["Payment Date",   now],
            ["Payment ID",     data.paymentId],
            ["Order ID",       data.orderId],
            ["Status",         "SUCCESS ✓"],
        ];

        let y = 50;
        doc.setFontSize(10);
        doc.setTextColor(40);
        rows.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(60);
            doc.text(label + ":", 20, y);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(20);
            doc.text(value, 85, y);
            y += 10;
        });

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Thank you for your purchase. This is a computer-generated receipt.", 20, 270);
        doc.text("For support, contact us at support@promptforgeverse.com", 20, 278);

        doc.save(`PromptForge-Receipt-${data.paymentId}.pdf`);
    } catch (err) {
        console.error("[generateReceipt] Failed to generate PDF:", err);
    }
}

// ─── Legacy API (kept for backwards compatibility) ───────────────────────────



export const generatePaymentReceipt = (
    paymentId: string,
    orderId: string,
    planName: string,
    amount: number,
    currency: string,
    userEmail: string | null,
    userName: string | null,
    date: Date = new Date()
) => {
    try {
        const doc = new jsPDF();
        
        // Branding
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(33, 37, 41); // Dark gray
        doc.text("PromptForge Verse", 105, 30, { align: "center" });
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(108, 117, 125); // Slate gray
        doc.text("Payment Receipt", 105, 40, { align: "center" });
        
        // Separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 50, 190, 50);
        
        // Content
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        
        let yPos = 65;
        const lineSpacing = 12;
        
        const textRow = (label: string, value: string) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(value, 80, yPos);
            yPos += lineSpacing;
        };

        textRow("Date:", `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        if (userName) textRow("Customer Name:", userName);
        if (userEmail) textRow("Customer Email:", userEmail);
        textRow("Payment ID:", paymentId);
        textRow("Order ID:", orderId);
        textRow("Plan Name:", planName);
        
        // Amount highlights
        yPos += 5;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Amount Paid:", 20, yPos);
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
        doc.text(formattedAmount, 80, yPos);
        
        // Footer line
        yPos += 20;
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for your purchase!", 105, yPos, { align: "center" });
        
        // Trigger download
        doc.save(`Receipt_${paymentId || Date.now()}.pdf`);
        return true;
    } catch (e) {
        console.error("Failed to generate PDF receipt", e);
        return false;
    }
};
