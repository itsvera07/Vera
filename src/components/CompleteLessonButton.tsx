'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markLessonComplete } from '@/lib/actions'
import { Check } from '@/lib/icons'

export function CompleteLessonButton({
  lessonId,
  nextHref,
  accentClass = 'bg-brand-orange',
}: {
  lessonId: string | number
  nextHref?: string
  accentClass?: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3 mt-2">
      <label className="flex items-center gap-2 text-sm cursor-pointer group w-fit">
        <span className="w-5 h-5 rounded-md border-2 border-ink/20 flex items-center justify-center transition-colors duration-200 group-hover:border-brand-orange has-[:checked]:bg-brand-orange has-[:checked]:border-brand-orange">
          <input
            type="checkbox"
            className="peer sr-only"
            disabled={isPending}
            onChange={() =>
              startTransition(async () => {
                await markLessonComplete(lessonId)
                router.refresh()
              })
            }
          />
          <Check size={13} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150" />
        </span>
        Mark this lesson as complete
      </label>

      {nextHref && (
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await markLessonComplete(lessonId)
              router.push(nextHref)
            })
          }
          className={`${accentClass} text-white font-semibold rounded-pill px-5 py-3 transition-all duration-200 ease-smooth hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60`}
        >
          Continue →
        </button>
      )}
    </div>
  )
}
