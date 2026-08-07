'use client'

import { motion } from 'framer-motion'

// A handful of large, softly-blurred color blobs drifting slowly. On mobile
// we render fewer of them with a smaller blur radius (cheaper to paint,
// still visible behind the cream background). Desktop gets the full set.
const BLOBS = [
  { color: 'bg-pastel-peach', pos: 'top-[-10%] left-[-10%]', size: 'w-[60vw] h-[60vw] lg:w-[520px] lg:h-[520px]', duration: 22 },
  { color: 'bg-pastel-blue', pos: 'top-[20%] right-[-15%]', size: 'w-[55vw] h-[55vw] lg:w-[480px] lg:h-[480px]', duration: 26 },
  { color: 'bg-pastel-mint', pos: 'bottom-[-10%] left-[15%]', size: 'w-[50vw] h-[50vw] lg:w-[420px] lg:h-[420px]', duration: 30 },
]

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute ${b.pos} ${b.size} ${b.color} rounded-full blur-[70px] lg:blur-[110px] opacity-70 lg:opacity-60`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Grain texture — this one small SVG-noise overlay is what kills the
          "flat gradient, AI slop" look more than anything else here. */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-multiply grain-texture" />
    </div>
  )
}
