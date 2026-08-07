'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/PageContainer'
import { Wallet, ArrowRight } from '@/lib/icons'

const PRESET_AMOUNTS = [49, 99, 199]

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function WalletTopUpPage() {
  const [amount, setAmount] = useState<number>(99)
  const [customAmount, setCustomAmount] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const finalAmount = customAmount ? Number(customAmount) : amount

  async function handlePay() {
    setError(null)
    if (!finalAmount || finalAmount < 1) {
      setError('Enter a valid amount.')
      return
    }
    setIsPaying(true)

    try {
      const orderRes = await fetch('/api/custom/wallet/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok) throw new Error(order.error || 'Could not start payment.')

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Vera',
        description: 'Wallet top-up',
        theme: { color: '#F26B3A' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/custom/wallet/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, amount: order.amount }),
          })
          const result = await verifyRes.json()
          if (!verifyRes.ok) {
            setError(result.error || 'Payment could not be verified.')
            setIsPaying(false)
            return
          }
          router.push('/my-space')
          router.refresh()
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      })

      razorpay.on('payment.failed', (resp: any) => {
        setError(resp.error?.description || 'Payment failed. Please try again.')
        setIsPaying(false)
      })

      razorpay.open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setIsPaying(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <PageContainer className="pt-5">
        <h1 className="font-display font-bold text-xl lg:text-2xl mb-1 flex items-center gap-2">
          <Wallet size={20} className="text-brand-orange" /> Top up wallet
        </h1>
        <p className="text-sm text-ink-muted mb-6 lg:max-w-md">
          Add credits once, then unlock ₹9 items instantly with no repeated checkout.
        </p>

        <div className="flex flex-col gap-3 lg:max-w-md">
          {PRESET_AMOUNTS.map((preset, i) => (
            <button
              key={preset}
              disabled={isPaying}
              style={{ animationDelay: `${i * 70}ms` }}
              onClick={() => {
                setAmount(preset)
                setCustomAmount('')
              }}
              className={`group bg-white rounded-card shadow-card p-4 flex items-center justify-between font-semibold animate-fade-in-up transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift disabled:opacity-60 ${
                !customAmount && amount === preset ? 'ring-2 ring-brand-orange' : ''
              }`}
            >
              ₹{preset}
              <span className="text-brand-orange text-sm flex items-center gap-1">
                Select{' '}
                <ArrowRight size={14} className="transition-transform duration-200 ease-smooth group-hover:translate-x-1" />
              </span>
            </button>
          ))}

          <div className="bg-white rounded-card shadow-card p-4">
            <label className="text-xs font-medium text-ink-muted">Or enter a custom amount</label>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-semibold text-ink-muted">₹</span>
              <input
                type="number"
                min={1}
                max={5000}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g. 149"
                className="flex-1 outline-none text-sm font-medium bg-transparent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handlePay}
            disabled={isPaying}
            className="bg-brand-orange text-white font-semibold rounded-pill px-5 py-3.5 mt-2 transition-all duration-200 ease-smooth hover:bg-brand-orangeDark hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {isPaying ? 'Opening payment…' : `Pay ₹${finalAmount || 0}`}
          </button>

          <p className="text-xs text-ink-muted text-center">Payments handled securely by Razorpay.</p>
        </div>
      </PageContainer>
    </>
  )
}
