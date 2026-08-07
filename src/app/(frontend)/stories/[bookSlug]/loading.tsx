import { Skeleton } from '@/components/Skeleton'
import { PageContainer } from '@/components/PageContainer'

export default function Loading() {
  return (
    <PageContainer className="pt-5">
      <Skeleton className="h-44 lg:h-64 rounded-card mb-4" />
      <Skeleton className="h-16 rounded-card mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-card" />
        ))}
      </div>
    </PageContainer>
  )
}
