import { neon } from '@neondatabase/serverless';
import {
    applyApiSecurityHeaders,
    enforceRateLimit,
    enforceSameOriginForPost,
    safeJsonStringify
} from './_security.js';
import { requireAnalyticsBasicAuth } from './_auth.js';

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

export default async function handler(req, res) {
    applyApiSecurityHeaders(res);

    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        res.status(503).json({ error: 'Database not configured' });
        return;
    }

    const sql = neon(databaseUrl);

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS events (
                id BIGSERIAL PRIMARY KEY,
                event_name TEXT NOT NULL,
                source_page TEXT,
                metadata JSONB,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `;
    } catch (e) {
        console.error('[api/events:create-table]', e);
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }

    if (req.method === 'POST') {
        if (!enforceSameOriginForPost(req, res)) return;
        if (!enforceRateLimit(req, res, 'events_post', 120, 60_000)) return;

        const body = parseBody(req);
        const eventName = typeof body.eventName === 'string' ? body.eventName.trim() : '';
        const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage.trim() : '';
        const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

        if (!eventName || eventName.length > 80 || !/^[a-z0-9_]+$/i.test(eventName)) {
            res.status(400).json({ error: 'eventName is required' });
            return;
        }

        try {
            await sql`
                INSERT INTO events (event_name, source_page, metadata)
                VALUES (${eventName}, ${sourcePage.slice(0, 200) || null}, ${safeJsonStringify(metadata)})
            `;
            res.status(201).json({ ok: true });
            return;
        } catch (e) {
            console.error('[api/events:insert]', e);
            res.status(503).json({ error: 'Database unavailable' });
            return;
        }
    }

    if (req.method === 'GET') {
        if (!requireAnalyticsBasicAuth(req, res)) return;
        if (!enforceRateLimit(req, res, 'events_get', 80, 60_000)) return;

        const daysRaw = Number.parseInt(req.query.days, 10);
        const days = Number.isInteger(daysRaw) ? Math.min(Math.max(daysRaw, 1), 90) : 14;

        try {
            const totals = await sql`
                SELECT event_name, COUNT(*)::int AS count
                FROM events
                WHERE created_at >= NOW() - (${days}::text || ' days')::interval
                GROUP BY event_name
                ORDER BY count DESC, event_name ASC
            `;

            const byDay = await sql`
                SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
                FROM events
                WHERE created_at >= NOW() - (${days}::text || ' days')::interval
                GROUP BY created_at::date
                ORDER BY day ASC
            `;

            res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
            res.status(200).json({ days, totals, byDay });
            return;
        } catch (e) {
            console.error('[api/events:summary]', e);
            res.status(503).json({ error: 'Database unavailable' });
            return;
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}
