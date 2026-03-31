import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://promptforge-verse.vercel.app',
  'https://www.promptforge-verse.vercel.app',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:5173'] : [])
];

export function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin ?? '';
  
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true; // caller should return immediately
  }
  return false;
}
