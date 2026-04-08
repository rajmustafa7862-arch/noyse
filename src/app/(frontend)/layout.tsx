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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NOYSE — News Without Clutter',
    template: '%s | NOYSE',
  },
  description:
    'Human-curated news platform. No clickbait, no noise. Only the stories that actually matter.',
  openGraph: {
    type: 'website',
    siteName: 'NOYSE',
    title: 'NOYSE — News Without Clutter',
    description:
      'Human-curated news platform. No clickbait, no noise. Only the stories that actually matter.',
    url: siteUrl,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NOYSE — News Without Clutter' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@noysenews',
    creator: '@noysenews',
    title: 'NOYSE — News Without Clutter',
    description:
      'Human-curated news platform. No clickbait, no noise. Only the stories that actually matter.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
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
