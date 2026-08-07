'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Settings, Bell, CreditCard, HelpCircle, LogOut, ChevronRight } from '@/lib/icons'

const ITEMS = [
  { label: 'Account Settings', icon: Settings, href: '/my-space/settings' },
  { label: 'Notifications', icon: Bell, href: '/my-space/notifications' },
  { label: 'Manage Subscription', icon: CreditCard, href: '/my-space/billing' },
  { label: 'Help & Support', icon: HelpCircle, href: '/my-space/help' },
]

export function AccountMenu() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
      router.push('/')
      router.refresh()
    })
  }

  return (
    <div className="mt-8 flex flex-col divide-y divide-black/5 bg-white rounded-card shadow-card overflow-hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.label}
            href={item.href}
            className="text-left px-4 py-3.5 text-sm font-medium flex items-center gap-3 transition-colors duration-200 hover:bg-cream group"
          >
            <Icon size={16} className="text-ink-muted" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={16} className="text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="text-left px-4 py-3.5 text-sm font-medium flex items-center gap-3 text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:opacity-60"
      >
        <LogOut size={16} />
        <span className="flex-1">{isPending ? 'Logging out…' : 'Log Out'}</span>
      </button>
    </div>
  )
}
