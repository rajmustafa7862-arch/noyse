const tickerItems = [
  'Fed holds rates steady as inflation data comes in below expectations',
  'Apple unveils Vision Pro 2 with 40% faster M4 chip — starting at $2,999',
  'US Senate passes landmark AI regulation bill with bipartisan support',
  'OpenAI o3 model breaks every known benchmark in reasoning tasks',
  'Nvidia market cap surpasses $4 trillion for the first time in history',
  'SpaceX Starship completes first commercial payload delivery to orbit',
  'Global chip shortage eases as TSMC Taiwan plant reaches full capacity',
  'Bitcoin crosses $110,000 following spot ETF institutional inflows',
]

export default function TickerBar() {
  // Duplicate for seamless scroll loop
  const items = [...tickerItems, ...tickerItems]
  return (
    <div id="ticker-bar">
      <div className="ticker-label">
        <span className="pulse-dot"></span>
        LIVE
      </div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {items.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
