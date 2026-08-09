import Link from "next/link";
import { headers as getHeaders } from "next/headers";
import { getPayloadClient } from "@/lib/payload";
import { PageContainer } from "@/components/PageContainer";
import { Library, BookOpen, Receipt, Hourglass, Bookmark, Flame, Wallet } from "@/lib/icons";
import { TiltLink } from "@/components/motion/TiltLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AccountMenu } from "@/components/AccountMenu";

// This page needs to know who's logged in, so it can never be
// pre-rendered at build time (that would require a database
// connection during the build itself, which is fragile). Force it to
// always render fresh, per request, instead.
export const dynamic = "force-dynamic";

const SECTIONS = [
  { key: "learning", title: "Learning", icon: Library, color: "bg-pastel-peach", hint: (u: any) => `${(u?.lessonProgress ?? []).filter((p: any) => !p.completed).length} in progress` },
  { key: "reading", title: "Reading", icon: BookOpen, color: "bg-pastel-pink", hint: () => "Stories active" },
  { key: "purchases", title: "Purchases", icon: Receipt, color: "bg-pastel-mint", hint: () => "View orders" },
  { key: "saved", title: "Saved Progress", icon: Hourglass, color: "bg-pastel-blue", hint: () => "Continued" },
  { key: "library", title: "Library", icon: Library, color: "bg-pastel-lavender", hint: () => "All content" },
  { key: "bookmarks", title: "Bookmarks", icon: Bookmark, color: "bg-pastel-butter", hint: (u: any) => `${(u?.savedItems ?? []).length} saved` },
];

export default async function MySpacePage() {
  const payload = await getPayloadClient();
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  if (!user) {
    return (
      <PageContainer className="pt-10 text-center lg:text-left">
        <p className="font-display font-bold text-lg mb-2">You're not logged in</p>
        <p className="text-sm text-ink-muted mb-4">Log in to see your progress, purchases, and saved content.</p>
        <Link href="/login" className="inline-block bg-brand-green text-white font-semibold rounded-pill px-5 py-2.5 text-sm transition-all duration-200 ease-smooth hover:bg-brand-greenDark hover:shadow-hover hover:-translate-y-0.5">
          Log in
        </Link>
      </PageContainer>
    );
  }

  const completedCount = (user.lessonProgress ?? []).filter((p: any) => p.completed).length;

  return (
    <PageContainer className="pt-5">
      <h1 className="font-display font-bold text-xl lg:text-2xl mb-4">My Space</h1>

      <div className="bg-navy rounded-card p-5 lg:p-7 text-white animate-fade-in-up">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center font-display font-bold text-lg">{(user.name ?? user.email)[0].toUpperCase()}</span>
          <div>
            <p className="font-semibold">{user.name ?? user.email}</p>
            <p className="text-xs text-white/70">Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/10 rounded-xl p-2 text-center transition-colors duration-200 hover:bg-white/15">
            <p className="font-bold flex items-center justify-center gap-1">
              <Flame size={13} className="text-brand-orange" /> {user.streakDays ?? 0}
            </p>
            <p className="text-[10px] text-white/70">Day streak</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center transition-colors duration-200 hover:bg-white/15">
            <p className="font-bold">{completedCount}</p>
            <p className="text-[10px] text-white/70">Lessons done</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center transition-colors duration-200 hover:bg-white/15">
            <p className="font-bold">₹{user.walletBalance ?? 0}</p>
            <p className="text-[10px] text-white/70">Wallet</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <ScrollReveal key={s.key} delay={i * 0.05} variant="tiltIn">
              <TiltLink href="/my-space" className={`rounded-card p-4 ${s.color} transition-shadow duration-300 hover:shadow-lift`}>
                <span className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center mb-4">
                  <Icon size={17} className="text-ink" />
                </span>
                <p className="font-display font-bold">{s.title}</p>
                <p className="text-sm text-brand-green font-medium mt-1">{s.hint(user)}</p>
              </TiltLink>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="mt-6">
        <Link href="/my-space/wallet" className="flex items-center justify-center gap-2 text-center bg-brand-orange text-white font-semibold rounded-pill px-5 py-3 transition-all duration-200 ease-smooth hover:bg-brand-orangeDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0">
          <Wallet size={16} /> Top up wallet
        </Link>
      </div>

      <AccountMenu />
    </PageContainer>
  );
}
