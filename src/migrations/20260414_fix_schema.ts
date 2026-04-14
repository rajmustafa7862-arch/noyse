import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: fix_schema
 *
 * Applied directly to Supabase on 2026-04-14 via SQL.
 * Adds the media, subscribers, and newsletters tables, and updates posts
 * to use a foreign-key upload relationship for featured images.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── media table ────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS media (
      id              SERIAL PRIMARY KEY,
      alt             VARCHAR,
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      url             VARCHAR,
      thumbnail_u_r_l VARCHAR,
      filename        VARCHAR UNIQUE,
      mime_type       VARCHAR,
      filesize        NUMERIC,
      width           NUMERIC,
      height          NUMERIC,
      focal_x         NUMERIC,
      focal_y         NUMERIC
    )
  `)

  // ── posts: drop old group columns, add upload FK ───────────────
  await db.execute(sql`
    ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS featured_image_id INTEGER
        REFERENCES media(id) ON DELETE SET NULL
  `)

  // ── subscribers table ──────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE enum_subscribers_status AS ENUM ('active', 'unsubscribed');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR NOT NULL UNIQUE,
      subscribed_at TIMESTAMPTZ NOT NULL,
      status        enum_subscribers_status NOT NULL DEFAULT 'active',
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  // ── newsletters table ──────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE enum_newsletters_template AS ENUM ('briefing', 'breaking', 'weekly');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE enum_newsletters_status AS ENUM ('draft', 'sent');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS newsletters (
      id              SERIAL PRIMARY KEY,
      subject         VARCHAR NOT NULL,
      preview_text    VARCHAR,
      template        enum_newsletters_template NOT NULL,
      status          enum_newsletters_status NOT NULL DEFAULT 'draft',
      sent_at         TIMESTAMPTZ,
      recipient_count NUMERIC,
      hero_headline   VARCHAR,
      hero_subtext    VARCHAR,
      body_content    JSONB,
      cta_text        VARCHAR,
      cta_url         VARCHAR,
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS newsletters`)
  await db.execute(sql`DROP TABLE IF EXISTS subscribers`)
  await db.execute(sql`DROP TYPE IF EXISTS enum_newsletters_status`)
  await db.execute(sql`DROP TYPE IF EXISTS enum_newsletters_template`)
  await db.execute(sql`DROP TYPE IF EXISTS enum_subscribers_status`)
  await db.execute(sql`ALTER TABLE posts DROP COLUMN IF EXISTS featured_image_id`)
  await db.execute(sql`DROP TABLE IF EXISTS media`)
}
