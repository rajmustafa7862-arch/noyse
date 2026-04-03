import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import '../globals.css'
import ClientCursor from '@/components/layout/ClientCursor'
import ScrollReveal from '@/components/animations/ScrollReveal'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'NOYSE — News Without Clutter',
  description: 'AI-powered news intelligence. Signal over noise, always.',
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${dmSans.variable} ${syne.variable}`}>
      <body>
        <ClientCursor />
        <ScrollReveal />
        {children}
      </body>
    </html>
  )
}
