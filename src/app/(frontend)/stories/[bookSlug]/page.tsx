import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { BreadcrumbHeader } from '@/components/Header'
import { PageContainer } from '@/components/PageContainer'
import { isChapterFree, userHasUnlockedBook } from '@/lib/paywall'
import { Lock, BookOpen, ChevronRight } from '@/lib/icons'

export default async function BookPage({ params }: { params: Promise<{ bookSlug: string }> }) {
  const { bookSlug } = await params
  const payload = await getPayloadClient()

  const [bookResult, { user }] = await Promise.all([
    payload.find({ collection: 'books', where: { slug: { equals: bookSlug } }, limit: 1 }),
    payload.auth({ headers: await getHeaders() }),
  ])
  const book = bookResult.docs[0]
  if (!book) notFound()

  const chapters = await payload.find({
    collection: 'chapters',
    where: { book: { equals: book.id } },
    sort: 'orderInBook',
    limit: 200,
  })

  const unlockedBookIds = (user?.unlockedBooks ?? []).map((b: any) => (typeof b === 'string' ? b : b.id))
  const bookUnlocked = userHasUnlockedBook(unlockedBookIds, book.id)

  const now = new Date()

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: 'Stories', href: '/stories' }, { label: book.title }]} backHref="/stories" />

      <PageContainer>
        <div className="lg:flex lg:gap-8">
          <div className="w-full h-40 lg:w-56 lg:h-56 lg:shrink-0 bg-pastel-peach rounded-card mb-4 flex items-center justify-center animate-fade-in-up">
            <BookOpen size={32} className="text-ink/30" />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <h1 className="font-display font-extrabold text-2xl lg:text-4xl">{book.title}</h1>
            <p className="text-sm lg:text-base text-ink-muted mt-2 lg:max-w-lg">{book.blurb}</p>
            <p className="text-xs text-ink-muted mt-2">
              {book.freeChapterCount} free chapters · unlock the rest for ₹{book.unlockPrice}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          {chapters.docs.map((chapter: any, i: number) => {
            const releasedYet = !chapter.publishAt || new Date(chapter.publishAt) <= now
            const free = isChapterFree(chapter.orderInBook, book.freeChapterCount)
            const accessible = releasedYet && (free || bookUnlocked)

            return (
              <Link
                key={chapter.id}
                href={accessible ? `/stories/${book.slug}/${chapter.slug}` : `/stories/${book.slug}`}
                style={{ animationDelay: `${120 + i * 50}ms` }}
                className={`group bg-white rounded-card p-4 shadow-card flex items-center justify-between animate-fade-in-up transition-all duration-300 ease-smooth ${
                  accessible ? 'hover:-translate-y-0.5 hover:shadow-hover' : 'opacity-60'
                }`}
              >
                <div>
                  <p className="font-semibold text-sm">
                    Chapter {chapter.orderInBook}: {chapter.title}
                  </p>
                  {!releasedYet && (
                    <p className="text-xs text-ink-muted mt-0.5">
                      Releases {new Date(chapter.publishAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {free ? (
                  <span className="text-xs bg-free-bg text-free-text px-2 py-0.5 rounded-pill">Free</span>
                ) : !accessible ? (
                  <Lock size={16} className="text-locked-text" />
                ) : (
                  <ChevronRight
                    size={18}
                    className="text-ink-muted transition-transform duration-200 ease-smooth group-hover:translate-x-1 group-hover:text-brand-orange"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </PageContainer>
    </>
  )
}
