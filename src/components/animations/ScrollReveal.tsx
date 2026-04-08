'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function ScrollReveal() {
  useEffect(() => {
    const isInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    // Build a tween only when it makes sense:
    //   • If the element is already visible on screen, skip the animation entirely
    //     so it never flashes to opacity:0.
    //   • If it's below the fold, animate it in as the user scrolls.
    const setupReveal = (
      selector: string,
      from: gsap.TweenVars,
      to: Omit<gsap.TweenVars, 'scrollTrigger'>,
    ) => {
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (isInViewport(el)) return // already visible — leave it alone
        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })
    }

    const init = () => {
      setupReveal('.reveal',       { opacity: 0, y: 40 },       { opacity: 1, y: 0,     duration: 0.75, ease: 'power3.out' })
      setupReveal('.reveal-right', { opacity: 0, x: 40 },       { opacity: 1, x: 0,     duration: 0.75, ease: 'power3.out' })
      setupReveal('.reveal-left',  { opacity: 0, x: -40 },      { opacity: 1, x: 0,     duration: 0.75, ease: 'power3.out' })
      setupReveal('.reveal-scale', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1,  duration: 0.70, ease: 'power3.out' })
      ScrollTrigger.refresh()
    }

    let initialized = false
    let fallback: ReturnType<typeof setTimeout>

    const onLoaderDone = () => {
      if (initialized) return
      initialized = true
      clearTimeout(fallback)
      init()
    }

    // Only wait for the PageLoader on pages that have one (home page).
    // Every other page must initialise quickly so below-fold content still animates.
    const hasLoader = !!document.getElementById('loader')
    if (hasLoader) {
      window.addEventListener('loaderDone', onLoaderDone, { once: true })
      fallback = setTimeout(onLoaderDone, 2500)
    } else {
      // Two rAFs: first ensures paint, second ensures layout measurements are accurate.
      requestAnimationFrame(() => requestAnimationFrame(onLoaderDone))
    }

    return () => {
      window.removeEventListener('loaderDone', onLoaderDone)
      clearTimeout(fallback)
    }
  }, [])

  return null
}
