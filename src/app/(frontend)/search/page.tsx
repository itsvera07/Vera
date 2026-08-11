import { BreadcrumbHeader } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { SearchBar } from "@/components/SearchBar";
import { TopicCard } from "@/components/TopicCard";
import { TiltLink } from "@/components/motion/TiltLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getPayloadClient } from "@/lib/payload";
import { BookOpen, MessageCircle, ChevronRight } from "@/lib/icons";

// Without this, Next.js treats this page as fully static since it
// never checks who's logged in — meaning it would freeze at build time
// and never show new content added in /admin. This makes it refresh
// itself at most every 30 seconds instead.
export const revalidate = 30;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const payload = await getPayloadClient();

  let topics: any[] = [];
  let lessons: any[] = [];
  let books: any[] = [];
  let chats: any[] = [];

  if (query) {
    const [topicsRes, lessonsRes, booksRes, chatsRes] = await Promise.all([
      payload.find({
        collection: "topics",
        where: { or: [{ title: { contains: query } }, { shortDescription: { contains: query } }] },
        limit: 6,
      }),
      payload.find({
        collection: "lessons",
        where: { title: { contains: query } },
        limit: 8,
        depth: 2, // populate lesson.module and module.topic so we can build the real URL
      }),
      payload.find({
        collection: "books",
        where: { or: [{ title: { contains: query } }, { blurb: { contains: query } }] },
        limit: 6,
      }),
      payload.find({
        collection: "chats",
        where: { title: { contains: query } },
        limit: 6,
      }),
    ]);
    topics = topicsRes.docs;
    lessons = lessonsRes.docs;
    books = booksRes.docs;
    chats = chatsRes.docs;
  }

  const totalResults = topics.length + lessons.length + books.length + chats.length;

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: "Search" }]} backHref="/" />

      <PageContainer>
        <SearchBar defaultValue={query} placeholder="Search topics, lessons, stories, chats..." className="mb-6 lg:max-w-md" />

        {!query && <p className="text-sm text-ink-muted">Type something above to search Vera.</p>}

        {query && totalResults === 0 && <p className="text-sm text-ink-muted">No results for "{query}". Try a different word.</p>}

        {topics.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">Topics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map((topic: any, i: number) => (
                <TopicCard key={topic.id} href={`/topics/${topic.slug}`} icon={topic.icon} title={topic.title} meta={`${topic.moduleCount ?? ""} Modules`.trim()} cardColor={topic.cardColor} index={i} />
              ))}
            </div>
          </section>
        )}

        {lessons.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">Lessons</h2>
            <div className="flex flex-col gap-2">
              {lessons.map((lesson: any, i: number) => {
                const mod = typeof lesson.module === "object" ? lesson.module : null;
                const topic = mod && typeof mod.topic === "object" ? mod.topic : null;
                if (!mod || !topic) return null;
                return (
                  <ScrollReveal key={lesson.id} delay={i * 0.04}>
                    <TiltLink href={`/topics/${topic.slug}/${mod.slug}/${lesson.slug}`} className="bg-white rounded-card p-4 shadow-card flex items-center justify-between transition-shadow duration-300 hover:shadow-hover">
                      <div>
                        <p className="font-semibold text-sm">{lesson.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {topic.title} · {mod.title}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-ink-muted shrink-0" />
                    </TiltLink>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {books.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">Stories</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {books.map((book: any, i: number) => (
                <ScrollReveal key={book.id} delay={i * 0.04}>
                  <TiltLink href={`/stories/${book.slug}`} className="bg-white rounded-card shadow-card p-3 transition-shadow duration-300 hover:shadow-hover">
                    <div className="w-full h-24 bg-pastel-peach rounded-xl mb-2 overflow-hidden flex items-center justify-center">
                      {book.cover && typeof book.cover === "object" && book.cover.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.cover.url} alt={book.cover.alt || book.title} className="w-full h-full object-contain" />
                      ) : (
                        <BookOpen size={18} className="text-ink/30" />
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-snug">{book.title}</p>
                  </TiltLink>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {chats.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">Chat Library</h2>
            <div className="flex flex-col gap-2">
              {chats.map((chat: any, i: number) => (
                <ScrollReveal key={chat.id} delay={i * 0.04}>
                  <TiltLink href={`/chat#chat-${chat.id}`} className="bg-white rounded-card p-4 shadow-card flex items-center gap-3 transition-shadow duration-300 hover:shadow-hover">
                    <MessageCircle size={16} className="text-brand-orange shrink-0" />
                    <p className="font-medium text-sm flex-1">{chat.title}</p>
                    <ChevronRight size={16} className="text-ink-muted shrink-0" />
                  </TiltLink>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </>
  );
}
