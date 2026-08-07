import type { CollectionConfig } from 'payload'
import { lessonContentBlocks } from '../blocks/lessonBlocks'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module', 'orderInTopic'],
    description: 'One lesson screen. Content is built from blocks you add/remove/reorder freely.',
  },
  access: { read: () => true },
  fields: [
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'estimatedMinutes', type: 'number', required: true, admin: { description: 'Shown as "5 min read"' } },
    {
      name: 'orderInModule',
      type: 'number',
      required: true,
      admin: { description: 'Position within the module (1, 2, 3, 4...)' },
    },
    {
      name: 'orderInTopic',
      type: 'number',
      required: true,
      admin: {
        description:
          'Position across the WHOLE topic, counting every lesson in every module in order. This is what decides free-vs-paid: compare against the Topic\'s "Free lesson count". Lesson 1-3 across the topic = free, exactly like the homepage "3 Free" badge.',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: lessonContentBlocks,
      admin: {
        description: 'Add, remove, and drag to reorder sections. Matches Introduction / Learn Concept / See the Difference / Real Conversations / Media / Practice / Try This Today / Key Takeaways from your Figma.',
      },
    },
  ],
}
