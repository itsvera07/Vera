import type { Block } from 'payload'

// Each of these mirrors one visual section from the school-3-lesson Figma
// screen. The editor (you) adds/removes/reorders these freely per lesson —
// nothing about the sequence is hardcoded in the app.

export const IntroBlock: Block = {
  slug: 'intro',
  labels: { singular: 'Introduction', plural: 'Introductions' },
  fields: [
    { name: 'body', type: 'textarea', required: true, label: 'Intro paragraph' },
  ],
}

export const ConceptBlock: Block = {
  slug: 'concept',
  labels: { singular: 'Learn the Concept', plural: 'Learn the Concept blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Why this matters' },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'points',
      type: 'array',
      label: 'Numbered points (optional)',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
  ],
}

export const ComparisonBlock: Block = {
  slug: 'comparison',
  labels: { singular: 'See the Difference', plural: 'See the Difference blocks' },
  fields: [
    { name: 'lessEffectiveLabel', type: 'text', defaultValue: 'Instead of this' },
    { name: 'lessEffectiveText', type: 'textarea', required: true },
    { name: 'moreEffectiveLabel', type: 'text', defaultValue: 'Try this' },
    { name: 'moreEffectiveText', type: 'textarea', required: true },
  ],
}

export const RealConversationBlock: Block = {
  slug: 'realConversation',
  labels: { singular: 'Real Conversation', plural: 'Real Conversations' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'See it in a real chat' },
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
      ],
    },
  ],
}

export const MediaEmbedBlock: Block = {
  slug: 'mediaEmbed',
  labels: { singular: 'Media (audio/video)', plural: 'Media blocks' },
  fields: [
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        { label: 'Short audio clip', value: 'audio' },
        { label: 'Short video clip', value: 'video' },
      ],
    },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const PracticeBlock: Block = {
  slug: 'practice',
  labels: { singular: 'Practice', plural: 'Practice blocks' },
  fields: [
    { name: 'prompt', type: 'textarea', required: true },
  ],
}

export const TryTodayBlock: Block = {
  slug: 'tryToday',
  labels: { singular: 'Try This Today', plural: 'Try This Today blocks' },
  fields: [
    { name: 'body', type: 'textarea', required: true },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Mark as tried' },
  ],
}

export const TakeawaysBlock: Block = {
  slug: 'takeaways',
  labels: { singular: 'Key Takeaways', plural: 'Key Takeaways blocks' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

export const lessonContentBlocks: Block[] = [
  IntroBlock,
  ConceptBlock,
  ComparisonBlock,
  RealConversationBlock,
  MediaEmbedBlock,
  PracticeBlock,
  TryTodayBlock,
  TakeawaysBlock,
]
