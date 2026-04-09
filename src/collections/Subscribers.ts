import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'status'],
    description: 'Newsletter subscribers. Created automatically when someone signs up via the website.',
  },
  // Only logged-in admins can view or delete. Creation is handled exclusively
  // via the /api/newsletter route (which uses overrideAccess on the local API).
  access: {
    read:   ({ req }) => !!req.user,
    create: () => false,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      required: true,
      label: 'Subscribed At',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically on sign-up',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active',        value: 'active' },
        { label: 'Unsubscribed',  value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
