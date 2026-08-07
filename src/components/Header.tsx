import Link from 'next/link'
import { Menu, Search, ArrowLeft, Pencil, ChevronRight } from '@/lib/icons'

export function Logo({ className = 'text-2xl' }: { className?: string }) {
  return (
    <span className={`font-logo font-extrabold tracking-tight ${className}`}>
      <span className="text-ink">Ve</span>
      <span className="text-brand-orange">ra</span>
      <span className="text-ink">...</span>
    </span>
  )
}

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/70 flex items-center justify-between px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto pt-5 pb-2">
      <button
        aria-label="Menu"
        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5 lg:hidden"
      >
        <Menu size={20} />
      </button>
      <Logo className="text-2xl lg:hidden" />
      <span className="hidden lg:block" />
      <Link
        href="/search"
        aria-label="Search"
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5 hover:scale-105"
      >
        <Search size={19} />
      </Link>
    </header>
  )
}

export function BreadcrumbHeader({
  crumbs,
  backHref,
}: {
  crumbs: { label: string; href?: string }[]
  backHref: string
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/70 flex items-center justify-between px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto pt-5 pb-3">
      <Link
        href={backHref}
        aria-label="Back"
        className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center transition-all duration-200 ease-smooth hover:shadow-hover hover:-translate-x-0.5"
      >
        <ArrowLeft size={17} />
      </Link>
      <nav className="flex items-center gap-1 text-sm font-medium text-brand-orange overflow-hidden">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1 truncate">
            {c.href ? (
              <Link href={c.href} className="hover:underline underline-offset-2 truncate">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink truncate">{c.label}</span>
            )}
            {i < crumbs.length - 1 && <ChevronRight size={14} className="text-ink-muted shrink-0" />}
          </span>
        ))}
      </nav>
      <button
        aria-label="More"
        className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center transition-all duration-200 ease-smooth hover:shadow-hover"
      >
        <Pencil size={15} />
      </button>
    </header>
  )
}
