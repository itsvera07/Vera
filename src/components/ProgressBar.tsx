export function ProgressBar({
  percent,
  label,
  trackClassName = 'bg-black/10',
  fillClassName = 'bg-brand-orange',
}: {
  percent: number
  label?: string
  trackClassName?: string
  fillClassName?: string
}) {
  return (
    <div className="w-full">
      <div className={`h-2 w-full rounded-pill ${trackClassName} overflow-hidden`}>
        <div
          className={`h-full rounded-pill transition-all duration-700 ease-smooth ${fillClassName}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      {label && <p className="text-xs text-ink-muted mt-1">{label}</p>}
    </div>
  )
}
