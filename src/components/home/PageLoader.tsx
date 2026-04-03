'use client'

import { useEffect, useRef } from 'react'

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = loaderRef.current
    const bar = barRef.current
    const pct = pctRef.current
    const brand = brandRef.current
    if (!loader || !bar || !pct || !brand) return

    // Show brand text
    setTimeout(() => brand.classList.add('show'), 100)

    let progress = 0
    const iv = setInterval(() => {
      progress += Math.random() * 18 + 4
      if (progress >= 100) {
        progress = 100
        clearInterval(iv)
        bar.style.width = '100%'
        pct.textContent = '100%'
        // Fade out loader
        setTimeout(() => {
          loader.style.opacity = '0'
          setTimeout(() => {
            loader.style.display = 'none'
            window.dispatchEvent(new Event('loaderDone'))
          }, 600)
        }, 300)
        return
      }
      bar.style.width = progress + '%'
      pct.textContent = Math.floor(progress) + '%'
    }, 60)
  }, [])

  return (
    <div id="loader" ref={loaderRef}>
      <div className="loader-brand">
        <div className="loader-brand-inner" ref={brandRef}>NOYSE</div>
      </div>
      <div className="loader-bar-wrap">
        <div className="loader-bar" ref={barRef}></div>
      </div>
      <div className="loader-pct" ref={pctRef}>0%</div>
    </div>
  )
}
