'use client'

import { useRef, useState } from 'react'
import { animate } from 'animejs'

export default function CTASection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const btnRef   = useRef<HTMLButtonElement>(null)
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    const input = inputRef.current
    const btn   = btnRef.current
    if (!input || !btn) return

    // Client-side format check
    if (!input.value.includes('@')) {
      animate(input, {
        translateX: [0, -8, 8, -6, 6, 0],
        borderColor: ['rgba(239,68,68,0.8)', 'var(--border2)'],
        duration: 500, ease: 'outQuad',
      })
      return
    }

    setLoading(true)
    btn.textContent = 'Sending…'

    try {
      const res  = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.value.trim() }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Unknown error')

      btn.textContent   = '✓ You\'re in!'
      btn.style.background = '#10b981'
      animate(btn, { scale: [1, 1.06, 1], duration: 400, ease: 'outElastic(1, .5)' })
      input.value = ''
    } catch {
      btn.textContent      = 'Try again'
      btn.style.background = 'rgba(239,68,68,0.8)'
      animate(btn, { scale: [1, 1.04, 1], duration: 300, ease: 'outQuad' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="cta">
      <div className="cta-glow"></div>
      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cta-label reveal">Join the signal</div>
        <h2 className="cta-title reveal">Cut the noise.<br /><em>Stay informed.</em></h2>
        <p className="cta-sub reveal">Get the only digest you&apos;ll actually read. Delivered twice daily.</p>
        <div className="email-form reveal">
          <input
            ref={inputRef}
            type="email"
            className="email-input"
            placeholder="your@email.com"
            disabled={loading}
          />
          <button
            ref={btnRef}
            className="btn-join"
            onClick={handleJoin}
            disabled={loading}
          >
            Join Waitlist
          </button>
        </div>
        <p className="cta-note reveal">No spam. No noise. Cancel anytime.</p>
      </div>
    </section>
  )
}
