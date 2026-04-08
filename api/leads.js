import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';
import {
    applyApiSecurityHeaders,
    enforceRateLimit,
    enforceSameOriginForPost,
    safeJsonStringify,
    getClientIpAddress,
    getRequestOrigin
} from './_security.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseBody(req) {
    if (!req.body) return {};
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body);
        } catch {
            return {};
        }
    }
    return req.body;
}

async function sendViaResend({ to, verifyUrl }) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.LEADS_FROM_EMAIL;
    if (!apiKey || !from || !to) return;

    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject: 'Confirm your Credit Hackr subscription',
            html: `
                <p>Please confirm your subscription to Credit Hackr updates.</p>
                <p><a href="${verifyUrl}">Verify my email</a></p>
                <p>This link expires in 24 hours.</p>
            `
        })
    });
}

async function sendToWebhook(payload) {
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (!webhookUrl) return;
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

const suspicionStore = new Map();

function updateSuspicion(ip, signal = 'request') {
    const now = Date.now();
    const record = suspicionStore.get(ip);
    const windowMs = 15 * 60 * 1000;
    if (!record || now > record.resetAt) {
        const next = { score: signal === 'abuse' ? 2 : 1, resetAt: now + windowMs };
        suspicionStore.set(ip, next);
        return next.score;
    }
    record.score += signal === 'abuse' ? 2 : 1;
    suspicionStore.set(ip, record);
    return record.score;
}

function getCaptchaConfig() {
    const provider = process.env.CAPTCHA_PROVIDER;
    if (provider === 'turnstile') {
        return {
            provider,
            siteKey: process.env.TURNSTILE_SITE_KEY,
            secret: process.env.TURNSTILE_SECRET_KEY
        };
    }
    if (provider === 'hcaptcha') {
        return {
            provider,
            siteKey: process.env.HCAPTCHA_SITE_KEY,
            secret: process.env.HCAPTCHA_SECRET_KEY
        };
    }
    return null;
}

async function verifyCaptchaToken({ provider, secret, token, ip }) {
    if (!provider || !secret || !token) return false;

    if (provider === 'turnstile') {
        const body = new URLSearchParams({
            secret,
            response: token,
            remoteip: ip
        });
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        if (!res.ok) return false;
        const payload = await res.json();
        return Boolean(payload.success);
    }

    if (provider === 'hcaptcha') {
        const body = new URLSearchParams({
            secret,
            response: token,
            remoteip: ip
        });
        const res = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        if (!res.ok) return false;
        const payload = await res.json();
        return Boolean(payload.success);
    }

    return false;
}

function generateVerifyToken() {
    return crypto.randomBytes(24).toString('hex');
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function handler(req, res) {
    applyApiSecurityHeaders(res);

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    if (!enforceSameOriginForPost(req, res)) return;
    if (!enforceRateLimit(req, res, 'leads_post', 20, 60_000)) return;

    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        res.status(503).json({ error: 'Database not configured' });
        return;
    }

    const body = parseBody(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage.trim().slice(0, 200) : '';
    const sourceContext = typeof body.sourceContext === 'string' ? body.sourceContext.trim().slice(0, 100) : '';
    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};
    const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken.trim() : '';
    const ip = getClientIpAddress(req);
    const suspicionScore = updateSuspicion(ip, 'request');
    const captchaConfig = getCaptchaConfig();
    const captchaRequired = Boolean(captchaConfig?.secret && captchaConfig?.siteKey && suspicionScore >= 4);

    if (honeypot) {
        updateSuspicion(ip, 'abuse');
        res.status(200).json({ ok: true });
        return;
    }

    if (captchaRequired) {
        const verified = await verifyCaptchaToken({
            provider: captchaConfig.provider,
            secret: captchaConfig.secret,
            token: captchaToken,
            ip
        });
        if (!verified) {
            updateSuspicion(ip, 'abuse');
            res.status(403).json({
                error: 'Captcha required',
                captchaRequired: true,
                captchaProvider: captchaConfig.provider,
                captchaSiteKey: captchaConfig.siteKey
            });
            return;
        }
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        res.status(400).json({ error: 'Valid email is required' });
        return;
    }

    try {
        const sql = neon(databaseUrl);
        await sql`
            CREATE TABLE IF NOT EXISTS leads (
                id BIGSERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                source_page TEXT,
                source_context TEXT,
                metadata JSONB,
                status TEXT NOT NULL DEFAULT 'pending',
                verify_token_hash TEXT,
                verify_token_expires_at TIMESTAMPTZ,
                verified_at TIMESTAMPTZ,
                subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `;
        await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'`;
        await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS verify_token_hash TEXT`;
        await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS verify_token_expires_at TIMESTAMPTZ`;
        await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ`;

        const existing = await sql`SELECT status FROM leads WHERE email = ${email} LIMIT 1`;
        if (existing.length > 0 && existing[0].status === 'verified') {
            res.status(200).json({ ok: true, alreadyVerified: true });
            return;
        }

        const token = generateVerifyToken();
        const tokenHash = hashToken(token);
        const verifyUrl = `${getRequestOrigin(req)}/api/leads-verify?token=${encodeURIComponent(token)}`;

        const rows = await sql`
            INSERT INTO leads (email, source_page, source_context, metadata, status, verify_token_hash, verify_token_expires_at, verified_at)
            VALUES (${email}, ${sourcePage || null}, ${sourceContext || null}, ${safeJsonStringify(metadata)}, 'pending', ${tokenHash}, NOW() + INTERVAL '24 hours', NULL)
            ON CONFLICT (email)
            DO UPDATE SET
                source_page = EXCLUDED.source_page,
                source_context = EXCLUDED.source_context,
                metadata = EXCLUDED.metadata,
                status = 'pending',
                verify_token_hash = EXCLUDED.verify_token_hash,
                verify_token_expires_at = EXCLUDED.verify_token_expires_at,
                verified_at = NULL,
                updated_at = NOW()
            RETURNING id, email, subscribed_at, updated_at
        `;

        const lead = rows[0];
        const integrationPayload = {
            event: 'lead_capture_pending_verification',
            email,
            sourcePage,
            sourceContext,
            metadata,
            subscribedAt: lead?.subscribed_at,
            updatedAt: lead?.updated_at
        };

        await Promise.allSettled([
            sendToWebhook(integrationPayload),
            sendViaResend({ to: email, verifyUrl })
        ]);

        res.status(201).json({
            ok: true,
            verifyRequired: true,
            captchaRequired: false
        });
    } catch (e) {
        console.error('[api/leads]', e);
        res.status(503).json({ error: 'Lead capture unavailable' });
    }
}
