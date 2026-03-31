# PromptForge Verse API Documentation

This document outlines the serverless API routes provided by the Vercel backend.
All routes process cross-origin resource sharing (CORS), employ security headers, and rate-limit requets (per IP or per UID if authenticated).

## Base URL
Local: `http://localhost:3001` (via `vercel dev`)
Prod: `https://promptforge-verse.vercel.app`

## Error Format
All API errors return a standardized JSON shape to avoid leaking server context:
```json
{
  "error": "A user-friendly message",
  "code": "ERROR_CODE"
}
```

---

## 1. `/api/enhance`

Enhance and optimize a raw prompt via AI.

- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token in `Authorization` header)
- **Rate Limit**: 60 requests / minute (UID-based)

### Request Body
```json
{
  "prompt": "Create a nextjs app",
  "isRegeneration": false
}
```

### Response Shape (200 OK)
```json
{
  "enhancedPrompt": "You are an expert Next.js developer... [optimized prompt]"
}
```

---

## 2. `/api/analyze-image`

Analyze an uploaded image to extract details or create a prompt matching the image.

- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token in `Authorization` header)
- **Rate Limit**: 60 requests / minute (UID-based)

### Request Body
```json
{
  "imageUrl": "data:image/jpeg;base64,..."
}
```

### Response Shape (200 OK)
```json
{
  "prompt": "High-fidelity photograph of a futuristic city..."
}
```

---

## 3. `/api/create-razorpay-order`

Creates a new Razorpay payment order for subscription billing/credit purchase.

- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Rate Limit**: 60 requests / minute

### Request Body 
```json
{
  "planId": "pro",
  "currency": "INR"
}
```

### Response Shape (200 OK)
```json
{
  "id": "order_XXXXXX",
  "amount": 199900,
  "currency": "INR",
  "receipt": "rcpt_XXXXX"
}
```

---

## 4. `/api/verify-razorpay-payment`

Verifies the Razorpay payment via HMAC signatures. Required before fulfilling the upgrade in Firestore.

- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Rate Limit**: 60 requests / minute

### Request Body
```json
{
  "razorpay_order_id": "order_XXXXXX",
  "razorpay_payment_id": "pay_XXXXXX",
  "razorpay_signature": "fa3b8c..."
}
```

### Response (200 OK)
```json
{
  "success": true
}
```
