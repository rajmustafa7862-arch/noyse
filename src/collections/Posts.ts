import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedDate'],
    description: 'News articles and blog posts for NOYSE',
  },
  access: {
    read: ({ req }) => {
      // Published posts are readable by everyone; drafts only by admins
      if (req.user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set publishedDate when status changes to published
        if (data.status === 'published' && !data.publishedDate) {
          return { ...data, publishedDate: new Date().toISOString() }
        }
        return data
      },
    ],
  },
  fields: [
    // ── Core fields ──────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline of the article',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug — auto-generated from title, must be unique',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },

    // ── Featured Image (Cloudinary URL) ──────────────────────────
    {
      name: 'featuredImage',
      type: 'group',
      label: 'Featured Image',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'Cloudinary Image URL',
          admin: {
            description: 'Paste the Cloudinary URL for the featured image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          admin: {
            description: 'Describe the image for accessibility and SEO',
          },
        },
        {
          name: 'width',
          type: 'number',
          label: 'Width (px)',
        },
        {
          name: 'height',
          type: 'number',
          label: 'Height (px)',
        },
      ],
    },

    // ── Category ─────────────────────────────────────────────────
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Politics', value: 'politics' },
        { label: 'Tech', value: 'tech' },
        { label: 'Sports', value: 'sports' },
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'World', value: 'world' },
        { label: 'Business', value: 'business' },
        { label: 'Lifestyle', value: 'lifestyle' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Content (Rich Text) ───────────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
      admin: {
        description: 'Full article content — supports rich text formatting',
      },
    },

    // ── Excerpt ───────────────────────────────────────────────────
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Short summary shown on article cards (max 160 characters)',
      },
    },

    // ── Read Time (auto-calculated) ───────────────────────────────
    {
      name: 'readTime',
      type: 'number',
      label: 'Read Time (minutes)',
      admin: {
        description: 'Auto-calculated from content length — or override manually',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value, data }) => {
            // Auto-calculate read time if not manually set
            if (!value && data?.content) {
              const contentStr = JSON.stringify(data.content)
              const wordCount = contentStr.split(/\s+/).length
              return Math.max(1, Math.ceil(wordCount / 200))
            }
            return value
          },
        ],
      },
    },

    // ── Published Date ────────────────────────────────────────────
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Auto-set when status changes to Published',
      },
    },

    // ── Status ────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── SEO ───────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO Title',
          maxLength: 60,
          admin: {
            description: 'Override for the page <title> tag (max 60 chars)',
          },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          label: 'SEO Description',
          maxLength: 160,
          admin: {
            description: 'Meta description for search engines (max 160 chars)',
          },
        },
      ],
    },

    // ── Affiliate Product (optional) ──────────────────────────────
    {
      name: 'affiliateProduct',
      type: 'group',
      label: 'Affiliate Product (Optional)',
      admin: {
        description:
          'If filled in, a styled product recommendation card will appear below the article',
      },
      fields: [
        {
          name: 'productName',
          type: 'text',
          label: 'Product Name',
        },
        {
          name: 'productImage',
          type: 'group',
          label: 'Product Image',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Image URL',
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
            },
          ],
        },
        {
          name: 'productDescription',
          type: 'textarea',
          label: 'Product Description',
          admin: {
            description: 'Short description of the product',
          },
        },
        {
          name: 'affiliateLink',
          type: 'text',
          label: 'Affiliate Link (URL)',
          admin: {
            description: 'Full URL including https://',
          },
        },
      ],
    },
  ],
}
