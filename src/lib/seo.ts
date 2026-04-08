const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const siteConfig = {
  name: 'NOYSE',
  title: 'NOYSE — News Without Clutter',
  description:
    'Human-curated news platform. No clickbait, no noise. Only the stories that actually matter.',
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  twitter: '@noysenews',
}
