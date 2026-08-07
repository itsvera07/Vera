'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'
import { Logo } from '@/components/Header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || data.message || 'Login failed.')

      router.push('/my-space')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="pt-10 lg:pt-16 flex flex-col items-center">
      <Link href="/" className="mb-6">
        <Logo className="text-3xl" />
      </Link>

      <div className="w-full max-w-sm bg-white rounded-card shadow-card p-6 animate-fade-in-up">
        <h1 className="font-display font-bold text-xl mb-1">Welcome back</h1>
        <p className="text-sm text-ink-muted mb-6">Log in to pick up where you left off.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-brand-orange"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-brand-orange"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-green text-white font-semibold rounded-pill px-5 py-3 mt-1 transition-all duration-200 ease-smooth hover:bg-brand-greenDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-ink-muted text-center mt-5">
          New to Vera?{' '}
          <Link href="/signup" className="text-brand-orange font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </PageContainer>
  )
}
