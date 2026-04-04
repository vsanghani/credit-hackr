/**
 * Seeds the cards table from src/data/cardsData.js.
 * Requires POSTGRES_URL (Vercel Postgres) or DATABASE_URL in the environment.
 *
 *   npm run db:seed
 */
import pg from 'pg';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('Set POSTGRES_URL or DATABASE_URL (e.g. from `vercel env pull`).');
        process.exit(1);
    }

    const schemaPath = join(__dirname, '..', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    const { cardsData } = await import('../src/data/cardsData.js');

    const client = new Client({ connectionString });
    await client.connect();

    try {
        await client.query(schema);

        for (const card of cardsData) {
            const { id, ...rest } = card;
            await client.query(
                `INSERT INTO cards (id, data) VALUES ($1, $2::jsonb)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
                [id, JSON.stringify({ ...rest, id })]
            );
        }

        console.log(`Seeded ${cardsData.length} cards.`);
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
