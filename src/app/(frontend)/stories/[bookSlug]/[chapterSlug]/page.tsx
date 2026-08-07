import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { BreadcrumbHeader } from '@/components/Header'
import { PageContainer } from '@/components/PageContainer'
import { ChapterBody } from '@/components/ChapterBody'
import { BookPaywall } from '@/components/BookPaywall'
import { canAccessChapter } from '@/lib/paywall'

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ bookSlug: string; chapterSlug: string }>
}) {
  const { bookSlug, chapterSlug } = await params
  const payload = await getPayloadClient()

  const [bookResult, chapterResult, { user }] = await Promise.all([
    payload.find({ collection: 'books', where: { slug: { equals: bookSlug } }, limit: 1 }),
    payload.find({ collection: 'chapters', where: { slug: { equals: chapterSlug } }, limit: 1 }),
    payload.auth({ headers: await getHeaders() }),
  ])
  const book = bookResult.docs[0]
  if (!book) notFound()
  const chapter = chapterResult.docs[0]
  if (!chapter) notFound()

  const siblingChapters = await payload.find({
    collection: 'chapters',
    where: { book: { equals: book.id } },
    sort: 'orderInBook',
    limit: 200,
  })
  const currentIndex = siblingChapters.docs.findIndex((c: any) => c.id === chapter.id)
  const nextChapter = currentIndex < siblingChapters.docs.length - 1 ? siblingChapters.docs[currentIndex + 1] : null

  const unlockedBookIds = (user?.unlockedBooks ?? []).map((b: any) => (typeof b === 'string' ? b : b.id))
  const hasAccess = canAccessChapter({
    orderInBook: chapter.orderInBook,
    freeChapterCount: book.freeChapterCount,
    bookId: book.id,
    unlockedBookIds,
  })

  return (
    <>
      <BreadcrumbHeader
        crumbs={[{ label: book.title, href: `/stories/${book.slug}` }, { label: `Ch. ${chapter.orderInBook}` }]}
        backHref={`/stories/${book.slug}`}
      />

      <PageContainer>
        <h1 className="font-display font-extrabold text-2xl lg:text-4xl mb-4 lg:max-w-2xl animate-fade-in-up">{chapter.title}</h1>

        {hasAccess ? (
          <div className="lg:max-w-2xl animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <ChapterBody content={chapter.body} />
            {nextChapter ? (
              <a
                href={`/stories/${book.slug}/${nextChapter.slug}`}
                className="block text-center bg-brand-orange text-white font-semibold rounded-pill px-5 py-3 mt-4 transition-all duration-200 ease-smooth hover:bg-brand-orangeDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
              >
                Next Chapter →
              </a>
            ) : (
              <p className="text-sm text-ink-muted text-center mt-6">
                {book.releaseSchedule === 'weekly' ? "You're caught up — next chapter drops next week." : 'The End.'}
              </p>
            )}
          </div>
        ) : (
          <div className="lg:max-w-2xl">
            <BookPaywall
              bookId={book.id}
              bookTitle={book.title}
              price={book.unlockPrice}
              walletBalance={user?.walletBalance ?? 0}
            />
          </div>
        )}
      </PageContainer>
    </>
  )
}
