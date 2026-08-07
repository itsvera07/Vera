import type { CollectionConfig } from 'payload'

export const StoryThemes: CollectionConfig = {
  slug: 'story-themes',
  admin: { useAsTitle: 'title', description: 'Romance, Suspense, Mystery, Emotional, etc.' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number' },
  ],
}

export const Books: CollectionConfig = {
  slug: 'books',
  admin: { useAsTitle: 'title', description: 'A single story/book within a theme.' },
  access: { read: () => true },
  fields: [
    { name: 'theme', type: 'relationship', relationTo: 'story-themes', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'blurb', type: 'textarea', required: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'releaseSchedule',
      type: 'select',
      required: true,
      defaultValue: 'all-at-once',
      admin: { description: '"Weekly" shows a countdown to the next chapter, like a serialized story.' },
      options: [
        { label: 'All chapters available now', value: 'all-at-once' },
        { label: 'New chapter every week', value: 'weekly' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pricing (paywall)',
      fields: [
        { name: 'freeChapterCount', type: 'number', required: true, defaultValue: 2, admin: { description: 'First N chapters free, e.g. 2.' } },
        { name: 'unlockPrice', type: 'number', required: true, defaultValue: 9, admin: { description: 'Price in ₹ to unlock the rest of the book.' } },
      ],
    },
  ],
}

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'book', type: 'relationship', relationTo: 'books', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'e.g. chapter-3' } },
    { name: 'orderInBook', type: 'number', required: true },
    { name: 'body', type: 'richText' },
    {
      name: 'publishAt',
      type: 'date',
      admin: { description: 'For weekly releases — chapter stays hidden until this date/time, set by you in advance.' },
    },
  ],
}
