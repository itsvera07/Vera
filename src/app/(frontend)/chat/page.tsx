import { getPayloadClient } from '@/lib/payload'
import { BreadcrumbHeader } from '@/components/Header'
import { ChatBubbles } from '@/components/ChatBubbles'
import { PageContainer } from '@/components/PageContainer'
import { ChatThemeIcon, Lock } from '@/lib/icons'
import { SearchBar } from '@/components/SearchBar'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const THEME_COLOR_CLASSES: Record<string, string> = {
  pink: 'bg-pastel-pink',
  blue: 'bg-pastel-blue',
  green: 'bg-pastel-mint',
  yellow: 'bg-pastel-butter',
  purple: 'bg-pastel-lavender',
  orange: 'bg-pastel-peach',
}

export default async function ChatLibraryPage() {
  const payload = await getPayloadClient()
  const themes = await payload.find({ collection: 'chat-themes', sort: 'order', limit: 20 })
  const chatsByTheme = await Promise.all(
    themes.docs.map((t: any) => payload.find({ collection: 'chats', where: { theme: { equals: t.id } }, limit: 20 })),
  )

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: 'Chat Library' }]} backHref="/" />

      <PageContainer>
        <p className="font-display font-bold text-xl lg:text-3xl mb-1 animate-fade-in-up">Chat Library</p>
        <p className="text-sm lg:text-base text-ink-muted mb-4 lg:max-w-xl animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          Real conversations, worked out line by line. Pick a theme and see it play out.
        </p>

        <SearchBar placeholder="Search chats by theme..." className="mb-6 lg:max-w-md" />

        <p className="font-semibold text-sm mb-2">Choose a theme</p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {themes.docs.map((t: any, i: number) => (
            <ScrollReveal key={t.id} delay={i * 0.04}>
              <a
                href={`#theme-${t.slug}`}
                className={`group rounded-card p-3 text-center block transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-hover ${
                  THEME_COLOR_CLASSES[t.color] ?? 'bg-pastel-peach'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-white/70 flex items-center justify-center transition-transform duration-300 ease-smooth group-hover:scale-110">
                  <ChatThemeIcon iconKey={t.icon} className="w-4 h-4 text-ink" />
                </div>
                <p className="text-xs font-semibold mt-1.5">{t.title}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {themes.docs.map((theme: any, i: number) => (
          <section key={theme.id} id={`theme-${theme.slug}`} className="mb-8 scroll-mt-6">
            <p className="text-xs font-semibold text-brand-orange uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ChatThemeIcon iconKey={theme.icon} className="w-3.5 h-3.5" /> {theme.title}
            </p>
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
              {chatsByTheme[i].docs.map((chat: any) => (
                <div
                  key={chat.id}
                  id={`chat-${chat.id}`}
                  className="scroll-mt-20 bg-white rounded-card p-4 shadow-card transition-all duration-300 ease-smooth hover:shadow-hover hover:-translate-y-0.5 target:ring-2 target:ring-brand-orange"
                >
                  <p className="text-xs font-semibold text-ink-muted uppercase mb-2">{chat.title}</p>
                  <ChatBubbles messages={chat.messages} />
                  {!chat.free && (
                    <p className="text-xs text-brand-orange font-medium mt-3 flex items-center gap-1.5">
                      <Lock size={12} /> Unlock in Talking in School
                    </p>
                  )}
                </div>
              ))}
              {chatsByTheme[i].docs.length === 0 && (
                <p className="text-sm text-ink-muted">No chats added yet for this theme.</p>
              )}
            </div>
          </section>
        ))}

        {themes.docs.length === 0 && (
          <p className="text-sm text-ink-muted py-6 text-center">No chat themes yet — add some in /admin.</p>
        )}
      </PageContainer>
    </>
  )
}
