import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { BreadcrumbHeader } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { PageContainer } from '@/components/PageContainer'
import { isLessonFree, userHasUnlockedTopic } from '@/lib/paywall'
import { getTopicTheme } from '@/lib/topicTheme'
import { Check, Lock, ChevronRight, BookOpen } from '@/lib/icons'

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>
}) {
  const { slug, moduleSlug } = await params
  const payload = await getPayloadClient()

  const [topicResult, moduleResult, { user }] = await Promise.all([
    payload.find({ collection: 'topics', where: { slug: { equals: slug } }, limit: 1 }),
    payload.find({ collection: 'modules', where: { slug: { equals: moduleSlug } }, limit: 1 }),
    payload.auth({ headers: await getHeaders() }),
  ])
  const topic = topicResult.docs[0]
  const mod = moduleResult.docs[0]
  if (!topic || !mod) notFound()
  const theme = getTopicTheme(topic.cardColor)

  const [lessonsResult, topicModulesCount] = await Promise.all([
    payload.find({ collection: 'lessons', where: { module: { equals: mod.id } }, sort: 'orderInModule', limit: 100 }),
    payload.count({ collection: 'modules', where: { topic: { equals: topic.id } } }),
  ])

  const completedLessonIds = new Set(
    (user?.lessonProgress ?? [])
      .filter((p: any) => p.completed)
      .map((p: any) => (typeof p.lesson === 'string' ? p.lesson : p.lesson?.id)),
  )
  const unlockedTopicIds = (user?.unlockedTopics ?? []).map((t: any) => (typeof t === 'string' ? t : t.id))
  const topicUnlocked = userHasUnlockedTopic(unlockedTopicIds, topic.id)

  const doneCount = lessonsResult.docs.filter((l: any) => completedLessonIds.has(l.id)).length
  const nextLesson = lessonsResult.docs.find((l: any) => !completedLessonIds.has(l.id)) ?? lessonsResult.docs[0]

  return (
    <>
      <BreadcrumbHeader
        crumbs={[{ label: topic.title, href: `/topics/${topic.slug}` }, { label: `Module` }]}
        backHref={`/topics/${topic.slug}`}
      />

      <PageContainer>
        <section className={`rounded-card p-5 lg:p-10 ${theme.heroBg} animate-fade-in-up relative overflow-hidden`}>
          <div className="hidden lg:block absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/25" />
          <p className={`text-xs font-semibold uppercase tracking-wide relative ${theme.badgeText}`}>
            Module {mod.order} of {topicModulesCount.totalDocs}
          </p>
          <h1 className="font-display font-extrabold text-2xl lg:text-5xl mt-1 relative">{mod.title}</h1>
          <p className="text-sm lg:text-lg text-ink/70 mt-2 lg:mt-3 lg:max-w-xl relative">{mod.shortDescription}</p>
          <div className="flex gap-4 mt-4 lg:mt-6 text-xs lg:text-sm font-medium text-ink relative">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} /> {lessonsResult.totalDocs} Lessons
            </span>
          </div>
        </section>

        <section
          className="bg-white rounded-card p-4 shadow-card mt-4 animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <ProgressBar
            percent={lessonsResult.totalDocs ? (doneCount / lessonsResult.totalDocs) * 100 : 0}
            label={`${doneCount} of ${lessonsResult.totalDocs} done`}
            fillClassName={theme.progressFill}
          />
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg lg:text-2xl">Lessons</h2>
            <span className="text-sm text-ink-muted">{lessonsResult.totalDocs} lessons</span>
          </div>

          <div className="flex flex-col gap-3">
            {lessonsResult.docs.map((lesson: any, i: number) => {
              const isDone = completedLessonIds.has(lesson.id)
              const free = isLessonFree(lesson.orderInTopic, topic.freeLessonCount)
              const accessible = free || topicUnlocked
              return (
                <Link
                  key={lesson.id}
                  href={`/topics/${topic.slug}/${mod.slug}/${lesson.slug}`}
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                  className="group bg-white rounded-card p-4 shadow-card flex items-center gap-3 animate-fade-in-up transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift active:scale-[0.99]"
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors duration-300 ${
                      isDone ? 'bg-navy text-white' : `${theme.progressFill} text-white`
                    }`}
                  >
                    {isDone ? <Check size={15} /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-ink-muted">{lesson.estimatedMinutes} min</span>
                      {free && (
                        <span className="text-xs bg-free-bg text-free-text px-2 py-0.5 rounded-pill">Free</span>
                      )}
                    </div>
                  </div>
                  {!accessible ? (
                    <Lock size={16} className="text-locked-text shrink-0" />
                  ) : (
                    <ChevronRight
                      size={18}
                      className={`text-ink-muted shrink-0 transition-transform duration-200 ease-smooth group-hover:translate-x-1 ${theme.hoverIconText}`}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {nextLesson && (
            <Link
              href={`/topics/${topic.slug}/${mod.slug}/${nextLesson.slug}`}
              className={`block text-center ${theme.progressFill} text-white font-semibold rounded-pill px-5 py-3 mt-5 transition-all duration-200 ease-smooth hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0`}
            >
              Continue Lesson {nextLesson.orderInModule} →
            </Link>
          )}
        </section>
      </PageContainer>
    </>
  )
}
