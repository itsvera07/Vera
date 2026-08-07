'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function ScrollReveal({
  children,
  delay = 0,
  y = 16,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
