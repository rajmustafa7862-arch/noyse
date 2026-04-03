const dropsData = [
  { platform: 'X (Twitter)', icon: '𝕏', text: '<strong>BREAKING:</strong> Fed holds rates. Markets rally 1.4%. Key data: CPI at 2.1%, below target.', time: '4 min ago', likes: '2.4K', reposts: '890' },
  { platform: 'LinkedIn', icon: 'in', text: 'New report: AI adoption in enterprise reached <strong>67%</strong> in Q1 2026 — up from 31% a year ago.', time: '22 min ago', likes: '5.1K', reposts: '1.2K' },
  { platform: 'Instagram', icon: '◎', text: 'Nvidia just crossed <strong>$4 trillion</strong> market cap. Here\'s why this matters for tech in 2026 👇', time: '1 hr ago', likes: '8.7K', reposts: '2.1K' },
  { platform: 'X (Twitter)', icon: '𝕏', text: 'US Senate AI bill passed 78-21. Landmark moment for <strong>AI regulation</strong>. Thread on what it means →', time: '2 hr ago', likes: '12K', reposts: '4.4K' },
  { platform: 'Telegram', icon: '✈', text: '<strong>Daily Signal Brief:</strong> 5 stories that moved the world today. Read in 3 minutes. Link in bio.', time: '3 hr ago', likes: '3.3K', reposts: '1.8K' },
  { platform: 'LinkedIn', icon: 'in', text: 'Apple Intelligence 2.0 rollout analysis: what it means for <strong>enterprise productivity</strong> and AI tooling.', time: '4 hr ago', likes: '7.2K', reposts: '2.9K' },
]

// Duplicate for seamless loop
const allDrops = [...dropsData, ...dropsData]

export default function DropsSection() {
  return (
    <section id="drops">
      <div className="section-inner">
        <div className="drops-header">
          <div className="section-label reveal">Social Drops</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px,4vw,44px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
            className="reveal"
          >
            Latest from our feeds.
          </h2>
        </div>
      </div>
      <div className="drops-track-wrap">
        <div className="drops-track" id="drops-track">
          {allDrops.map((d, i) => (
            <div className="drop-card" key={i}>
              <div className="drop-platform">
                <div className="platform-icon">{d.icon}</div>
                <span>{d.platform}</span>
              </div>
              <p className="drop-text" dangerouslySetInnerHTML={{ __html: d.text }} />
              <div className="drop-meta">{d.time}</div>
              <div className="drop-stats">
                <span>♥ {d.likes}</span>
                <span>↩ {d.reposts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
