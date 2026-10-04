import { pool } from './client'
import dotenv from 'dotenv'

dotenv.config()

const SCHEMA = `
-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT NOT NULL,
  long_description TEXT,
  tech_stack   TEXT[] NOT NULL DEFAULT '{}',
  github_url   TEXT,
  live_url     TEXT,
  image_url    TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  order_index  INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT NOT NULL,
  content      TEXT NOT NULL,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  published    BOOLEAN NOT NULL DEFAULT false,
  cover_image_url TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  category    TEXT NOT NULL CHECK (category IN ('language','framework','tool','cloud','database','other')),
  proficiency SMALLINT NOT NULL DEFAULT 3 CHECK (proficiency BETWEEN 1 AND 5),
  icon_url    TEXT
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug     ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_slug         ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published    ON blog_posts(published);
`

async function migrate() {
  console.log('Running migrations…')
  const client = await pool.connect()
  try {
    await client.query(SCHEMA)
    console.log('✓ Migrations complete')
  } catch (err) {
    console.error('✗ Migration failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
