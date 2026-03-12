import { useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero({ onStart }) {
  const statsRef = useRef(null);

  useEffect(() => {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.count, 10);
              let current = 0;
              const increment = target / 40;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  counter.textContent = target;
                  clearInterval(timer);
                } else {
                  counter.textContent = Math.floor(current);
                }
              }, 30);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-badge animate-fade-in-up">
          <span className="badge-dot"></span>
          AI-Powered Career Analysis
        </div>
        <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Bridge the Gap Between{' '}
          <span className="gradient-text">Your Skills</span> &amp;{' '}
          <span className="gradient-text-alt">Your Dream Career</span>
        </h1>
        <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Discover exactly which skills you need, get a personalized learning roadmap,
          and track your progress towards employability — all powered by AI.
        </p>
        <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.3s' }} ref={statsRef}>
          <div className="stat-item">
            <span className="stat-number" data-count="10">0</span>
            <span className="stat-label">Career Paths</span>
          </div>
          <div className="stat-item">
            <div className="stat-row">
              <span className="stat-number" data-count="120">0</span>
              <span className="stat-plus">+</span>
            </div>
            <span className="stat-label">Skills Tracked</span>
          </div>
          <div className="stat-item">
            <div className="stat-row">
              <span className="stat-number" data-count="50">0</span>
              <span className="stat-plus">+</span>
            </div>
            <span className="stat-label">Learning Resources</span>
          </div>
        </div>
        <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn-primary btn-lg" id="cta-start" onClick={onStart}>
            <span>Start Your Analysis</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a href="#how-it-works" className="btn btn-outline btn-lg">
            How It Works
          </a>
        </div>
      </div>

      <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="floating-card card-1">
          <div className="card-icon">🎯</div>
          <div className="card-label">Gap Detection</div>
        </div>
        <div className="floating-card card-2">
          <div className="card-icon">📊</div>
          <div className="card-label">Skill Analysis</div>
        </div>
        <div className="floating-card card-3">
          <div className="card-icon">🚀</div>
          <div className="card-label">Career Roadmap</div>
        </div>
        <div className="hero-circle"></div>
      </div>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Three simple steps to your personalized career roadmap
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📝</div>
              <h3>Profile Your Skills</h3>
              <p>Select your target career and rate your current proficiency in relevant skills.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path d="M0 10h35M30 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🤖</div>
              <h3>AI Analysis</h3>
              <p>Our engine compares your skills against real industry requirements and finds gaps.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path d="M0 10h35M30 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🗺️</div>
              <h3>Get Your Roadmap</h3>
              <p>Receive a phased learning plan with curated resources for each missing skill.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
