-- Run once against your Neon (recommended on Vercel) or Postgres database.
-- Neon: Dashboard → SQL Editor, or connect from `npm run db:seed`.

CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY,
    data JSONB NOT NULL
);
