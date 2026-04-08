import { neon } from '@neondatabase/serverless';

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

async function sendViaResend({ to, sourceContext }) {
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
            subject: 'You are subscribed to Credit Hackr updates',
            html: `
                <p>Thanks for subscribing to Credit Hackr updates.</p>
                <p>Source: ${sourceContext || 'site'}.</p>
                <p>You can unsubscribe at any time by contacting support.</p>
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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        res.status(503).json({ error: 'Database not configured' });
        return;
    }

    const body = parseBody(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage.trim() : '';
    const sourceContext = typeof body.sourceContext === 'string' ? body.sourceContext.trim() : '';
    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

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
                subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `;

        const rows = await sql`
            INSERT INTO leads (email, source_page, source_context, metadata)
            VALUES (${email}, ${sourcePage || null}, ${sourceContext || null}, ${JSON.stringify(metadata)})
            ON CONFLICT (email)
            DO UPDATE SET
                source_page = EXCLUDED.source_page,
                source_context = EXCLUDED.source_context,
                metadata = EXCLUDED.metadata,
                updated_at = NOW()
            RETURNING id, email, subscribed_at, updated_at
        `;

        const lead = rows[0];
        const integrationPayload = {
            event: 'lead_captured',
            email,
            sourcePage,
            sourceContext,
            metadata,
            subscribedAt: lead?.subscribed_at,
            updatedAt: lead?.updated_at
        };

        await Promise.allSettled([
            sendToWebhook(integrationPayload),
            sendViaResend({ to: email, sourceContext })
        ]);

        res.status(201).json({ ok: true });
    } catch (e) {
        console.error('[api/leads]', e);
        res.status(503).json({ error: 'Lead capture unavailable' });
    }
}
