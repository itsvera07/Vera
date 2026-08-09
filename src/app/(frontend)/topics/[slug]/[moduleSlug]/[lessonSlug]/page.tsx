import { notFound } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { getPayloadClient } from "@/lib/payload";
import { BreadcrumbHeader } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { LessonBlockRenderer } from "@/components/LessonBlockRenderer";
import { CompleteLessonButton } from "@/components/CompleteLessonButton";
import { TopicPaywall } from "@/components/TopicPaywall";
import { PageContainer } from "@/components/PageContainer";
import { canAccessLesson } from "@/lib/paywall";
import { getTopicTheme } from "@/lib/topicTheme";
import { Clock, ArrowLeft } from "@/lib/icons";

// This page needs to know who's logged in, so it can never be
// pre-rendered at build time (that would require a database
// connection during the build itself, which is fragile). Force it to
// always render fresh, per request, instead.
export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; moduleSlug: string; lessonSlug: string }> }) {
  const { slug, moduleSlug, lessonSlug } = await params;
  const payload = await getPayloadClient();

  const [topicResult, moduleResult, lessonResult, { user }] = await Promise.all([payload.find({ collection: "topics", where: { slug: { equals: slug } }, limit: 1 }), payload.find({ collection: "modules", where: { slug: { equals: moduleSlug } }, limit: 1 }), payload.find({ collection: "lessons", where: { slug: { equals: lessonSlug } }, limit: 1, depth: 2 }), payload.auth({ headers: await getHeaders() })]);
  const topic = topicResult.docs[0];
  const mod = moduleResult.docs[0];
  const lesson = lessonResult.docs[0];
  if (!topic || !mod || !lesson) notFound();
  const theme = getTopicTheme(topic.cardColor);

  const siblingLessons = await payload.find({
    collection: "lessons",
    where: { module: { equals: mod.id } },
    sort: "orderInModule",
    limit: 100,
  });
  const currentIndex = siblingLessons.docs.findIndex((l: any) => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? siblingLessons.docs[currentIndex - 1] : null;
  const nextLesson = currentIndex < siblingLessons.docs.length - 1 ? siblingLessons.docs[currentIndex + 1] : null;

  const unlockedTopicIds = (user?.unlockedTopics ?? []).map((t: any) => (typeof t === "string" ? t : t.id));
  const hasAccess = canAccessLesson({
    orderInTopic: lesson.orderInTopic,
    freeLessonCount: topic.freeLessonCount,
    topicId: topic.id,
    unlockedTopicIds,
  });

  // If any Chat Library entry links back to this lesson (set on the Chat
  // side via its "linkedLesson" field), surface a "Read the full chat"
  // link under the Real Conversation block.
  const relatedChats = hasAccess ? await payload.find({ collection: "chats", where: { linkedLesson: { equals: lesson.id } }, limit: 1 }) : null;
  const linkedChatId = relatedChats?.docs[0]?.id ?? null;

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: topic.title, href: `/topics/${topic.slug}` }, { label: "Module", href: `/topics/${topic.slug}/${mod.slug}` }, { label: `Lesson ${lesson.orderInModule}` }]} backHref={`/topics/${topic.slug}/${mod.slug}`} />

      <PageContainer>
        <ProgressBar percent={((currentIndex + 1) / siblingLessons.totalDocs) * 100} fillClassName={theme.progressFill} />

        <div className="mt-4 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${theme.badgeBg} ${theme.badgeText} px-2.5 py-1 rounded-pill`}>
              Module {mod.order} · Lesson {lesson.orderInModule}
            </span>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Clock size={12} /> {lesson.estimatedMinutes} min read
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl lg:text-4xl mt-3">{lesson.title}</h1>
        </div>

        <div className="mt-5 lg:max-w-2xl">{hasAccess ? <LessonBlockRenderer blocks={lesson.content ?? []} accentClass={theme.iconText} linkedChatId={linkedChatId} /> : <TopicPaywall topicId={topic.id} topicTitle={topic.title} price={topic.unlockPrice} walletBalance={user?.walletBalance ?? 0} />}</div>

        {hasAccess && (
          <div className="mt-6 lg:max-w-2xl">
            <CompleteLessonButton lessonId={lesson.id} nextHref={nextLesson ? `/topics/${topic.slug}/${mod.slug}/${nextLesson.slug}` : undefined} accentClass={theme.progressFill} />
            <div className="flex gap-3 mt-3">
              {previousLesson && (
                <a href={`/topics/${topic.slug}/${mod.slug}/${previousLesson.slug}`} className="flex-1 flex items-center justify-center gap-1.5 text-center border border-ink/20 rounded-pill py-2.5 text-sm font-medium transition-all duration-200 ease-smooth hover:border-ink hover:bg-white">
                  <ArrowLeft size={14} /> Lesson {previousLesson.orderInModule}
                </a>
              )}
              <a href={`/topics/${topic.slug}/${mod.slug}`} className="flex-1 text-center border border-ink/20 rounded-pill py-2.5 text-sm font-medium transition-all duration-200 ease-smooth hover:border-ink hover:bg-white">
                Back to Module
              </a>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
}
