-- Run once against your Neon (recommended on Vercel) or Postgres database.
-- Neon: Dashboard → SQL Editor, or connect from `npm run db:seed`.

CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    event_name TEXT NOT NULL,
    source_page TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_name_created_at ON events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);

-- Recommendation runs are optional but useful for analytics/debugging ranking output over time.
CREATE TABLE IF NOT EXISTS recommendation_runs (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source_page TEXT,
    source_context TEXT,
    metadata JSONB,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_subscribed_at ON leads (subscribed_at DESC);
