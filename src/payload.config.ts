import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ── Admin panel ──────────────────────────────────────────────
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— NOYSE Admin',
    },
  },

  // ── Collections ──────────────────────────────────────────────
  collections: [
    Posts,
    Categories,
    // Built-in Users collection for admin auth
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],

  // ── Default rich text editor ──────────────────────────────────
  editor: lexicalEditor(),

  // ── Secret key (from env) ─────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_THIS_SECRET',

  // ── TypeScript output ─────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Database — Supabase PostgreSQL ────────────────────────────
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // ── CORS / CSRF ───────────────────────────────────────────────
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
})
