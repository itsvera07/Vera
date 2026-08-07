'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'
import { BreadcrumbHeader } from '@/components/Header'

const PREFS = [
  { key: 'dailyReminder', label: 'Daily practice reminder', hint: 'A gentle nudge if you haven\u2019t opened a lesson today' },
  { key: 'weeklyDigest', label: 'Weekly new-content digest', hint: 'What\u2019s new across Learn, Stories, and Chat Library' },
  { key: 'newChapterAlerts', label: 'New chapter alerts', hint: 'For stories you\u2019re currently reading' },
] as const

export default function NotificationsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login')
          return
        }
        setUserId(data.user.id)
        setPrefs({
          dailyReminder: data.user.notificationPrefs?.dailyReminder ?? true,
          weeklyDigest: data.user.notificationPrefs?.weeklyDigest ?? true,
          newChapterAlerts: data.user.notificationPrefs?.newChapterAlerts ?? true,
        })
        setLoading(false)
      })
  }, [router])

  async function toggle(key: string) {
    if (!userId) return
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    setSaving(true)
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ notificationPrefs: updated }),
    })
    setSaving(false)
  }

  if (loading) {
    return (
      <PageContainer className="pt-5">
        <p className="text-sm text-ink-muted">Loading...</p>
      </PageContainer>
    )
  }

  return (
    <>
      <BreadcrumbHeader crumbs={[{ label: 'My Space', href: '/my-space' }, { label: 'Notifications' }]} backHref="/my-space" />

      <PageContainer>
        <div className="bg-amber-50 border border-amber-200 rounded-card p-3 text-xs text-amber-800 mb-4 lg:max-w-md">
          These preferences are saved, but actual email/push delivery isn't
          wired up yet — this is ready for whenever that's added.
        </div>

        <div className="flex flex-col divide-y divide-black/5 bg-white rounded-card shadow-card overflow-hidden lg:max-w-md animate-fade-in-up">
          {PREFS.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-ink-muted mt-0.5">{pref.hint}</p>
              </div>
              <button
                onClick={() => toggle(pref.key)}
                disabled={saving}
                aria-pressed={prefs[pref.key]}
                className={`w-11 h-6 rounded-pill shrink-0 relative transition-colors duration-200 ${
                  prefs[pref.key] ? 'bg-brand-green' : 'bg-black/15'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ease-smooth ${
                    prefs[pref.key] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  )
}
