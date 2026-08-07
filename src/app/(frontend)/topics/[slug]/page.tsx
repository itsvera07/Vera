import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { BreadcrumbHeader } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { PageContainer } from '@/components/PageContainer'
import { headers as getHeaders } from 'next/headers'
import { TopicIcon, Lock, Check, BookOpen, Gift, Library } from '@/lib/icons'
import { getTopicTheme } from '@/lib/topicTheme'

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  // Run the topic lookup and auth check in parallel — they don't depend on
  // each other, and this alone cuts a full network round trip off the
  // slowest part of the page.
  const [topicResult, { user }] = await Promise.all([
    payload.find({ collection: 'topics', where: { slug: { equals: slug } }, limit: 1 }),
    payload.auth({ headers: await getHeaders() }),
  ])
  const topic = topicResult.docs[0]
  if (!topic) notFound()
  const theme = getTopicTheme(topic.cardColor)

  const modulesResult = await payload.find({
    collection: 'modules',
    where: { topic: { equals: topic.id } },
    sort: 'order',
    limit: 50,
  })

  const lessonCounts = await Promise.all(
    modulesResult.docs.map((m: any) =>
      payload.find({ collection: 'lessons', where: { module: { equals: m.id } }, limit: 100, sort: 'orderInModule' }),
    ),
  )
  const totalLessons = lessonCounts.reduce((sum, r) => sum + r.totalDocs, 0)

  const completedLessonIds = new Set(
    (user?.lessonProgress ?? [])
      .filter((p: any) => p.completed)
      .map((p: any) => (typeof p.lesson === 'string' ? p.lesson : p.lesson?.id)),
  )
  const completedCount = lessonCounts.flatMap((r) => r.docs).filter((l: any) => completedLessonIds.has(l.id)).length

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: 'Home', href: '/' }, { label: 'Popular Topics' }]} backHref="/" />

      <PageContainer>
        <section className={`rounded-card p-5 lg:p-10 ${theme.heroBg} animate-fade-in-up relative overflow-hidden`}>
          <div className="hidden lg:block absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/25" />
          <span className={`w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl ${theme.chipBg} flex items-center justify-center mb-4 relative`}>
            <TopicIcon iconKey={topic.icon} className={`w-5 h-5 lg:w-7 lg:h-7 ${theme.iconText}`} />
          </span>
          <h1 className="font-display font-extrabold text-2xl lg:text-5xl relative">{topic.title}</h1>
          <p className="text-sm lg:text-lg text-ink/70 mt-2 lg:mt-3 lg:max-w-xl relative">{topic.shortDescription}</p>
          <div className="flex gap-4 mt-4 lg:mt-6 text-xs lg:text-sm font-medium text-ink relative">
            <span className="flex items-center gap-1.5">
              <Library size={14} /> {modulesResult.totalDocs} Modules
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} /> {totalLessons} Lessons
            </span>
            <span className={`flex items-center gap-1.5 font-semibold ${theme.iconText}`}>
              <Gift size={14} /> {topic.freeLessonCount} Free
            </span>
          </div>
        </section>

        <section
          className="bg-white rounded-card p-4 shadow-card mt-4 animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-ink-muted">Your progress</span>
            <span className="font-semibold">
              {totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0}%
            </span>
          </div>
          <ProgressBar
            percent={totalLessons ? (completedCount / totalLessons) * 100 : 0}
            fillClassName={theme.progressFill}
          />
          <p className="text-xs text-ink-muted mt-1 text-right">
            {completedCount}/{totalLessons}
          </p>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg lg:text-2xl">Modules</h2>
            <span className="text-sm text-ink-muted">{modulesResult.totalDocs} modules</span>
          </div>

          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
            {modulesResult.docs.map((mod: any, i: number) => {
              const lessons = lessonCounts[i].docs
              const doneInModule = lessons.filter((l: any) => completedLessonIds.has(l.id)).length
              const previousModule = i > 0 ? modulesResult.docs[i - 1] : null
              const previousLessons = i > 0 ? lessonCounts[i - 1].docs : []
              const previousDone = previousLessons.filter((l: any) => completedLessonIds.has(l.id)).length
              const isLocked =
                mod.unlockRule === 'sequential' && previousModule && previousDone < previousLessons.length

              const isComplete = lessons.length > 0 && doneInModule === lessons.length

              return (
                <Link
                  key={mod.id}
                  href={isLocked ? '#' : `/topics/${topic.slug}/${mod.slug}`}
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                  className={`bg-white rounded-card p-4 shadow-card flex items-start gap-3 animate-fade-in-up transition-all duration-300 ease-smooth ${
                    isLocked
                      ? 'opacity-60 pointer-events-none'
                      : 'hover:-translate-y-1 hover:shadow-lift active:scale-[0.99]'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors duration-300 ${
                      isComplete ? 'bg-navy text-white' : `${theme.progressFill} text-white`
                    }`}
                  >
                    {isComplete ? <Check size={15} /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{mod.title}</p>
                      {isLocked && (
                        <span className="text-xs bg-locked-bg text-locked-text px-2 py-0.5 rounded-pill flex items-center gap-1 shrink-0">
                          <Lock size={11} /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">{lessons.length} lessons</p>
                    <ProgressBar
                      percent={lessons.length ? (doneInModule / lessons.length) * 100 : 0}
                      fillClassName={theme.progressFill}
                    />
                  </div>
                </Link>
              )
            })}

            {modulesResult.docs.length === 0 && (
              <p className="text-sm text-ink-muted py-6 text-center lg:col-span-2">
                No modules yet for this topic — add some in /admin.
              </p>
            )}
          </div>
        </section>
      </PageContainer>
    </>
  )
}
