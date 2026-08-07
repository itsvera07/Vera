'use client'

import { useState, useTransition } from 'react'
import { Lock } from '@/lib/icons'

export function Paywall({
  title,
  itemLabel,
  price,
  walletBalance,
  onUnlock,
  onNeedTopUp,
}: {
  title: string
  itemLabel: string
  price: number
  walletBalance: number
  onUnlock: () => Promise<{ ok: boolean; error?: string }>
  onNeedTopUp: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const canAfford = walletBalance >= price

  return (
    <div className="relative rounded-card overflow-hidden border border-black/5 bg-white shadow-card animate-fade-in-up">
      <div className="p-5 blur-[3px] select-none pointer-events-none opacity-60">
        <div className="h-3 w-3/4 bg-black/10 rounded mb-2" />
        <div className="h-3 w-full bg-black/10 rounded mb-2" />
        <div className="h-3 w-5/6 bg-black/10 rounded mb-2" />
        <div className="h-3 w-2/3 bg-black/10 rounded" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/40 via-white/85 to-white">
        <div className="text-center px-6 py-6">
          <span className="inline-flex w-11 h-11 rounded-full bg-brand-orange/10 items-center justify-center animate-float">
            <Lock size={20} className="text-brand-orange" />
          </span>
          <p className="font-display font-bold mt-3">{title}</p>
          <p className="text-sm text-ink-muted mt-1">
            Unlock {itemLabel} for ₹{price}
          </p>

          {error && <p className="text-xs text-red-600 mt-2 animate-fade-in">{error}</p>}

          <div className="mt-4">
            {canAfford ? (
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    setError(null)
                    const res = await onUnlock()
                    if (!res.ok) setError(res.error ?? 'Something went wrong.')
                  })
                }
                className="bg-brand-orange text-white font-semibold rounded-pill px-6 py-2.5 transition-all duration-200 ease-smooth hover:bg-brand-orangeDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isPending ? 'Unlocking…' : `Unlock for ₹${price}`}
              </button>
            ) : (
              <button
                onClick={onNeedTopUp}
                className="bg-navy text-white font-semibold rounded-pill px-6 py-2.5 transition-all duration-200 ease-smooth hover:bg-navy-light hover:shadow-hover hover:-translate-y-0.5"
              >
                Top up wallet (₹{walletBalance} of ₹{price})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
