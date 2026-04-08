'use client'

import { useState, useEffect } from 'react'

interface ShareButtonsProps {
  title: string
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing
    }
  }

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="article-share">
      <span className="article-share-label">Share</span>
      <button className="share-btn" onClick={shareX}>
        𝕏 Post
      </button>
      <button className="share-btn" onClick={shareWhatsApp}>
        💬 WhatsApp
      </button>
      <button className={`share-btn${copied ? ' copied' : ''}`} onClick={copyLink}>
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
    </div>
  )
}
