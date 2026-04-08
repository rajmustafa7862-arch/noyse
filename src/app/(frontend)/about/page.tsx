import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TickerBar from '@/components/home/TickerBar'
import CTASection from '@/components/home/CTASection'

export const metadata: Metadata = {
  title: 'About — NOYSE',
  description: 'NOYSE is a human-curated news platform built to deliver signal over noise. Discover our mission, values, and team.',
}

const VALUES = [
  { icon: '🎯', title: 'Signal First', text: 'Every story is evaluated for genuine impact before it makes our feed. If it doesn\'t matter, it doesn\'t appear.' },
  { icon: '🧠', title: 'Human Judgment', text: 'Real editors with real expertise make every curation decision. No algorithm decides what you read.' },
  { icon: '⚡', title: 'Speed with Accuracy', text: 'We move fast, but never at the cost of facts. Every headline is verified before publishing.' },
  { icon: '🔒', title: 'No Agenda', text: 'We have no political affiliation, no advertiser influence, and no loyalty except to the truth.' },
  { icon: '🌍', title: 'Global Perspective', text: 'News doesn\'t stop at borders. We cover what matters across politics, tech, business, and culture worldwide.' },
  { icon: '✂️', title: 'Radical Brevity', text: 'Your time is finite. We condense what matters into clear, readable formats that respect your attention.' },
]

const STATS = [
  { num: '10K+', label: 'Articles curated' },
  { num: '50K+', label: 'Monthly readers' },
  { num: '7', label: 'Categories covered' },
  { num: '100%', label: 'Human edited' },
]

export default function AboutPage() {
  return (
    <>
      <TickerBar />
      <Navbar />
      <main id="about-page" className="page-top">
        {/* Hero */}
        <div className="page-hero">
          <div className="section-inner">
            <div className="page-hero-label">Our Story</div>
            <h1 className="page-hero-title">
              News without<br /><span>the noise.</span>
            </h1>
            <p className="page-hero-sub">
              NOYSE was built for people who need to stay informed — not overwhelmed.
              We curate, verify, and distill the news that actually matters.
            </p>
          </div>
        </div>

        {/* Who We Are */}
        <section className="about-section">
          <div className="section-inner">
            <div className="about-split">
              <div className="about-text-block">
                <div className="section-label">Who We Are</div>
                <div className="about-number">01</div>
                <h2 className="about-section-title">
                  A team of journalists who got <span>tired of the noise.</span>
                </h2>
                <div className="about-section-body">
                  <p>
                    NOYSE started when a group of journalists, editors, and technologists asked a simple
                    question: why does staying informed feel like a full-time job?
                  </p>
                  <p>
                    The answer was everywhere — endless feeds, clickbait headlines, partisan spin, and
                    algorithmic rabbit holes designed to maximize outrage, not understanding.
                  </p>
                  <p>
                    So we built the antidote. A platform where every story is chosen by a human,
                    every headline is honest, and your attention is treated as the finite resource it is.
                  </p>
                </div>
              </div>
              <div className="about-visual">
                {STATS.map(stat => (
                  <div key={stat.num} className="about-stat-row">
                    <div className="about-stat-num">{stat.num}</div>
                    <div className="about-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="about-section alt">
          <div className="section-inner">
            <div className="about-split">
              <div className="about-visual" style={{ order: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { step: '01', title: 'We monitor', desc: 'Our editors scan thousands of sources across every major category daily.' },
                    { step: '02', title: 'We verify', desc: 'Every story is cross-referenced against primary sources before it\'s approved.' },
                    { step: '03', title: 'We distill', desc: 'Long reports become clear, readable summaries that respect your time.' },
                    { step: '04', title: 'We publish', desc: 'Only the stories that genuinely matter make it to your feed.' },
                  ].map(item => (
                    <div key={item.step} style={{
                      display: 'flex', gap: '20px', alignItems: 'flex-start',
                      padding: '20px 0', borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
                        color: 'var(--accent)', letterSpacing: '0.1em', flexShrink: 0,
                        paddingTop: '4px',
                      }}>{item.step}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="about-text-block" style={{ order: 1 }}>
                <div className="section-label">What We Do</div>
                <div className="about-number">02</div>
                <h2 className="about-section-title">
                  We do the hard work<br /><span>so you don't have to.</span>
                </h2>
                <div className="about-section-body">
                  <p>
                    Our editors spend hours each day scanning hundreds of sources — wire services,
                    international outlets, specialist publications, and primary documents — to identify
                    what you actually need to know.
                  </p>
                  <p>
                    Then we strip away the noise: the takes, the reactions, the filler. What remains
                    is the essential signal, delivered clearly and concisely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why NOYSE */}
        <section className="about-section">
          <div className="section-inner">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Why NOYSE</div>
              <div className="about-number">03</div>
              <h2 className="about-section-title" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
                Principles we<br /><span>never compromise.</span>
              </h2>
              <p className="page-hero-sub" style={{ margin: '0 auto' }}>
                Every decision we make comes back to these values.
              </p>
            </div>
            <div className="values-grid">
              {VALUES.map(v => (
                <div key={v.title} className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-text">{v.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
