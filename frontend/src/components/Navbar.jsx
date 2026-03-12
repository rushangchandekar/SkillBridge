import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ currentSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#" className="nav-logo" id="nav-logo" onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            GAP<span className="accent">0</span>
          </span>
        </a>
        <div className="nav-links">
          <button
            className={`nav-link ${currentSection === 'hero' ? 'active' : ''}`}
            onClick={() => onNavigate('hero')}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentSection === 'profiler' ? 'active' : ''}`}
            onClick={() => onNavigate('profiler')}
          >
            Profile
          </button>
          <button
            className={`nav-link ${currentSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
            disabled={currentSection !== 'dashboard'}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${currentSection === 'history' ? 'active' : ''}`}
            onClick={() => onNavigate('history')}
          >
            History
          </button>
        </div>
        <div className="nav-actions">
          <div className="nav-status">
            <span className="status-dot"></span>
            <span className="status-text">AI Ready</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
