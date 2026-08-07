import { BreadcrumbHeader } from '@/components/Header'
import { PageContainer } from '@/components/PageContainer'

const FAQS = [
  {
    q: 'How does the wallet work?',
    a: 'Top up your wallet once with any amount, then unlock individual lessons, modules, or story bundles instantly for a few rupees each — no repeated checkout for every small purchase.',
  },
  {
    q: 'Are lessons free?',
    a: 'The first few lessons in every topic are free, forever. Beyond that, unlocking the rest of a topic is a one-time small payment from your wallet.',
  },
  {
    q: 'What happens to content I\u2019ve unlocked if a lesson gets updated?',
    a: 'Anything you\u2019ve already unlocked stays unlocked. Updates to lesson content don\u2019t re-lock anything.',
  },
  {
    q: 'Can I get a refund on a wallet top-up?',
    a: 'Reach out using the contact details below and we\u2019ll take care of it — refunds aren\u2019t automated yet.',
  },
]

export default function HelpPage() {
  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: 'My Space', href: '/my-space' }, { label: 'Help & Support' }]} backHref="/my-space" />

      <PageContainer>
        <div className="flex flex-col gap-3 lg:max-w-2xl">
          {FAQS.map((f, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="bg-white rounded-card p-4 shadow-card animate-fade-in-up"
            >
              <p className="font-semibold text-sm">{f.q}</p>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="bg-pastel-peach rounded-card p-5 mt-6 lg:max-w-2xl">
          <p className="font-display font-bold">Still stuck?</p>
          <p className="text-sm text-ink/80 mt-1">
            Email us at{' '}
            <a href="mailto:hello@vera.app" className="font-semibold underline">
              hello@vera.app
            </a>{' '}
            and we'll get back to you.
          </p>
        </div>
      </PageContainer>
    </>
  )
}
