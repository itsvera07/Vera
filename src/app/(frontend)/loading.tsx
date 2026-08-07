import { Skeleton } from '@/components/Skeleton'
import { PageContainer } from '@/components/PageContainer'

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto pt-5 pb-2">
        <Skeleton className="w-9 h-9 rounded-full lg:hidden" />
        <Skeleton className="w-20 h-7" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      <div className="px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto pt-4 pb-6">
        <Skeleton className="h-9 w-3/4 mb-2" />
        <Skeleton className="h-9 w-1/2 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-40 rounded-pill" />
          <Skeleton className="h-11 w-36 rounded-pill" />
        </div>
      </div>

      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-card" />
          ))}
        </div>
      </PageContainer>
    </>
  )
}
