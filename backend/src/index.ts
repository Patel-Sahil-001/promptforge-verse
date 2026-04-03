import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RawBodyRequest } from './razorpay-webhook.js';

// Import handlers
import createRazorpayOrderHandler from './create-razorpay-order.js';
import verifyRazorpayPaymentHandler from './verify-razorpay-payment.js';
import analyzeImageHandler from './analyze-image.js';
import enhanceHandler from './enhance.js';
import razorpayWebhookHandler from './razorpay-webhook.js';

// Load environment variables (useful for local testing)
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use(helmet());

// Enable CORS allowing credentials from the frontend origin
app.use(cors({
    origin: '*', // For production, restrict this to your Vercel frontend domain if you want to be extremely strict
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
}));

// Setup JSON parsing body limit, crucially appending the raw Buffer to req.rawBody
app.use(express.json({
    limit: '10mb',
    verify: (req: RawBodyRequest, res: Response, buf: Buffer) => {
        req.rawBody = buf;
    }
}));

// Health check endpoint (Useful for Render deployment verification)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount the API routes (matching the previous Vercel structure)
app.post('/api/create-razorpay-order', createRazorpayOrderHandler);
app.post('/api/verify-razorpay-payment', verifyRazorpayPaymentHandler);
app.post('/api/analyze-image', analyzeImageHandler);
app.post('/api/enhance', enhanceHandler);

// Mount Webhook route
app.post('/api/webhook/razorpay', razorpayWebhookHandler);

// Start the Express server
app.listen(port, () => {
    console.log(`promptforge-verse-backend successfully started and listening on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
});
