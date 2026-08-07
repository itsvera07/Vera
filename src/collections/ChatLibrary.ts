import type { CollectionConfig } from 'payload'

// Matches the "Chat Library" screen: themes (Romantic, College Life, Group
// Discussion, School, Office, Family) each containing sample conversations.
export const ChatThemes: CollectionConfig = {
  slug: 'chat-themes',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'icon',
      type: 'select',
      admin: { description: 'Icon shown next to the theme name' },
      options: [
        { label: 'Heart', value: 'heart' },
        { label: 'Graduation Cap', value: 'graduation-cap' },
        { label: 'People / Group', value: 'users' },
        { label: 'Speech Bubble', value: 'message-circle' },
        { label: 'Briefcase', value: 'briefcase' },
        { label: 'Home', value: 'home' },
      ],
    },
    {
      name: 'color',
      type: 'select',
      options: ['pink', 'blue', 'green', 'yellow', 'purple', 'orange'],
      admin: { description: 'Left-border/accent color for this theme, matched to the Figma chat library screen' },
    },
    { name: 'order', type: 'number' },
  ],
}

export const Chats: CollectionConfig = {
  slug: 'chats',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'theme', type: 'relationship', relationTo: 'chat-themes', required: true },
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Taking things from casual to serious"' } },
    {
      name: 'messages',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'sender',
          type: 'select',
          required: true,
          options: [
            { label: 'Other person (left bubble)', value: 'other' },
            { label: 'You (right bubble, highlighted)', value: 'self' },
          ],
        },
        { name: 'timestamp', type: 'text', admin: { description: 'e.g. "7:14 PM" — cosmetic only' } },
      ],
    },
    { name: 'free', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to make this a paid sample chat' } },
    {
      name: 'linkedLesson',
      type: 'relationship',
      relationTo: 'lessons',
      admin: { description: 'Optional — lets this chat appear inside a related Lesson\'s "Real Conversations" block as a "Read the full chat" link' },
    },
  ],
}
