'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function ScrollReveal() {
  useEffect(() => {
    // Wait for loader to finish, then set up scroll triggers
    const init = () => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          }
        )
      })
      document.querySelectorAll<HTMLElement>('.reveal-right').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          }
        )
      })
      document.querySelectorAll<HTMLElement>('.reveal-left').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          }
        )
      })
      document.querySelectorAll<HTMLElement>('.reveal-scale').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          }
        )
      })
      ScrollTrigger.refresh()
    }

    // Listen for the loader done event, or fall back after 2.5s
    let initialized = false
    let fallback: ReturnType<typeof setTimeout>
    const onLoaderDone = () => {
      if (initialized) return
      initialized = true
      clearTimeout(fallback)
      init()
    }
    window.addEventListener('loaderDone', onLoaderDone, { once: true })
    fallback = setTimeout(onLoaderDone, 2500)

    return () => {
      window.removeEventListener('loaderDone', onLoaderDone)
      clearTimeout(fallback)
    }
  }, [])

  return null
}
