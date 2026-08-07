'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'
import { BreadcrumbHeader } from '@/components/Header'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login')
          return
        }
        setUserId(data.user.id)
        setName(data.user.name ?? '')
        setEmail(data.user.email ?? '')
        setLoading(false)
      })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setMessage(null)

    const data: Record<string, string> = { name, email }
    if (newPassword) {
      if (newPassword.length < 8) {
        setMessage({ type: 'error', text: 'New password must be at least 8 characters.' })
        setSaving(false)
        return
      }
      data.password = newPassword
    }

    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    const result = await res.json()

    if (!res.ok) {
      setMessage({ type: 'error', text: result.errors?.[0]?.message || 'Could not save changes.' })
    } else {
      setMessage({ type: 'ok', text: 'Saved.' })
      setNewPassword('')
    }
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
      <BreadcrumbHeader crumbs={[{ label: 'My Space', href: '/my-space' }, { label: 'Account Settings' }]} backHref="/my-space" />

      <PageContainer>
        <div className="bg-white rounded-card shadow-card p-5 lg:max-w-md animate-fade-in-up">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-ink-muted">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">New password (leave blank to keep current)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="mt-1 w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-brand-orange"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'ok' ? 'text-brand-green' : 'text-red-600'}`}>{message.text}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-brand-green text-white font-semibold rounded-pill px-5 py-3 mt-1 transition-all duration-200 ease-smooth hover:bg-brand-greenDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </PageContainer>
    </>
  )
}
