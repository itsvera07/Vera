'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BookOpen, MessageCircle, User } from '@/lib/icons'
import { Logo } from './Header'

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/learn', label: 'Explore', icon: Compass },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/chat', label: 'Chat Library', icon: MessageCircle },
  { href: '/my-space', label: 'My Space', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 px-6 py-8">
      <Link href="/" className="mb-12 px-1">
        <Logo className="text-3xl" />
      </Link>

      <nav className="flex flex-col gap-1.5">
        {TABS.map((tab) => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ease-smooth ${
                active
                  ? 'bg-white text-ink shadow-card'
                  : 'text-ink-muted hover:bg-white/60 hover:text-ink'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-brand-orange" />
              )}
              <Icon
                size={19}
                strokeWidth={2.1}
                className={`transition-all duration-300 ease-smooth ${
                  active ? 'text-brand-orange' : 'group-hover:scale-110 group-hover:text-ink'
                }`}
              />
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-light p-4 text-white overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <p className="text-xs font-medium text-white/70 relative">Today's Challenge</p>
          <p className="text-sm font-semibold mt-1 relative leading-snug">
            Smile and greet 3 people today.
          </p>
        </div>

        <Link
          href="/learn"
          className="block text-center bg-brand-green text-white font-semibold rounded-pill px-4 py-3 text-sm transition-all duration-300 ease-smooth hover:bg-brand-greenDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
        >
          Start Your Journey
        </Link>
      </div>
    </aside>
  )
}
