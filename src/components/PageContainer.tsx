export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 lg:px-0 lg:max-w-3xl xl:max-w-4xl lg:mx-auto ${className}`}>{children}</div>
}
