import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'topic', 'order'],
    description: 'Sits inside a Topic. E.g. "Breaking the Ice" inside "Talking in School".',
  },
  access: { read: () => true },
  fields: [
    { name: 'topic', type: 'relationship', relationTo: 'topics', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'order', type: 'number', required: true, admin: { description: 'Position within the topic — controls the 1, 2, 3, 4 numbering shown on the Topic page' } },
    {
      name: 'unlockRule',
      type: 'select',
      required: true,
      defaultValue: 'sequential',
      admin: { description: 'Sequential = must finish previous module to open this one (as shown in the mockup with "Locked" tags). Open = always accessible.' },
      options: [
        { label: 'Sequential (locked until previous module done)', value: 'sequential' },
        { label: 'Always open', value: 'open' },
      ],
    },
  ],
}
