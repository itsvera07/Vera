'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from '@/lib/icons'

export function SearchBar({
  placeholder = 'What do you want to learn?',
  defaultValue = '',
  className = '',
}: {
  placeholder?: string
  defaultValue?: string
  className?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 bg-white rounded-pill px-4 py-3 text-sm shadow-card transition-shadow duration-200 hover:shadow-hover ${className}`}
    >
      <Search size={16} className="text-ink-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent text-ink placeholder:text-ink-muted"
      />
    </form>
  )
}
