import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { HomeHeader } from "@/components/Header";
import { TopicCard } from "@/components/TopicCard";
import { PageContainer } from "@/components/PageContainer";
import { SearchBar } from "@/components/SearchBar";
export const revalidate = 30;

export default async function HomePage() {
  const payload = await getPayloadClient();

  const topics = await payload.find({
    collection: "topics",
    where: { featured: { equals: true } },
    sort: "order",
    limit: 6,
  });

  return (
    <>
      <HomeHeader />

      <section className="px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto pt-4 pb-6 text-center lg:text-left lg:pt-10 lg:pb-14">
        <h1 className="font-display font-extrabold text-3xl lg:text-6xl leading-tight animate-fade-in-up">
          Learn to say,
          <br />
          what you feel
        </h1>
        <p className="text-ink-muted text-sm lg:text-lg mt-2 lg:mt-4 lg:max-w-xl animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          Because words are bridges between people.
        </p>

        <div className="flex gap-3 justify-center lg:justify-start mt-5 lg:mt-8 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
          <Link href="/learn" className="bg-brand-green text-white font-semibold rounded-pill px-5 py-2.5 lg:px-7 lg:py-3.5 text-sm lg:text-base transition-all duration-200 ease-smooth hover:bg-brand-greenDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0">
            Start Your Journey
          </Link>
          <Link href="/stories" className="border border-ink/20 font-semibold rounded-pill px-5 py-2.5 lg:px-7 lg:py-3.5 text-sm lg:text-base transition-all duration-200 ease-smooth hover:border-ink hover:bg-white hover:-translate-y-0.5 active:translate-y-0">
            Explore Stories
          </Link>
        </div>

        <div className="mt-5 lg:mt-8 lg:max-w-md animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <SearchBar />
        </div>
      </section>

      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:auto-rows-[140px] gap-3 lg:gap-4">
          {topics.docs.map((topic: any, i: number) => (
            <TopicCard key={topic.id} href={`/topics/${topic.slug}`} icon={topic.icon} title={topic.title} meta={`${topic.moduleCount ?? ""} Modules`.trim()} cardColor={topic.cardColor} index={i} featured={i === 0} />
          ))}
          {topics.docs.length === 0 && <p className="col-span-2 lg:col-span-3 text-sm text-ink-muted py-6 text-center">No topics yet — add some in the CMS admin at /admin, mark them "Featured", and they'll show up here.</p>}
        </div>
      </PageContainer>

      <PageContainer className="mt-8 lg:mt-14">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg lg:text-xl">Continue Learning</h2>
          <Link href="/my-space" className="text-sm text-brand-orange font-medium transition-opacity duration-200 hover:opacity-70">
            View All
          </Link>
        </div>
        <p className="text-sm text-ink-muted">Log in to pick up where you left off.</p>
      </PageContainer>
    </>
  );
}
