'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'

const MIN_SIZE = 14
const MAX_SIZE = 26
const DEFAULT_SIZE = 17

export function ChapterReader({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE)
  const containerRef = useRef<HTMLDivElement>(null)
  const pinchStartDistance = useRef<number | null>(null)
  const pinchStartSize = useRef(DEFAULT_SIZE)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function distanceBetween(touches: TouchList) {
      const a = touches[0]
      const b = touches[1]
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        pinchStartDistance.current = distanceBetween(e.touches)
        pinchStartSize.current = fontSize
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 2 && pinchStartDistance.current) {
        e.preventDefault()
        const newDistance = distanceBetween(e.touches)
        const scale = newDistance / pinchStartDistance.current
        const next = Math.round(pinchStartSize.current * scale)
        setFontSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, next)))
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (e.touches.length < 2) pinchStartDistance.current = null
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div ref={containerRef} style={{ touchAction: 'pan-y', fontSize: `${fontSize}px`, lineHeight: 1.7 }}>
        {children}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6 text-ink-muted">
        <button
          type="button"
          aria-label="Decrease text size"
          onClick={() => setFontSize((s) => Math.max(MIN_SIZE, s - 1))}
          className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center transition-transform duration-150 active:scale-90"
        >
          <Minus size={14} />
        </button>
        <span className="text-xs w-12 text-center">{fontSize}px</span>
        <button
          type="button"
          aria-label="Increase text size"
          onClick={() => setFontSize((s) => Math.min(MAX_SIZE, s + 1))}
          className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center transition-transform duration-150 active:scale-90"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}