'use client'

import { useRouter } from 'next/navigation'
import { Paywall } from './Paywall'
import { unlockBook } from '@/lib/actions'

export function BookPaywall({
  bookId,
  bookTitle,
  price,
  walletBalance,
}: {
  bookId: string | number
  bookTitle: string
  price: number
  walletBalance: number
}) {
  const router = useRouter()

  return (
    <Paywall
      title="This chapter is part of the paid bundle"
      itemLabel={`the rest of "${bookTitle}"`}
      price={price}
      walletBalance={walletBalance}
      onUnlock={async () => {
        const res = await unlockBook(bookId)
        if (res.ok) router.refresh()
        return res
      }}
      onNeedTopUp={() => router.push('/my-space/wallet')}
    />
  )
}
