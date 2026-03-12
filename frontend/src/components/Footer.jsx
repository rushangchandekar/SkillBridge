import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">
              Skill<span className="accent">Bridge</span>
            </span>
          </div>
          <p className="footer-tagline">AI-powered skill gap analysis for employability</p>
        </div>
        <div className="footer-bottom">
          <p>Built for Hackathon 2026 • Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  );
}
