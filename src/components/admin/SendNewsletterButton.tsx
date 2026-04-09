'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useState } from 'react'

export function SendNewsletterButton() {
  const { id } = useDocumentInfo()
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    if (!id || status === 'sending' || status === 'sent') return
    if (!window.confirm('Send this newsletter to ALL active subscribers now?\n\nThis cannot be undone.')) return

    setStatus('sending')
    setMessage('')

    try {
      const res  = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterId: id }),
      })
      const data = await res.json() as { count?: number; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')

      setStatus('sent')
      setMessage(`✓ Sent to ${data.count ?? 0} subscriber${data.count !== 1 ? 's' : ''}`)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const bgColor =
    status === 'sent'    ? '#10b981' :
    status === 'error'   ? '#ef4444' :
    status === 'sending' ? '#374151' : '#4f6ef7'

  return (
    <div style={{ marginTop: '8px', marginBottom: '4px' }}>
      <button
        type="button"
        onClick={handleSend}
        disabled={status === 'sending' || status === 'sent'}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: bgColor,
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: status === 'sending' || status === 'sent' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          letterSpacing: '0.02em',
        }}
      >
        {status === 'idle'    && '📤  Send to All Subscribers'}
        {status === 'sending' && 'Sending…'}
        {status === 'sent'    && '✓  Sent!'}
        {status === 'error'   && '✗  Failed — try again'}
      </button>

      {message && (
        <p style={{
          marginTop: '8px',
          fontSize: '12px',
          lineHeight: '1.5',
          color: status === 'error' ? '#ef4444' : '#10b981',
        }}>
          {message}
        </p>
      )}
    </div>
  )
}
