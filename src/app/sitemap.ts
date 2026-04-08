import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/blogs`,         lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/categories`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`,         lastModified: new Date(), changeFrequency: 'monthly',priority: 0.6 },
    { url: `${baseUrl}/contact`,       lastModified: new Date(), changeFrequency: 'monthly',priority: 0.5 },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })
    postRoutes = result.docs.map(doc => ({
      url: `${baseUrl}/blogs/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // No posts or DB unavailable — return static routes only
  }

  return [...staticRoutes, ...postRoutes]
}
