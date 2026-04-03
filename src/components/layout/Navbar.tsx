'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { animate } from 'animejs'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const isOpen = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 20)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileNav = () => {
    if (!mobileNavRef.current || !hamburgerRef.current) return
    isOpen.current = !isOpen.current
    mobileNavRef.current.classList.toggle('open', isOpen.current)

    const spans = hamburgerRef.current.querySelectorAll('span')
    if (isOpen.current) {
      animate(spans[0], { translateY: 6.5, rotate: 45, duration: 300, ease: 'outQuad' })
      animate(spans[1], { opacity: 0, duration: 200, ease: 'outQuad' })
      animate(spans[2], { translateY: -6.5, rotate: -45, duration: 300, ease: 'outQuad' })
    } else {
      animate(spans[0], { translateY: 0, rotate: 0, duration: 300, ease: 'outQuad' })
      animate(spans[1], { opacity: 1, duration: 200, ease: 'outQuad' })
      animate(spans[2], { translateY: 0, rotate: 0, duration: 300, ease: 'outQuad' })
    }
  }

  const closeMobileNav = () => {
    if (!mobileNavRef.current || !hamburgerRef.current) return
    isOpen.current = false
    mobileNavRef.current.classList.remove('open')
    const spans = hamburgerRef.current.querySelectorAll('span')
    animate(spans[0], { translateY: 0, rotate: 0, duration: 300, ease: 'outQuad' })
    animate(spans[1], { opacity: 1, duration: 200, ease: 'outQuad' })
    animate(spans[2], { translateY: 0, rotate: 0, duration: 300, ease: 'outQuad' })
  }

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const html = document.documentElement
    const isDark = html.getAttribute('data-theme') === 'dark'
    html.setAttribute('data-theme', isDark ? 'light' : 'dark')
    btn.textContent = isDark ? '☽' : '☀'
    animate(btn, { rotate: [0, 360], duration: 500, ease: 'outQuad' })
  }

  return (
    <>
      <nav id="nav" ref={navRef}>
        <div className="nav-brand">
          <span className="brand-dot"></span>
          NOYSE
        </div>
        <ul className="nav-links">
          <li><a href="#why">Why NOYSE</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#news">News</a></li>
          <li><a href="#drops">Drops</a></li>
        </ul>
        <div className="nav-actions">
          <button id="theme-toggle" title="Toggle theme" onClick={handleThemeToggle}>☀</button>
          <button className="btn-ghost">Sign In</button>
          <button className="btn-primary">Get Access</button>
          <button
            className="hamburger"
            id="hamburger"
            ref={hamburgerRef}
            aria-label="Menu"
            onClick={toggleMobileNav}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div id="mobile-nav" ref={mobileNavRef}>
        <a href="#why" onClick={closeMobileNav}>Why NOYSE</a>
        <a href="#features" onClick={closeMobileNav}>Features</a>
        <a href="#news" onClick={closeMobileNav}>News</a>
        <a href="#drops" onClick={closeMobileNav}>Drops</a>
        <a href="#cta" onClick={closeMobileNav}>Get Access</a>
      </div>
    </>
  )
}
