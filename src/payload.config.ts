import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudinaryStorage } from 'payload-storage-cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'

import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Subscribers } from './collections/Subscribers'
import { Newsletters } from './collections/Newsletters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ── Admin panel ──────────────────────────────────────────────
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— NOYSE Admin',
    },
    importMap: {
      // Disable auto-generation — we manage importMap.js manually.
      // Auto-generation fails in TypeScript projects and can corrupt the map.
      autoGenerate: false,
    },
  },

  // ── Collections ──────────────────────────────────────────────
  collections: [
    Posts,
    Categories,
    Media,
    Subscribers,
    Newsletters,
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

  // ── Plugins ───────────────────────────────────────────────────
  plugins: [
    cloudinaryStorage({
      cloudConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      collections: {
        media: {
          folder: 'noyse-media',
          resourceType: 'auto',
          deleteFromCloudinary: true,
        },
      },
    }),
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
  // max:10 is safe — Supabase free tier allows up to 15 direct connections
  // via the Transaction pooler. min:0 releases idle connections immediately.
  db: postgresAdapter({
    pool: {
      connectionString:  process.env.DATABASE_URI || '',
      min:               0,
      max:               10,
      idleTimeoutMillis: 30000,
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
