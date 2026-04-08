export default function Footer() {
  return (
    <footer id="footer">
      <div className="section-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <span className="brand-dot"></span>
              NOYSE
            </div>
            <p className="footer-tagline">AI-powered news intelligence. Signal over noise, always.</p>
            <div className="footer-social">
              <a className="social-btn" href="#" title="X/Twitter">𝕏</a>
              <a className="social-btn" href="#" title="Instagram">◎</a>
              <a className="social-btn" href="#" title="LinkedIn">in</a>
              <a className="social-btn" href="#" title="Telegram">✈</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#">News Feed</a></li>
              <li><a href="#">AI Digest</a></li>
              <li><a href="#">Latest Drops</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Editorial</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 NOYSE Inc. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
