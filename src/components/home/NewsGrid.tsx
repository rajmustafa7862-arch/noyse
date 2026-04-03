'use client'

import { useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animate } from 'animejs'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedDate?: string
  readTime?: number
  featuredImage?: {
    url?: string
    alt?: string
  }
}

interface NewsGridProps {
  initialPosts?: Post[]
}

const categoryColors: Record<string, string> = {
  tech: 'tech',
  economy: 'economy',
  global: 'global',
  ai: 'ai',
  politics: 'ai',
  sports: 'economy',
  entertainment: 'global',
  business: 'economy',
  lifestyle: 'global',
}

const placeholderEmojis: Record<string, string> = {
  tech: '🔷',
  ai: '🤖',
  economy: '📈',
  global: '🌍',
  politics: '🏛️',
  sports: '⚽',
  entertainment: '🎬',
  business: '💼',
  lifestyle: '✨',
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} days ago`
}

const FILTER_TABS = ['all', 'tech', 'economy', 'global', 'ai']

export default function NewsGrid({ initialPosts = [] }: NewsGridProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  useEffect(() => {
    gsap.fromTo('.news-card',
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '#news-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    )
  }, [])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    animate('.filter-tab.active', { scale: [0.92, 1], duration: 300, ease: 'outElastic(1,.5)' })
    document.querySelectorAll<HTMLElement>('.news-card').forEach(card => {
      const cat = card.dataset.cat
      const show = tab === 'all' || cat === tab
      animate(card, {
        opacity: show ? 1 : 0.2,
        scale: show ? 1 : 0.97,
        duration: 350, ease: 'outQuad'
      })
    })
  }

  // Build display cards — if no Payload posts, fall back to static demo cards
  const displayPosts: Post[] = posts.length > 0 ? posts : staticDemoPosts

  return (
    <section id="news">
      <div className="section-inner">
        <div className="news-header">
          <div>
            <div className="section-label reveal">Latest Intelligence</div>
            <h2 className="news-title reveal">Today&apos;s Signal.</h2>
          </div>
          <div className="filter-tabs reveal" id="filter-tabs">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                className={`filter-tab${activeTab === tab ? ' active' : ''}`}
                data-cat={tab}
                onClick={() => handleTabClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="news-grid" id="news-grid">
          {displayPosts.map((post, i) => {
            const cat = post.category?.toLowerCase() || 'tech'
            const colorClass = categoryColors[cat] || 'tech'
            const emoji = placeholderEmojis[cat] || '📰'
            const isFeatured = i === 0

            return (
              <div
                key={post.id}
                className={`news-card reveal${isFeatured ? ' featured' : ''}`}
                data-cat={cat}
              >
                {isFeatured && (
                  <div className="ai-pulse">
                    <span className="pulse-indicator"></span>AI Curated
                  </div>
                )}
                <div className="news-img">
                  {post.featuredImage?.url ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="news-img-placeholder">{emoji}</div>
                  )}
                  <div className="news-img-overlay"></div>
                </div>
                <div className="news-body">
                  <div className="news-meta">
                    <span className={`news-cat ${colorClass}`}>{post.category || 'Tech'}</span>
                    <span className="news-time">{timeAgo(post.publishedDate)}</span>
                  </div>
                  <h3 className="news-headline">{post.title}</h3>
                  {post.excerpt && <p className="news-excerpt">{post.excerpt}</p>}
                </div>
                <div className="news-footer">
                  <span className="news-author">NOYSE Signal</span>
                  <Link href={`/blogs/${post.slug}`} className="news-read-more">Read →</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const staticDemoPosts: Post[] = [
  {
    id: '1',
    title: 'Apple Intelligence 2.0 ships to 1.4 billion devices in largest AI rollout in consumer tech history',
    slug: 'apple-intelligence-2',
    category: 'Tech',
    excerpt: 'The update brings on-device reasoning, real-time summarization, and cross-app automation to all modern Apple hardware.',
    publishedDate: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: '2',
    title: 'US GDP growth revised upward to 3.2% for Q1 2026',
    slug: 'us-gdp-q1-2026',
    category: 'Economy',
    excerpt: 'Consumer spending and tech investment drove stronger-than-expected output, defying recession fears.',
    publishedDate: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: '3',
    title: 'Anthropic raises $3.5B Series F as enterprise AI adoption doubles YoY',
    slug: 'anthropic-series-f',
    category: 'AI',
    excerpt: 'The funding round values Anthropic at $51B and will accelerate Claude\'s deployment in healthcare and finance.',
    publishedDate: new Date(Date.now() - 34 * 60000).toISOString(),
  },
  {
    id: '4',
    title: 'G7 agrees on framework for coordinated AI governance across member nations',
    slug: 'g7-ai-governance',
    category: 'Global',
    excerpt: 'Leaders signed a declaration establishing shared standards for frontier AI safety, liability, and deployment oversight.',
    publishedDate: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: '5',
    title: 'SpaceX confirms Starship mission cadence of one flight per week through 2026',
    slug: 'spacex-starship-cadence',
    category: 'Tech',
    excerpt: 'Elon Musk announced the cadence milestone marks commercial viability for orbital payload delivery.',
    publishedDate: new Date(Date.now() - 120 * 60000).toISOString(),
  },
]
