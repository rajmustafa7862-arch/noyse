'use client'

import { useRef } from 'react'
import { animate } from 'animejs'

export default function CTASection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleJoin = () => {
    const input = inputRef.current
    const btn = btnRef.current
    if (!input || !btn) return

    if (!input.value.includes('@')) {
      animate(input, {
        translateX: [0, -8, 8, -6, 6, 0],
        borderColor: ['rgba(239,68,68,0.8)', 'var(--border2)'],
        duration: 500, ease: 'outQuad'
      })
      return
    }

    btn.textContent = '✓ You\'re in!'
    btn.style.background = '#10b981'
    animate(btn, { scale: [1, 1.06, 1], duration: 400, ease: 'outElastic(1, .5)' })
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
          />
          <button ref={btnRef} className="btn-join" onClick={handleJoin}>
            Join Waitlist
          </button>
        </div>
        <p className="cta-note reveal">No spam. No noise. Cancel anytime.</p>
      </div>
    </section>
  )
}
