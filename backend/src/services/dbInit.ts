import { Client } from 'pg';

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  organizer        TEXT,
  type             TEXT        NOT NULL DEFAULT 'Hackathon' CHECK (type IN ('Hackathon', 'Workshop', 'Conference', 'Competition')),
  hackathon_date   TIMESTAMP WITH TIME ZONE,
  deadline         TIMESTAMP WITH TIME ZONE,
  registration_url TEXT,
  mode             TEXT        CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
  venue            TEXT,
  registration_fee TEXT,
  eligibility      TEXT,
  min_team_size    INTEGER,
  max_team_size    INTEGER,
  platform         TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Hackathon';

CREATE INDEX IF NOT EXISTS idx_events_deadline        ON events (deadline);
CREATE INDEX IF NOT EXISTS idx_events_hackathon_date  ON events (hackathon_date);
CREATE INDEX IF NOT EXISTS idx_events_platform        ON events (platform);
CREATE INDEX IF NOT EXISTS idx_events_mode            ON events (mode);
CREATE INDEX IF NOT EXISTS idx_events_type            ON events (type);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_events_updated_at ON events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON events;
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);

-- ── Users Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  username      TEXT        NOT NULL UNIQUE,
  email         TEXT        NOT NULL UNIQUE,
  roll_number   TEXT        UNIQUE,
  password_hash TEXT,
  auth_provider TEXT        NOT NULL DEFAULT 'local' CHECK (auth_provider IN ('local', 'google')),
  user_type     TEXT        CHECK (user_type IN ('student', 'faculty')),
  department    TEXT,
  batch_year    INTEGER,
  role          TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrations for existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS batch_year INTEGER;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ALTER COLUMN roll_number DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username    ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email       ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_roll_number ON users (roll_number);
CREATE INDEX IF NOT EXISTS idx_users_role              ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_user_type          ON users (user_type);

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
`;

export async function initializeDatabase(): Promise<boolean> {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.log('\x1b[33m[DB INIT] DATABASE_URL not set in .env; skipping auto-migration.\x1b[0m');
    return false;
  }

  console.log('\x1b[36m[DB INIT] Connecting to PostgreSQL database to verify schema...\x1b[0m');

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(SCHEMA_SQL);
    console.log('\x1b[32m[DB INIT] ✅ Supabase database schema & tables initialized successfully!\x1b[0m');
    return true;
  } catch (err) {
    console.error('\x1b[31m[DB INIT] ❌ Error initializing database schema:\x1b[0m', err instanceof Error ? err.message : err);
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}
