import type { CollectionConfig } from 'payload'

// A Topic = one of the "Popular Topics" cards on the homepage
// (Talking in School, College & Campus Life, Love & Relationships, etc.)
export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'moduleCount', 'updatedAt'],
    description: 'The big cards on Home → Popular Topics, and the Learn page.',
  },
  access: { read: () => true },
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Computed, not stored — always reflects the real number of Module
        // documents linked to this topic, no manual counting needed in the CMS.
        const result = await req.payload.count({
          collection: 'modules',
          where: { topic: { equals: doc.id } },
        })
        doc.moduleCount = result.totalDocs
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Topic name (e.g. "Talking in School")' },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'Used in the URL, e.g. talking-in-school' } },
    { name: 'shortDescription', type: 'textarea', required: true, admin: { description: 'Shown on the topic card and hero, e.g. "Find your voice with classmates, teachers, and new friends..."' } },
    {
      name: 'icon',
      type: 'select',
      required: true,
      admin: { description: 'Icon shown on the topic card' },
      options: [
        { label: 'People / Group', value: 'users' },
        { label: 'Graduation Cap', value: 'graduation-cap' },
        { label: 'Heart', value: 'heart' },
        { label: 'Briefcase', value: 'briefcase' },
        { label: 'Microphone', value: 'mic' },
        { label: 'Speech Bubble', value: 'message-circle' },
        { label: 'Book', value: 'book' },
        { label: 'Sparkles', value: 'sparkles' },
      ],
    },
    {
      name: 'cardColor',
      type: 'select',
      required: true,
      admin: { description: 'Pastel background for the topic card, matched to the Figma palette' },
      options: [
        { label: 'Peach', value: 'peach' },
        { label: 'Mint', value: 'mint' },
        { label: 'Pink', value: 'pink' },
        { label: 'Blue', value: 'blue' },
        { label: 'Lavender', value: 'lavender' },
        { label: 'Butter', value: 'butter' },
      ],
    },
    { name: 'order', type: 'number', admin: { description: 'Lower numbers show first' } },
    { name: 'featured', type: 'checkbox', label: 'Show in Popular Topics on Home' },
    {
      type: 'collapsible',
      label: 'Pricing (paywall)',
      fields: [
        {
          name: 'freeLessonCount',
          type: 'number',
          required: true,
          defaultValue: 3,
          admin: { description: 'How many lessons (counted across the whole topic, in order) are free. E.g. 3 — matches "3 Free" badge on the homepage.' },
        },
        {
          name: 'unlockPrice',
          type: 'number',
          required: true,
          defaultValue: 9,
          admin: { description: 'Price in ₹ (wallet credits) to unlock ALL remaining lessons in this topic, as one bundle.' },
        },
      ],
    },
  ],
}
