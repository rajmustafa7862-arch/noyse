import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TickerBar from '@/components/home/TickerBar'

export const metadata: Metadata = {
  title: 'Browse Categories',
  description:
    'Explore news by category on NOYSE — Politics, Tech, Sports, Entertainment, World, Business and Lifestyle.',
}

const CATEGORY_META: Record<string, { icon: string; desc: string; color: string }> = {
  politics: {
    icon: '🏛️',
    desc: 'Elections, governance, policy decisions, and the forces shaping society worldwide.',
    color: 'rgba(124,92,252,0.12)',
  },
  tech: {
    icon: '💻',
    desc: 'The latest in AI, startups, product launches, and the companies building the future.',
    color: 'rgba(79,110,247,0.12)',
  },
  sports: {
    icon: '⚽',
    desc: 'Results, transfers, analysis, and stories from the world\'s biggest sporting events.',
    color: 'rgba(16,185,129,0.12)',
  },
  entertainment: {
    icon: '🎬',
    desc: 'Film, TV, music, celebrity, and the cultural moments everyone is talking about.',
    color: 'rgba(245,158,11,0.12)',
  },
  world: {
    icon: '🌍',
    desc: 'International affairs, conflicts, diplomacy, and stories from every corner of the globe.',
    color: 'rgba(14,165,233,0.12)',
  },
  business: {
    icon: '💼',
    desc: 'Markets, earnings, M&A, economics, and the decisions driving the global economy.',
    color: 'rgba(16,185,129,0.12)',
  },
  lifestyle: {
    icon: '✨',
    desc: 'Health, culture, travel, food, and everything that makes life richer and more interesting.',
    color: 'rgba(244,63,94,0.12)',
  },
}

interface CategoryCount {
  category: string
  count: number
}

async function getCategoryCounts(): Promise<CategoryCount[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const categories = Object.keys(CATEGORY_META)
    const counts = await Promise.all(
      categories.map(async cat => {
        const result = await payload.find({
          collection: 'posts',
          where: { and: [{ category: { equals: cat } }, { status: { equals: 'published' } }] },
          limit: 0,
          depth: 0,
        })
        return { category: cat, count: result.totalDocs }
      })
    )
    return counts
  } catch {
    return Object.keys(CATEGORY_META).map(cat => ({ category: cat, count: 0 }))
  }
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts()
  const countMap = Object.fromEntries(counts.map(c => [c.category, c.count]))

  return (
    <>
      <TickerBar />
      <Navbar />
      <main className="page-top">
        {/* Page hero */}
        <div className="page-hero">
          <div className="section-inner">
            <div className="page-hero-label">Browse Topics</div>
            <h1 className="page-hero-title">
              Find your <span>category.</span>
            </h1>
            <p className="page-hero-sub">
              Seven curated verticals. Every story is classified so you can go deep
              on the topics that matter most to you.
            </p>
          </div>
        </div>

        {/* Category grid */}
        <section id="categories-page">
          <div className="section-inner">
            <div className="cat-grid">
              {Object.entries(CATEGORY_META).map(([slug, meta], i) => {
                const count = countMap[slug] ?? 0
                return (
                  <Link
                    key={slug}
                    href={`/blogs?category=${slug}`}
                    className="cat-card"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="cat-icon" style={{ background: meta.color }}>
                      {meta.icon}
                    </div>
                    <div className="cat-name">
                      {slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </div>
                    <div className="cat-desc">{meta.desc}</div>
                    <div className="cat-count">
                      <span>◉</span>
                      {count} article{count !== 1 ? 's' : ''}
                    </div>
                    <span className="cat-arrow">↗</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
