'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animate } from 'animejs'

const whyCards = [
  {
    icon: '📰',
    title: 'Too Much News',
    text: 'The average person is exposed to 74 GB of information daily. Scrolling through it all is impossible and exhausting.',
    tag: 'The Problem',
    tagClass: 'tag-problem',
  },
  {
    icon: '🔊',
    title: 'Noise Over Signal',
    text: '90% of news is reactive, redundant, or sensationalized. Real signal gets buried under clickbait and hot takes.',
    tag: 'The Problem',
    tagClass: 'tag-problem',
  },
  {
    icon: '🎯',
    title: 'AI Curation Engine',
    text: 'Our model reads thousands of sources and surfaces only the highest-signal stories — in real time, without bias.',
    tag: 'The Solution',
    tagClass: 'tag-solution',
  },
  {
    icon: '⚡',
    title: 'Instant Intelligence',
    text: 'Stay informed in 5 minutes. One brief, clear digest of what actually moved the world today.',
    tag: 'The Solution',
    tagClass: 'tag-solution',
  },
  {
    icon: '🚫',
    title: 'Zero Clickbait',
    text: 'We filter engagement-bait headlines algorithmically. Every story on NOYSE is there on merit alone.',
    tag: 'The Solution',
    tagClass: 'tag-solution',
  },
  {
    icon: '🌐',
    title: 'Social Distribution',
    text: 'Important news is amplified across our social channels so it reaches you wherever you are.',
    tag: 'The Solution',
    tagClass: 'tag-solution',
  },
]

export default function WhySection() {
  useEffect(() => {
    // why cards stagger reveal
    gsap.fromTo('.why-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    )

    // anime.js micro-interactions
    document.querySelectorAll<HTMLElement>('.why-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.why-icon')
        if (icon) animate(icon, {
          scale: [1, 1.2, 1.1], rotate: [0, -10, 0],
          duration: 500, ease: 'outElastic(1, .6)'
        })
      })
    })
  }, [])

  return (
    <section id="why">
      <div className="section-inner">
        <div className="why-header">
          <div>
            <div className="section-label reveal">Why NOYSE?</div>
            <h2 className="why-title reveal">
              The web is full of <em>noise.</em><br />We cut it.
            </h2>
          </div>
          <p className="why-desc reveal-right">
            Every day you&apos;re bombarded with thousands of articles, most of them irrelevant, clickbait, or duplicates. NOYSE uses AI to surface only what matters — so you can stay informed in minutes, not hours.
          </p>
        </div>

        <div className="why-grid">
          {whyCards.map((card, i) => (
            <div className="why-card" key={i}>
              <div className="why-icon">{card.icon}</div>
              <h3 className="why-card-title">{card.title}</h3>
              <p className="why-card-text">{card.text}</p>
              <span className={`why-tag ${card.tagClass}`}>{card.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
