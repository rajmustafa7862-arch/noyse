'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animate } from 'animejs'

export default function FeaturesSection() {
  useEffect(() => {
    gsap.fromTo('.feature-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.features-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    )

    document.querySelectorAll<HTMLElement>('.feature-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const iconWrap = card.querySelector('.feature-icon-wrap')
        if (iconWrap) animate(iconWrap, { rotate: [0, -8, 0], duration: 500, ease: 'outElastic(1, .5)' })
      })
    })
  }, [])

  return (
    <section id="features">
      <div className="section-inner">
        <div className="features-header reveal">
          <div className="section-label" style={{ justifyContent: 'center' }}>Core Capabilities</div>
          <h2 className="features-title">Built different.<br /><span>Reads smarter.</span></h2>
          <p className="features-sub">Four technologies that separate signal from noise, automatically.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card large reveal">
            <div className="feature-num">01</div>
            <div className="feature-icon-wrap">🧠</div>
            <h3 className="feature-title">AI Curation Engine</h3>
            <p className="feature-text">
              Our proprietary model processes 50,000+ articles daily across politics, tech, economy, and global events — ranking them by actual importance, not engagement metrics. The result: a curated feed where every story earned its place.
            </p>
            <div className="feature-badge">Core Tech</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-num">02</div>
            <div className="feature-icon-wrap">⚡</div>
            <h3 className="feature-title">Real-Time Updates</h3>
            <p className="feature-text">
              Breaking news delivered in under 90 seconds from source to your feed. No editorial delays. No publication latency.
            </p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-num">03</div>
            <div className="feature-icon-wrap">🚫</div>
            <h3 className="feature-title">Zero Clickbait</h3>
            <p className="feature-text">
              Headline integrity scoring removes sensationalism before it reaches you. We optimize for truth density, not time-on-site.
            </p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-num">04</div>
            <div className="feature-icon-wrap">📡</div>
            <h3 className="feature-title">Social Distribution</h3>
            <p className="feature-text">
              Top stories are automatically syndicated to our X, Instagram, and LinkedIn channels, reaching 200K+ readers daily.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
