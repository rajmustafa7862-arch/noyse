import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TickerBar from '@/components/home/TickerBar'
import CTASection from '@/components/home/CTASection'
import ShareButtons from './ShareButtons'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LexicalTextNode {
  type: 'text'
  text: string
  format?: number // bitmask: 1=bold,2=italic,4=strikethrough,8=underline,16=code
}

interface LexicalElementNode {
  type: string
  tag?: string
  listType?: string
  url?: string
  children?: LexicalNode[]
  version?: number
  direction?: string
  format?: string | number
  indent?: number
}

type LexicalNode = LexicalTextNode | LexicalElementNode

interface LexicalRoot {
  root: { children: LexicalNode[] }
}

interface Post {
  id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedDate?: string
  readTime?: number
  featuredImage?: { url?: string; alt?: string; width?: number; height?: number }
  content?: LexicalRoot | null
  seo?: { seoTitle?: string; seoDescription?: string }
  affiliateProduct?: {
    productName?: string
    productDescription?: string
    affiliateLink?: string
    productImage?: { url?: string; alt?: string }
  }
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedDate?: string
  readTime?: number
  featuredImage?: { url?: string; alt?: string }
}

// ─── Payload helpers ──────────────────────────────────────────────────────────

async function getPost(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    if (!result.docs.length) return null
    const doc = result.docs[0]
    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      category: doc.category,
      excerpt: doc.excerpt ?? undefined,
      publishedDate: doc.publishedDate ?? undefined,
      readTime: doc.readTime ?? undefined,
      featuredImage: doc.featuredImage
        ? {
            url: doc.featuredImage.url ?? undefined,
            alt: doc.featuredImage.alt ?? undefined,
            width: doc.featuredImage.width ?? undefined,
            height: doc.featuredImage.height ?? undefined,
          }
        : undefined,
      content: (doc.content as LexicalRoot) ?? null,
      seo: doc.seo ? { seoTitle: doc.seo.seoTitle ?? undefined, seoDescription: doc.seo.seoDescription ?? undefined } : undefined,
      affiliateProduct: doc.affiliateProduct?.productName
        ? {
            productName: doc.affiliateProduct.productName ?? undefined,
            productDescription: doc.affiliateProduct.productDescription ?? undefined,
            affiliateLink: doc.affiliateProduct.affiliateLink ?? undefined,
            productImage: doc.affiliateProduct.productImage
              ? { url: doc.affiliateProduct.productImage.url ?? undefined, alt: doc.affiliateProduct.productImage.alt ?? undefined }
              : undefined,
          }
        : undefined,
    }
  } catch {
    return null
  }
}

async function getRelatedPosts(category: string, excludeSlug: string): Promise<RelatedPost[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { category: { equals: category } },
          { slug: { not_equals: excludeSlug } },
          { status: { equals: 'published' } },
        ],
      },
      sort: '-publishedDate',
      limit: 3,
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

// ─── generateStaticParams ─────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })
    return result.docs.map(doc => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const title       = post.seo?.seoTitle       ?? post.title
  const description = post.seo?.seoDescription ?? post.excerpt ?? 'Read this article on NOYSE.'
  const ogImages    = post.featuredImage?.url
    ? [{ url: post.featuredImage.url, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NOYSE' }]

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blogs/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/blogs/${slug}`,
      siteName: 'NOYSE',
      publishedTime: post.publishedDate,
      authors: ['NOYSE'],
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@noysenews',
      title,
      description,
      images: ogImages.map(i => i.url),
    },
  }
}

// ─── Lexical rich-text → HTML ─────────────────────────────────────────────────

function applyTextFormat(text: string, format: number): string {
  let out = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  if (format & 1) out = `<strong>${out}</strong>`
  if (format & 2) out = `<em>${out}</em>`
  if (format & 8) out = `<u>${out}</u>`
  if (format & 4) out = `<s>${out}</s>`
  if (format & 16) out = `<code>${out}</code>`
  return out
}

function renderNodes(nodes: LexicalNode[]): string {
  return nodes.map(node => {
    if (node.type === 'text') {
      const n = node as LexicalTextNode
      if (!n.text) return ''
      return applyTextFormat(n.text, n.format ?? 0)
    }

    const n = node as LexicalElementNode
    const inner = n.children ? renderNodes(n.children) : ''

    switch (n.type) {
      case 'paragraph':
        return inner.trim() ? `<p>${inner}</p>` : '<br/>'
      case 'heading':
        return `<${n.tag ?? 'h2'}>${inner}</${n.tag ?? 'h2'}>`
      case 'quote':
        return `<blockquote>${inner}</blockquote>`
      case 'list':
        return n.listType === 'number' ? `<ol>${inner}</ol>` : `<ul>${inner}</ul>`
      case 'listitem':
        return `<li>${inner}</li>`
      case 'link': {
        const href = (n as LexicalElementNode & { url?: string }).url ?? '#'
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`
      }
      case 'linebreak':
        return '<br/>'
      case 'horizontalrule':
        return '<hr/>'
      case 'code':
        return `<pre><code>${inner}</code></pre>`
      default:
        return inner
    }
  }).join('')
}

function lexicalToHTML(content: LexicalRoot | null | undefined): string {
  if (!content?.root?.children) return ''
  return renderNodes(content.root.children)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  tech: 'tech', politics: 'ai', sports: 'economy',
  entertainment: 'global', world: 'global', business: 'economy', lifestyle: 'global',
}
const categoryEmojis: Record<string, string> = {
  tech: '🔷', politics: '🏛️', sports: '⚽', entertainment: '🎬',
  world: '🌍', business: '💼', lifestyle: '✨',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const related = post.category ? await getRelatedPosts(post.category, post.slug) : []
  const htmlContent = lexicalToHTML(post.content)
  const cat = post.category?.toLowerCase() ?? 'tech'
  const colorClass = categoryColors[cat] ?? 'tech'
  const emoji = categoryEmojis[cat] ?? '📰'
  const hasAffiliate = !!(post.affiliateProduct?.productName && post.affiliateProduct?.affiliateLink)

  // JSON-LD structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noyse.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url ?? `${siteUrl}/og-image.jpg`,
    datePublished: post.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'NOYSE',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NOYSE',
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TickerBar />
      <Navbar />
      <main id="article-page" className="page-top">
        {/* Hero image */}
        <div className="article-hero">
          {post.featuredImage?.url ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="100vw"
            />
          ) : (
            <div className="article-hero-placeholder">{emoji}</div>
          )}
        </div>

        {/* Article header */}
        <div className="article-header">
          <div className="article-meta-row">
            <span className={`article-cat news-cat ${colorClass}`}>
              {post.category ?? 'General'}
            </span>
            {post.publishedDate && (
              <span className="article-date">{formatDate(post.publishedDate)}</span>
            )}
            {post.readTime && (
              <span className="article-read-time">⏱ {post.readTime} min read</span>
            )}
          </div>
          <h1 className="article-title reveal">{post.title}</h1>
          {post.excerpt && (
            <p className="article-excerpt reveal">{post.excerpt}</p>
          )}
        </div>

        {/* Share buttons */}
        <ShareButtons title={post.title} />

        {/* Article body */}
        {htmlContent ? (
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="article-content">
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Content is being prepared…
            </p>
          </div>
        )}

        {/* Affiliate product card */}
        {hasAffiliate && (
          <div className="affiliate-card">
            <div className="affiliate-card-inner">
              <div className="affiliate-badge">Recommended</div>
              <div className="affiliate-img">
                {post.affiliateProduct!.productImage?.url ? (
                  <Image
                    src={post.affiliateProduct!.productImage.url}
                    alt={post.affiliateProduct!.productImage.alt ?? post.affiliateProduct!.productName ?? ''}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="affiliate-img-placeholder">🛍️</div>
                )}
              </div>
              <div className="affiliate-info">
                <h3 className="affiliate-title">{post.affiliateProduct!.productName}</h3>
                {post.affiliateProduct!.productDescription && (
                  <p className="affiliate-desc">{post.affiliateProduct!.productDescription}</p>
                )}
                <a
                  href={post.affiliateProduct!.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="affiliate-link"
                >
                  View Product →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <div className="related-section section-inner">
            <div className="section-label reveal">More like this</div>
            <h2 className="news-title reveal" style={{ marginBottom: 0 }}>Related Articles</h2>
            <div className="related-grid">
              {related.map(rel => {
                const relCat = rel.category?.toLowerCase() ?? 'tech'
                const relColor = categoryColors[relCat] ?? 'tech'
                const relEmoji = categoryEmojis[relCat] ?? '📰'
                return (
                  <Link key={rel.id} href={`/blogs/${rel.slug}`} className="news-card" style={{ textDecoration: 'none' }}>
                    <div className="news-img">
                      {rel.featuredImage?.url ? (
                        <Image
                          src={rel.featuredImage.url}
                          alt={rel.featuredImage.alt ?? rel.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="news-img-placeholder">{relEmoji}</div>
                      )}
                      <div className="news-img-overlay" />
                    </div>
                    <div className="news-body">
                      <div className="news-meta">
                        <span className={`news-cat ${relColor}`}>{rel.category}</span>
                        {rel.readTime && <span className="news-time">{rel.readTime} min read</span>}
                      </div>
                      <h3 className="news-headline">{rel.title}</h3>
                      {rel.excerpt && <p className="news-excerpt">{rel.excerpt}</p>}
                    </div>
                    <div className="news-footer">
                      <span className="news-author">NOYSE</span>
                      <span className="news-read-more">Read →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
