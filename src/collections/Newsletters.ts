import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'template', 'status', 'sentAt', 'recipientCount'],
    description: 'Compose newsletters and send them to all active subscribers.',
  },
  access: {
    read:   ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    // ── Core ─────────────────────────────────────────────────────
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Email Subject Line',
      admin: { description: 'Appears in the recipient\'s inbox as the email subject' },
    },
    {
      name: 'previewText',
      type: 'text',
      label: 'Preview Text',
      admin: { description: 'Short snippet shown in email clients before opening (optional)' },
    },

    // ── Template + Send action (sidebar) ─────────────────────────
    {
      name: 'template',
      type: 'select',
      required: true,
      label: 'Template',
      options: [
        { label: 'Daily Briefing',      value: 'briefing' },
        { label: 'Breaking News Alert', value: 'breaking' },
        { label: 'Weekly Digest',       value: 'weekly' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      // Custom UI component — renders the "Send to All Subscribers" button
      name: 'sendAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: 'src/components/admin/SendNewsletterButton',
            exportName: 'SendNewsletterButton',
          },
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent',  value: 'sent' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent At',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically when the newsletter is sent',
      },
    },
    {
      name: 'recipientCount',
      type: 'number',
      label: 'Recipients',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Number of subscribers this was sent to',
      },
    },

    // ── Content ───────────────────────────────────────────────────
    {
      name: 'heroHeadline',
      type: 'text',
      label: 'Hero Headline',
      admin: { description: 'Large headline at the top of the email' },
    },
    {
      name: 'heroSubtext',
      type: 'textarea',
      label: 'Hero Subtext',
      admin: { description: 'Subheading shown below the hero headline' },
    },
    {
      name: 'bodyContent',
      type: 'richText',
      label: 'Body Content',
      editor: lexicalEditor(),
      admin: { description: 'Main newsletter body — supports rich text formatting' },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      defaultValue: 'Read on NOYSE',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL',
      defaultValue: 'https://noyse.in',
    },
  ],
}
