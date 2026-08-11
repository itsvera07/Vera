import { getPayloadClient } from "@/lib/payload";
import { BreadcrumbHeader } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { BookOpen } from "@/lib/icons";
import { SearchBar } from "@/components/SearchBar";
import { TiltLink } from "@/components/motion/TiltLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// Without this, Next.js treats this page as fully static since it
// never checks who's logged in — meaning it would freeze at build time
// and never show new content added in /admin. This makes it refresh
// itself at most every 30 seconds instead.
export const revalidate = 30;

export default async function StoriesPage() {
  const payload = await getPayloadClient();
  const themes = await payload.find({ collection: "story-themes", sort: "order", limit: 20 });
  const booksByTheme = await Promise.all(themes.docs.map((t: any) => payload.find({ collection: "books", where: { theme: { equals: t.id } }, limit: 20 })));

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: "Stories" }]} backHref="/" />

      <PageContainer>
        <p className="font-display font-bold text-xl lg:text-3xl mb-1 animate-fade-in-up">Stories</p>
        <p className="text-sm lg:text-base text-ink-muted mb-4 lg:max-w-xl animate-fade-in-up" style={{ animationDelay: "60ms" }}>
          Short fiction that teaches communication, one chapter at a time.
        </p>

        <SearchBar placeholder="Search stories..." className="mb-6 lg:max-w-md" />

        {themes.docs.map((theme: any, i: number) => (
          <section key={theme.id} className="mb-7">
            <p className="font-display font-bold mb-3">{theme.title}</p>
            <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
              {booksByTheme[i].docs.map((book: any, j: number) => (
                <ScrollReveal key={book.id} delay={j * 0.05} variant="tiltIn" className="min-w-[140px] lg:min-w-0 shrink-0">
                  <TiltLink href={`/stories/${book.slug}`} className="bg-white rounded-card shadow-card p-3 transition-shadow duration-300 hover:shadow-lift">
                    <div className="w-full h-32 bg-pastel-peach rounded-xl mb-2 overflow-hidden flex items-center justify-center">
                      {book.cover && typeof book.cover === "object" && book.cover.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.cover.url} alt={book.cover.alt || book.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen size={22} className="text-ink/30" />
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-snug">{book.title}</p>
                    <p className="text-xs text-ink-muted mt-1">{book.releaseSchedule === "weekly" ? "New chapter weekly" : "All chapters available"}</p>
                  </TiltLink>
                </ScrollReveal>
              ))}
              {booksByTheme[i].docs.length === 0 && <p className="text-sm text-ink-muted">No books yet in this theme.</p>}
            </div>
          </section>
        ))}

        {themes.docs.length === 0 && <p className="text-sm text-ink-muted py-6 text-center">No story themes yet — add some in /admin.</p>}
      </PageContainer>
    </>
  );
}
