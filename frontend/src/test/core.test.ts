import { describe, it, expect } from 'vitest';

// ─── sanitizeInput (inline copy for testability) ──────────────────────────────
function sanitizeInput(input: string): string {
    return input
        .trim()
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .slice(0, 5000);
}

describe('sanitizeInput', () => {
    it('trims leading and trailing whitespace', () => {
        expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('removes null bytes and control characters', () => {
        expect(sanitizeInput('hello\u0000world')).toBe('helloworld');
        expect(sanitizeInput('test\u0007bell')).toBe('testbell');
    });

    it('preserves normal unicode text', () => {
        expect(sanitizeInput('Hello, 世界! 🚀')).toBe('Hello, 世界! 🚀');
    });

    it('truncates input longer than 5000 characters', () => {
        const longString = 'a'.repeat(6000);
        expect(sanitizeInput(longString)).toHaveLength(5000);
    });

    it('returns empty string for whitespace-only input', () => {
        expect(sanitizeInput('   ')).toBe('');
    });
});

// ─── PLAN_PRICES validation ───────────────────────────────────────────────────
const PLAN_PRICES: Record<string, { amountPaise: number; displayINR: number; label: string }> = {
    pro_monthly: { amountPaise: 2500, displayINR: 25, label: 'Pro Monthly' },
    pro_yearly:  { amountPaise: 9900, displayINR: 99, label: 'Pro Yearly' },
};

describe('PLAN_PRICES server-side map', () => {
    it('has correct amounts for pro_monthly', () => {
        expect(PLAN_PRICES['pro_monthly'].amountPaise).toBe(2500);
        expect(PLAN_PRICES['pro_monthly'].displayINR).toBe(25);
    });

    it('has correct amounts for pro_yearly', () => {
        expect(PLAN_PRICES['pro_yearly'].amountPaise).toBe(9900);
        expect(PLAN_PRICES['pro_yearly'].displayINR).toBe(99);
    });

    it('rejects unknown plan IDs', () => {
        expect(PLAN_PRICES['pro_enterprise']).toBeUndefined();
    });
});

// ─── timingSafeCompare logic ──────────────────────────────────────────────────
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

describe('timingSafeEqual', () => {
    it('returns true for identical strings', () => {
        expect(timingSafeEqual('abc123', 'abc123')).toBe(true);
    });

    it('returns false for different strings of same length', () => {
        expect(timingSafeEqual('abc123', 'abc124')).toBe(false);
    });

    it('returns false for strings of different length', () => {
        expect(timingSafeEqual('abc', 'abcd')).toBe(false);
    });
});
