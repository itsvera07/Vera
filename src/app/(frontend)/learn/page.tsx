import { getPayloadClient } from "@/lib/payload";
import { BreadcrumbHeader } from "@/components/Header";
import { TopicCard } from "@/components/TopicCard";
import { PageContainer } from "@/components/PageContainer";
import { SearchBar } from "@/components/SearchBar";
export const revalidate = 30;
export default async function LearnPage() {
  const payload = await getPayloadClient();
  const topics = await payload.find({ collection: "topics", sort: "order", limit: 50 });

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: "Learn" }]} backHref="/" />

      <PageContainer>
        <SearchBar className="mb-6 lg:max-w-md" />

        <h2 className="font-display font-bold text-lg lg:text-xl mb-3">All Categories</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {topics.docs.map((topic: any, i: number) => (
            <TopicCard key={topic.id} href={`/topics/${topic.slug}`} icon={topic.icon} title={topic.title} meta={`${topic.moduleCount ?? 0} Modules`} cardColor={topic.cardColor} index={i} />
          ))}
          {topics.docs.length === 0 && <p className="col-span-2 lg:col-span-3 text-sm text-ink-muted py-6 text-center">No topics yet — add some in /admin.</p>}
        </div>
      </PageContainer>
    </>
  );
}
