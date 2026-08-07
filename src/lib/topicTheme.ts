export type TopicColorKey = 'peach' | 'mint' | 'pink' | 'blue' | 'lavender' | 'butter'

type Theme = {
  heroBg: string // the topic hero card background
  chipBg: string // icon chip background inside the hero
  iconText: string // the icon color itself (deeper tone of the pastel)
  badgeBg: string // "3 Free" style badges
  badgeText: string
  progressFill: string // ProgressBar fill color for this topic's pages
  progressTrack: string
  ring: string // focus/hover ring accent
  hoverIconText: string // pre-composed "group-hover:text-..." class, literal so Tailwind JIT sees it
}

// One entry per homepage card color, reused everywhere that topic's content
// appears (Topic hero, Module hero, Lesson badges/progress). This is what
// makes "Talking in School" feel peach-toned throughout and "Love &
// Relationships" feel pink-toned throughout, instead of every topic page
// looking identical.
const THEMES: Record<TopicColorKey, Theme> = {
  peach: {
    heroBg: 'bg-pastel-peach',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-peach',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-peach',
    progressFill: 'bg-pastelInk-peach',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-peach/30',
    hoverIconText: 'group-hover:text-pastelInk-peach',
  },
  mint: {
    heroBg: 'bg-pastel-mint',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-mint',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-mint',
    progressFill: 'bg-pastelInk-mint',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-mint/30',
    hoverIconText: 'group-hover:text-pastelInk-mint',
  },
  pink: {
    heroBg: 'bg-pastel-pink',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-pink',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-pink',
    progressFill: 'bg-pastelInk-pink',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-pink/30',
    hoverIconText: 'group-hover:text-pastelInk-pink',
  },
  blue: {
    heroBg: 'bg-pastel-blue',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-blue',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-blue',
    progressFill: 'bg-pastelInk-blue',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-blue/30',
    hoverIconText: 'group-hover:text-pastelInk-blue',
  },
  lavender: {
    heroBg: 'bg-pastel-lavender',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-lavender',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-lavender',
    progressFill: 'bg-pastelInk-lavender',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-lavender/30',
    hoverIconText: 'group-hover:text-pastelInk-lavender',
  },
  butter: {
    heroBg: 'bg-pastel-butter',
    chipBg: 'bg-white/70',
    iconText: 'text-pastelInk-butter',
    badgeBg: 'bg-white/70',
    badgeText: 'text-pastelInk-butter',
    progressFill: 'bg-pastelInk-butter',
    progressTrack: 'bg-black/10',
    ring: 'ring-pastelInk-butter/30',
    hoverIconText: 'group-hover:text-pastelInk-butter',
  },
}

export function getTopicTheme(cardColor: string): Theme {
  return THEMES[cardColor as TopicColorKey] ?? THEMES.peach
}
