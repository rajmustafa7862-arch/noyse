'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'

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

const CATEGORIES = ['All', 'Politics', 'Tech', 'Sports', 'Entertainment', 'World', 'Business', 'Lifestyle']
const PER_PAGE = 6

const categoryColors: Record<string, string> = {
  tech: 'tech', politics: 'ai', sports: 'economy',
  entertainment: 'global', world: 'global', business: 'economy', lifestyle: 'global',
}
const categoryEmojis: Record<string, string> = {
  tech: '🔷', politics: '🏛️', sports: '⚽', entertainment: '🎬',
  world: '🌍', business: '💼', lifestyle: '✨', default: '📰',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

interface BlogsClientProps {
  posts: Post[]
}

export default function BlogsClient({ posts }: BlogsClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const animDone = useRef(false)

  const filtered = posts.filter(post => {
    const matchCat = activeCategory === 'All' || post.category?.toLowerCase() === activeCategory.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch = !q || post.title.toLowerCase().includes(q) || (post.excerpt?.toLowerCase().includes(q) ?? false)
    return matchCat && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }, [])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }, [])

  // GSAP entrance on first render
  useEffect(() => {
    if (animDone.current || !gridRef.current) return
    animDone.current = true
    ScrollTrigger.refresh()
    gsap.fromTo(
      gridRef.current.querySelectorAll('.news-card'),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  // Re-animate cards on page/filter change
  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(
      gridRef.current.querySelectorAll('.news-card'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
    )
  }, [pagePosts.length, page, activeCategory, search])

  return (
    <section id="blogs-page">
      <div className="section-inner">
        {/* Controls: search + category filters */}
        <div className="blogs-controls">
          <div className="blogs-search-wrap">
            <span className="blogs-search-icon">⌕</span>
            <input
              type="search"
              className="blogs-search"
              placeholder="Search articles…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="blogs-results-count">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Card grid */}
        {pagePosts.length === 0 ? (
          <div className="blogs-empty">
            <div className="blogs-empty-icon">📭</div>
            <h3 className="blogs-empty-title">No articles found</h3>
            <p className="blogs-empty-sub">
              {posts.length === 0
                ? 'No articles have been published yet. Check back soon.'
                : 'Try adjusting your search or category filter.'}
            </p>
          </div>
        ) : (
          <div className="news-grid" ref={gridRef}>
            {pagePosts.map(post => {
              const cat = post.category?.toLowerCase() ?? 'tech'
              const colorClass = categoryColors[cat] ?? 'tech'
              const emoji = categoryEmojis[cat] ?? categoryEmojis.default

              return (
                <Link key={post.id} href={`/blogs/${post.slug}`} className="news-card" style={{ textDecoration: 'none' }}>
                  <div className="news-img">
                    {post.featuredImage?.url ? (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt ?? post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="news-img-placeholder">{emoji}</div>
                    )}
                    <div className="news-img-overlay" />
                  </div>
                  <div className="news-body">
                    <div className="news-meta">
                      <span className={`news-cat ${colorClass}`}>{post.category ?? 'General'}</span>
                      {post.readTime && (
                        <span className="news-time">{post.readTime} min read</span>
                      )}
                      {post.publishedDate && (
                        <span className="news-time">{formatDate(post.publishedDate)}</span>
                      )}
                    </div>
                    <h3 className="news-headline">{post.title}</h3>
                    {post.excerpt && <p className="news-excerpt">{post.excerpt}</p>}
                  </div>
                  <div className="news-footer">
                    <span className="news-author">NOYSE</span>
                    <span className="news-read-more">Read →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="blogs-pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn${p === page ? ' active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
