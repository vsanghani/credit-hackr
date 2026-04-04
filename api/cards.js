import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

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
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.status(200).json(cards);
    } catch (e) {
        console.error('[api/cards]', e);
        res.status(503).json({ error: 'Database unavailable' });
    }
}
