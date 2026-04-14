import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Cloudinary handles all storage — never write to local disk
    disableLocalStorage: true,
  },
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: false,
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
  ],
}
