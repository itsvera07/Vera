import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { BreadcrumbHeader } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { Wallet } from "@/lib/icons";
import Link from "next/link";

// This page needs to know who's logged in, so it can never be
// pre-rendered at build time (that would require a database
// connection during the build itself, which is fragile). Force it to
// always render fresh, per request, instead.
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!user) redirect("/login");

  const [transactions, purchases] = await Promise.all([
    payload.find({
      collection: "wallet-transactions",
      where: { user: { equals: user.id } },
      sort: "-createdAt",
      limit: 20,
    }),
    payload.find({
      collection: "purchases",
      where: { user: { equals: user.id } },
      sort: "-createdAt",
      limit: 20,
      depth: 1,
    }),
  ]);

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: "My Space", href: "/my-space" }, { label: "Manage Subscription" }]} backHref="/my-space" />

      <PageContainer>
        <div className="bg-navy rounded-card p-5 text-white flex items-center justify-between animate-fade-in-up">
          <div>
            <p className="text-xs text-white/70">Wallet balance</p>
            <p className="font-display font-bold text-2xl mt-1">₹{user.walletBalance ?? 0}</p>
          </div>
          <Link href="/my-space/wallet" className="bg-brand-orange text-white text-sm font-semibold rounded-pill px-4 py-2.5 flex items-center gap-1.5 transition-all duration-200 ease-smooth hover:-translate-y-0.5">
            <Wallet size={14} /> Top up
          </Link>
        </div>

        <p className="text-xs text-ink-muted mt-3 lg:max-w-md">Vera uses pay-as-you-go wallet credits rather than a recurring subscription — you only ever pay for what you unlock.</p>

        <h2 className="font-display font-bold text-lg mt-8 mb-3">Purchases</h2>
        <div className="flex flex-col gap-2">
          {purchases.docs.map((p: any) => (
            <div key={p.id} className="bg-white rounded-card p-4 shadow-card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{p.itemType === "topic" ? (p.topic?.title ?? "Topic") : (p.book?.title ?? "Book")}</p>
                <p className="text-xs text-ink-muted mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm font-semibold">₹{p.pricePaid}</p>
            </div>
          ))}
          {purchases.docs.length === 0 && <p className="text-sm text-ink-muted">No purchases yet.</p>}
        </div>

        <h2 className="font-display font-bold text-lg mt-8 mb-3">Wallet History</h2>
        <div className="flex flex-col gap-2">
          {transactions.docs.map((t: any) => (
            <div key={t.id} className="bg-white rounded-card p-4 shadow-card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t.note || (t.type === "topup" ? "Wallet top-up" : "Spend")}</p>
                <p className="text-xs text-ink-muted mt-0.5">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <p className={`text-sm font-semibold ${t.amount >= 0 ? "text-brand-green" : "text-ink"}`}>
                {t.amount >= 0 ? "+" : ""}₹{t.amount}
              </p>
            </div>
          ))}
          {transactions.docs.length === 0 && <p className="text-sm text-ink-muted">No wallet activity yet.</p>}
        </div>
      </PageContainer>
    </>
  );
}
