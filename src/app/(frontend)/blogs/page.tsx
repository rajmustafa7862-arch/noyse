import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TickerBar from '@/components/home/TickerBar'
import BlogsClient from './BlogsClient'

export const metadata: Metadata = {
  title: 'Latest News',
  description:
    'Browse all published articles on NOYSE. Human-curated journalism without the noise.',
}

interface Post {
  id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedDate?: string
  readTime?: number
  featuredImage?: { url?: string; alt?: string }
}

async function getAllPosts(): Promise<Post[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 200,
      depth: 1,
    })
    return result.docs.map(doc => ({
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      category: doc.category,
      excerpt: doc.excerpt ?? undefined,
      publishedDate: doc.publishedDate ?? undefined,
      readTime: doc.readTime ?? undefined,
      featuredImage: doc.featuredImage
        ? { url: doc.featuredImage.url ?? undefined, alt: doc.featuredImage.alt ?? undefined }
        : undefined,
    }))
  } catch {
    return []
  }
}

export default async function BlogsPage() {
  const posts = await getAllPosts()

  return (
    <>
      <TickerBar />
      <Navbar />
      <main className="page-top">
        {/* Page hero */}
        <div className="page-hero">
          <div className="section-inner">
            <div className="page-hero-label reveal">All Articles</div>
            <h1 className="page-hero-title reveal">
              Latest <span>News</span>
            </h1>
            <p className="page-hero-sub reveal">
              Human-curated journalism without the noise. Every story vetted, every headline earned.
            </p>
          </div>
        </div>

        <BlogsClient posts={posts} />
      </main>
      <Footer />
    </>
  )
}
