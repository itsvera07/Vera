import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    // Actual storage happens on Cloudinary via the cloudinaryStorage plugin
    // configured in payload.config.ts — this just defines the collection.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description (for accessibility & search)',
    },
  ],
}
