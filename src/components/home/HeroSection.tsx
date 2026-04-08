'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stat1Ref = useRef<HTMLSpanElement>(null)
  const stat2Ref = useRef<HTMLSpanElement>(null)
  const stat3Ref = useRef<HTMLSpanElement>(null)
  const stat4Ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    initCanvas()

    // Delay hero animations until the page loader finishes
    let animated = false
    let fallback: ReturnType<typeof setTimeout>
    const startAnim = () => {
      if (animated) return
      animated = true
      clearTimeout(fallback)
      animateHero()
    }
    window.addEventListener('loaderDone', startAnim, { once: true })
    // Fallback: if loader never fires (e.g. dev hot reload), start after 2s
    fallback = setTimeout(startAnim, 2000)

    return () => {
      window.removeEventListener('loaderDone', startAnim)
      clearTimeout(fallback)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  function initCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    let animFrame: number
    interface Particle {
      bx: number; by: number; x: number; y: number
      vx: number; vy: number; alpha: number; size: number
      speed: number; phase: number
    }
    let particles: Particle[] = []

    function resize() {
      W = canvas!.width = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const buildParticles = () => {
      particles = []
      const COLS = Math.ceil(W / 80)
      const ROWS = Math.ceil(H / 80)
      for (let c = 0; c <= COLS; c++) {
        for (let r = 0; r <= ROWS; r++) {
          particles.push({
            bx: (c / COLS) * W,
            by: (r / ROWS) * H,
            x: (c / COLS) * W,
            y: (r / ROWS) * H,
            vx: 0, vy: 0,
            alpha: Math.random() * 0.3 + 0.05,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }
    buildParticles()
    window.addEventListener('resize', buildParticles)

    let mouseX = W / 2, mouseY = H / 2
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    })

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H)
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      const dotColor = isDark ? '255,255,255' : '0,0,0'
      const lineColor = '79,110,247'

      particles.forEach(p => {
        p.x = p.bx + Math.sin(t * 0.0004 + p.phase) * 6
        p.y = p.by + Math.cos(t * 0.0005 + p.phase) * 6

        const dx = p.x - mouseX, dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120 * 12
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${dotColor},${p.alpha * 0.7})`
        ctx!.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(${lineColor},${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animFrame = requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', buildParticles)
    }
  }

  function animateHero() {
    gsap.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' })
    gsap.to('.word-inner', { y: 0, duration: 1, stagger: 0.12, delay: 0.25, ease: 'power4.out' })
    gsap.to('#hero-sub', { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' })
    gsap.to('#hero-cta', { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' })
    gsap.to('#hero-stats', {
      opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power3.out',
      onComplete: animateCounters
    })

    // Hero parallax
    gsap.to('.hero-glow-1', {
      y: -80, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    })
    gsap.to('.hero-glow-2', {
      y: -120, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    })
  }

  function animateCounters() {
    const counters = [
      { ref: stat1Ref, end: 120, suffix: '+' },
      { ref: stat2Ref, end: 2400, suffix: '+' },
      { ref: stat3Ref, end: 99, suffix: '%' },
      { ref: stat4Ref, end: 90, suffix: 'ms' },
    ]
    counters.forEach(c => {
      const el = c.ref.current
      if (!el) return
      let start = 0
      const step = () => {
        start += Math.ceil((c.end - start) / 12) || 1
        if (start >= c.end) { el.textContent = c.end + c.suffix; return }
        el.textContent = start + c.suffix
        requestAnimationFrame(step)
      }
      step()
    })
  }

  return (
    <section id="hero">
      <canvas id="hero-canvas" ref={canvasRef}></canvas>
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      <div className="hero-inner">
        <div className="hero-eyebrow" id="hero-eyebrow">
          <span className="eyebrow-line"></span>
          AI-powered news intelligence
        </div>

        <h1 className="hero-headline" id="hero-headline">
          <span className="word"><span className="word-inner">News</span></span>
          <span>&nbsp;</span>
          <span className="word"><span className="word-inner">without</span></span>
          <br />
          <span className="word"><span className="word-inner" style={{ color: 'var(--accent)' }}>Clutter.</span></span>
        </h1>

        <p className="hero-sub" id="hero-sub">
          NOYSE cuts through information overload to surface only the signals that matter — curated by AI, built for clarity.
        </p>

        <div className="hero-cta" id="hero-cta">
          <button className="btn-hero-primary" id="cta-explore">
            Explore News <span className="btn-arrow">→</span>
          </button>
          <button className="btn-hero-sec">View Latest Drops</button>
        </div>

        <div className="hero-stats" id="hero-stats">
          <div className="stat-item">
            <span className="stat-num" ref={stat1Ref}>0</span>
            <span className="stat-label">Stories daily</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item">
            <span className="stat-num" ref={stat2Ref}>0</span>
            <span className="stat-label">Sources monitored</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item">
            <span className="stat-num" ref={stat3Ref}>0%</span>
            <span className="stat-label">Clickbait filtered</span>
          </div>
          <div className="stat-div"></div>
          <div className="stat-item">
            <span className="stat-num" ref={stat4Ref}>0ms</span>
            <span className="stat-label">Average delivery</span>
          </div>
        </div>
      </div>
    </section>
  )
}
