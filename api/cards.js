import { neon } from '@neondatabase/serverless';
import { applyApiSecurityHeaders, enforceRateLimit } from './_security.js';

function parseNumberParam(value) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseIdsParam(value) {
    if (!value) return null;
    const ids = value
        .split(',')
        .map((part) => Number.parseInt(part.trim(), 10))
        .filter(Number.isInteger);
    return ids.length > 0 ? new Set(ids) : null;
}

function matchesSearch(card, search) {
    if (!search) return true;
    const q = search.toLowerCase();
    const issuer = (card.issuer || '').toLowerCase();
    return (
        (card.name || '').toLowerCase().includes(q) ||
        (card.description || '').toLowerCase().includes(q) ||
        (card.feature || '').toLowerCase().includes(q) ||
        issuer.includes(q)
    );
}

export default async function handler(req, res) {
    applyApiSecurityHeaders(res);

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    if (!enforceRateLimit(req, res, 'cards_get', 120, 60_000)) return;

    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        res.status(503).json({ error: 'Database not configured' });
        return;
    }

    try {
        const sql = neon(databaseUrl);
        const rows = await sql`SELECT id, data FROM cards ORDER BY id ASC`;
        const cards = rows.map((row) => {
            const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            return { ...data, id: row.id };
        });

        const search = (req.query.search || '').trim();
        const category = (req.query.category || '').trim();
        const minAnnualFee = parseNumberParam(req.query.minAnnualFee);
        const maxAnnualFee = parseNumberParam(req.query.maxAnnualFee);
        const maxInterestRate = parseNumberParam(req.query.maxInterestRate);
        const maxForeignFee = parseNumberParam(req.query.maxForeignFee);
        const minEarnRate = parseNumberParam(req.query.minEarnRate);
        const idsSet = parseIdsParam(req.query.ids);

        const filteredCards = cards.filter((card) => {
            const annualFee = Number(card?.fees?.annual);
            const interestRate = Number(card?.interestRate);
            const foreignFee = Number(card?.fees?.foreign);
            const earnRate = Number(card?.earnRate);

            if (!matchesSearch(card, search)) return false;
            if (category && card.category !== category) return false;
            if (idsSet && !idsSet.has(card.id)) return false;
            if (minAnnualFee !== null && (!Number.isFinite(annualFee) || annualFee < minAnnualFee)) return false;
            if (maxAnnualFee !== null && (!Number.isFinite(annualFee) || annualFee > maxAnnualFee)) return false;
            if (maxInterestRate !== null && (!Number.isFinite(interestRate) || interestRate > maxInterestRate)) return false;
            if (maxForeignFee !== null && (!Number.isFinite(foreignFee) || foreignFee > maxForeignFee)) return false;
            if (minEarnRate !== null && (!Number.isFinite(earnRate) || earnRate < minEarnRate)) return false;
            return true;
        });

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.status(200).json(filteredCards);
    } catch (e) {
        console.error('[api/cards]', e);
        res.status(503).json({ error: 'Database unavailable' });
    }
}
