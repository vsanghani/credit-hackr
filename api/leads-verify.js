import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';
import { applyApiSecurityHeaders } from './_security.js';

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function htmlPage(title, body) {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f7f8fc;color:#111;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}
    .card{max-width:560px;background:#fff;border:1px solid #e7e9f2;border-radius:14px;padding:24px;box-shadow:0 8px 30px rgba(18,26,46,.08)}
    h1{margin:0 0 8px;font-size:1.4rem}
    p{margin:0;color:#4b5563}
  </style>
</head>
<body><main class="card"><h1>${title}</h1><p>${body}</p></main></body></html>`;
}

export default async function handler(req, res) {
    applyApiSecurityHeaders(res);

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        res.status(503).send(htmlPage('Verification unavailable', 'Database is not configured.'));
        return;
    }

    const token = typeof req.query.token === 'string' ? req.query.token.trim() : '';
    if (!token) {
        res.status(400).send(htmlPage('Invalid verification link', 'This verification link is missing a token.'));
        return;
    }

    try {
        const sql = neon(databaseUrl);
        const tokenHash = hashToken(token);
        const rows = await sql`
            SELECT id
            FROM leads
            WHERE verify_token_hash = ${tokenHash}
              AND status = 'pending'
              AND verify_token_expires_at IS NOT NULL
              AND verify_token_expires_at > NOW()
            LIMIT 1
        `;

        if (!rows.length) {
            res.status(400).send(
                htmlPage(
                    'Link expired or invalid',
                    'Please subscribe again to receive a fresh verification link.'
                )
            );
            return;
        }

        await sql`
            UPDATE leads
            SET status = 'verified',
                verify_token_hash = NULL,
                verify_token_expires_at = NULL,
                verified_at = NOW(),
                updated_at = NOW()
            WHERE id = ${rows[0].id}
        `;

        res.status(200).send(
            htmlPage(
                'Subscription confirmed',
                'Your email is verified. You are now subscribed to Credit Hackr updates.'
            )
        );
    } catch (e) {
        console.error('[api/leads-verify]', e);
        res.status(503).send(htmlPage('Verification unavailable', 'Please try again later.'));
    }
}
