-- ============================================================
-- OpportunityHub AI — Supabase Schema (Phase 1, 2 & 3)
-- Run this once in the Supabase SQL Editor.
-- Data ingestion is handled externally by a UiPath AI Agent.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Events Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  organizer        TEXT,
  type             TEXT        NOT NULL DEFAULT 'Hackathon' CHECK (type IN ('Hackathon', 'Workshop', 'Conference', 'Competition')),
  hackathon_date   TIMESTAMP WITH TIME ZONE,
  deadline         TIMESTAMP WITH TIME ZONE,
  registration_url TEXT,
  mode             TEXT        CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
  venue            TEXT,        -- NULL or ignored when mode = 'Online'
  registration_fee TEXT,
  eligibility      TEXT,
  min_team_size    INTEGER,
  max_team_size    INTEGER,
  platform         TEXT,        -- e.g. Unstop, Devpost, Hack2Skill
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Indexes on Events ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_events_deadline        ON events (deadline);
CREATE INDEX IF NOT EXISTS idx_events_hackathon_date  ON events (hackathon_date);
CREATE INDEX IF NOT EXISTS idx_events_platform        ON events (platform);
CREATE INDEX IF NOT EXISTS idx_events_mode            ON events (mode);
CREATE INDEX IF NOT EXISTS idx_events_type            ON events (type);

-- Full-text search index on title + organizer + eligibility
CREATE INDEX IF NOT EXISTS idx_events_search
  ON events USING gin (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(organizer, '') || ' ' || coalesce(eligibility, ''))
  );

-- ── Auto-update updated_at trigger for events ─────────────────
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

-- ── Row Level Security for events ─────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON events;
CREATE POLICY "Allow public read access"
  ON events
  FOR SELECT
  USING (true);


-- ── Users Table (Phase 2 & Phase 3 Auth) ─────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  username      TEXT        NOT NULL UNIQUE,
  email         TEXT        NOT NULL UNIQUE,
  roll_number   TEXT        UNIQUE,       -- NULL allowed for Google users
  password_hash TEXT,                     -- NULL allowed for Google users
  auth_provider TEXT        NOT NULL DEFAULT 'local' CHECK (auth_provider IN ('local', 'google')),
  user_type     TEXT        CHECK (user_type IN ('student', 'faculty')),
  department    TEXT,                     -- e.g. cse
  batch_year    INTEGER,                  -- e.g. 2024
  role          TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Migration snippet for existing users table ─────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS batch_year INTEGER;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ALTER COLUMN roll_number DROP NOT NULL;

-- ── Indexes on Users ──────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username    ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email       ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_roll_number ON users (roll_number);
CREATE INDEX IF NOT EXISTS idx_users_role              ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_user_type          ON users (user_type);

-- Auto-update updated_at trigger for users
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security for Users ──────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
