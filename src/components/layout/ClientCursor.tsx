'use client'

import { useEffect } from 'react'

export default function ClientCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!cursor || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = mx + 'px'
      cursor.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove)

    const animate = () => {
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => {
      cursor.style.width = '6px'
      cursor.style.height = '6px'
      ring.style.width = '52px'
      ring.style.height = '52px'
      ring.style.borderColor = 'rgba(79,110,247,0.8)'
    }
    const onLeave = () => {
      cursor.style.width = '10px'
      cursor.style.height = '10px'
      ring.style.width = '36px'
      ring.style.height = '36px'
      ring.style.borderColor = 'rgba(79,110,247,0.5)'
    }

    const attachHover = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachHover()

    // Re-attach on DOM changes (for dynamic content)
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
    </>
  )
}
