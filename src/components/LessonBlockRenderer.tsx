import Link from 'next/link'
import { ChatBubbles } from './ChatBubbles'
import { Target, Check, MessageCircle } from '@/lib/icons'

export function LessonBlockRenderer({
  blocks,
  accentClass = 'text-brand-orange',
  linkedChatId = null,
}: {
  blocks: any[]
  accentClass?: string
  linkedChatId?: string | number | null
}) {
  return (
    <div className="flex flex-col gap-4">
      {blocks?.map((block, i) => {
        const delay = { animationDelay: `${i * 70}ms` }
        switch (block.blockType) {
          case 'intro':
            return (
              <p key={i} style={delay} className="text-ink-muted text-sm leading-relaxed animate-fade-in-up">
                {block.body}
              </p>
            )

          case 'concept':
            return (
              <div
                key={i}
                style={delay}
                className="bg-white rounded-card p-4 shadow-card animate-fade-in-up transition-shadow duration-300 hover:shadow-hover"
              >
                <p className="font-semibold flex items-center gap-2">
                  <Target size={16} className={accentClass} /> {block.heading}
                </p>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{block.body}</p>
                {block.points?.length > 0 && (
                  <div className="flex flex-col gap-3 mt-3">
                    {block.points.map((p: any, j: number) => (
                      <div
                        key={j}
                        className="flex gap-3 bg-cream rounded-card p-3 transition-colors duration-200 hover:bg-pastel-peach/50"
                      >
                        <span className="w-6 h-6 rounded-full bg-brand-orange/15 text-brand-orange font-semibold text-xs flex items-center justify-center shrink-0">
                          {j + 1}
                        </span>
                        <p className="text-sm">
                          {p.title && <span className="font-semibold">{p.title}. </span>}
                          {p.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )

          case 'comparison':
            return (
              <div key={i} style={delay} className="flex flex-col gap-2 animate-fade-in-up">
                <div className="bg-white rounded-card p-4 border border-black/5 transition-colors duration-200">
                  <p className="text-xs font-semibold text-ink-muted uppercase">{block.lessEffectiveLabel}</p>
                  <p className="text-sm mt-1">{block.lessEffectiveText}</p>
                </div>
                <div className="bg-free-bg rounded-card p-4 transition-transform duration-200 hover:scale-[1.01]">
                  <p className="text-xs font-semibold text-free-text uppercase">{block.moreEffectiveLabel}</p>
                  <p className="text-sm mt-1">{block.moreEffectiveText}</p>
                </div>
              </div>
            )

          case 'realConversation':
            return (
              <div key={i} style={delay} className="bg-pastel-peach/60 rounded-card p-4 animate-fade-in-up">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${accentClass}`}>
                  {block.heading}
                </p>
                <ChatBubbles messages={block.messages} />
                {linkedChatId && (
                  <Link
                    href={`/chat#chat-${linkedChatId}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-3 bg-white rounded-pill px-4 py-2 transition-all duration-200 ease-smooth hover:shadow-hover hover:-translate-y-0.5"
                  >
                    <MessageCircle size={14} className={accentClass} /> Read the full chat →
                  </Link>
                )}
              </div>
            )

          case 'mediaEmbed': {
            const url = typeof block.file === 'object' ? block.file?.url : null
            return (
              <div key={i} style={delay} className="bg-white rounded-card p-3 shadow-card animate-fade-in-up">
                {block.mediaType === 'audio' ? (
                  <audio controls className="w-full" src={url ?? undefined} />
                ) : (
                  <video controls className="w-full rounded-xl" src={url ?? undefined} />
                )}
                {block.caption && <p className="text-xs text-ink-muted mt-2">{block.caption}</p>}
              </div>
            )
          }

          case 'practice':
            return (
              <div
                key={i}
                style={delay}
                className="bg-white rounded-card p-4 shadow-card border border-dashed border-brand-orange/40 animate-fade-in-up transition-all duration-200 hover:border-brand-orange hover:shadow-hover"
              >
                <p className="text-xs font-semibold text-brand-orange uppercase mb-1">Practice</p>
                <p className="text-sm">{block.prompt}</p>
              </div>
            )

          case 'tryToday':
            return (
              <div key={i} style={delay} className="bg-brand-green rounded-card p-4 text-white animate-fade-in-up">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Try It Today</p>
                <p className="text-sm mt-1 leading-relaxed">{block.body}</p>
                <button className="bg-brand-orange text-white text-sm font-semibold rounded-pill px-4 py-2 mt-3 transition-all duration-200 ease-smooth hover:bg-brand-orangeDark hover:-translate-y-0.5 active:translate-y-0">
                  {block.buttonLabel ?? 'Mark as tried'}
                </button>
              </div>
            )

          case 'takeaways':
            return (
              <div key={i} style={delay} className="bg-white rounded-card p-4 shadow-card animate-fade-in-up">
                <p className="text-xs font-semibold text-ink-muted uppercase mb-2">Key Takeaways</p>
                <ul className="flex flex-col gap-2">
                  {block.items?.map((it: any, j: number) => (
                    <li key={j} className="text-sm flex gap-2 items-start">
                      <Check size={15} className="text-brand-green shrink-0 mt-0.5" />
                      {it.text}
                    </li>
                  ))}
                </ul>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
