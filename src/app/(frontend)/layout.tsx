import type { Metadata } from 'next'
import { Poppins, Inter, Baloo_2 } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { Sidebar } from '@/components/Sidebar'
import { AmbientBackground } from '@/components/AmbientBackground'
import { PageTransition } from '@/components/motion/PageTransition'

// Poppins = headings/body-bold (clean geometric sans, matches the Figma
// heading weight exactly). Baloo 2 = ONLY the "Vera…" wordmark (chunky,
// rounded, hand-brush feel — matches the logo specifically, not used
// anywhere else). Inter = body copy.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
})

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-logo',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Vera — Learn to say what you feel',
  description: 'Because words are bridges between people.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${baloo.variable}`}>
      <body className="font-body bg-cream text-ink relative">
        <AmbientBackground />

        <div className="lg:flex lg:min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0 pb-24 lg:pb-16">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
