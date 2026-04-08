import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TickerBar from '@/components/home/TickerBar'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — NOYSE',
  description: 'Get in touch with the NOYSE team. Questions, tips, corrections, or partnerships — we\'d love to hear from you.',
}

const SOCIAL_LINKS = [
  { label: 'X / Twitter', icon: '𝕏', href: 'https://x.com/noysenews' },
  { label: 'Instagram', icon: '◎', href: 'https://instagram.com/noysenews' },
  { label: 'LinkedIn', icon: 'in', href: 'https://linkedin.com/company/noyse' },
  { label: 'Telegram', icon: '✈', href: 'https://t.me/noysenews' },
]

export default function ContactPage() {
  return (
    <>
      <TickerBar />
      <Navbar />
      <main className="page-top">
        {/* Page hero */}
        <div className="page-hero">
          <div className="section-inner">
            <div className="page-hero-label">Get In Touch</div>
            <h1 className="page-hero-title">
              Let&apos;s <span>talk.</span>
            </h1>
            <p className="page-hero-sub">
              Have a tip, question, or partnership idea? The NOYSE team reads every message.
            </p>
          </div>
        </div>

        {/* Contact layout */}
        <section id="contact-page">
          <div className="section-inner">
            <div className="contact-layout">
              {/* Left column — info */}
              <div className="contact-info">
                <h2 className="contact-info-title">We&apos;re always looking for great stories.</h2>
                <p className="contact-info-body">
                  Have a news tip, exclusive story, or want to collaborate? Whether you&apos;re a
                  reader, a journalist, or a brand — we&apos;d love to connect.
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-method-icon">📧</div>
                    <div>
                      <div className="contact-method-label">Email</div>
                      <div className="contact-method-value">hello@noyse.com</div>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon">💡</div>
                    <div>
                      <div className="contact-method-label">Story Tips</div>
                      <div className="contact-method-value">tips@noyse.com</div>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon">🤝</div>
                    <div>
                      <div className="contact-method-label">Partnerships</div>
                      <div className="contact-method-value">partners@noyse.com</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="section-label" style={{ marginBottom: '16px' }}>Follow Us</div>
                  <div className="contact-socials">
                    {SOCIAL_LINKS.map(s => (
                      <a key={s.label} href={s.href} className="social-btn" title={s.label} target="_blank" rel="noopener noreferrer">
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
