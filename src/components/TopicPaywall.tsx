'use client'

import { useRouter } from 'next/navigation'
import { Paywall } from './Paywall'
import { unlockTopic } from '@/lib/actions'

export function TopicPaywall({
  topicId,
  topicTitle,
  price,
  walletBalance,
}: {
  topicId: string | number
  topicTitle: string
  price: number
  walletBalance: number
}) {
  const router = useRouter()

  return (
    <Paywall
      title="This lesson is part of the paid bundle"
      itemLabel={`the rest of ${topicTitle}`}
      price={price}
      walletBalance={walletBalance}
      onUnlock={async () => {
        const res = await unlockTopic(topicId)
        if (res.ok) router.refresh()
        return res
      }}
      onNeedTopUp={() => router.push('/my-space/wallet')}
    />
  )
}
