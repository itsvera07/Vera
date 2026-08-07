'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BookOpen, MessageCircle, User } from '@/lib/icons'

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/learn', label: 'Explore', icon: Compass },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/chat', label: 'Community', icon: MessageCircle },
  { href: '/my-space', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/5 flex justify-around py-2 px-1 z-50">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors duration-200 ${
              active ? 'text-brand-orange font-semibold' : 'text-ink-muted'
            }`}
          >
            <Icon
              size={20}
              strokeWidth={2.1}
              className={`transition-transform duration-200 ease-smooth ${active ? '-translate-y-0.5 scale-110' : ''}`}
            />
            {tab.label}
            {active && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-orange animate-pop-in" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
