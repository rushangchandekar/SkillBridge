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
      <div className="section-container hero-main">
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

        <div className="hero-visual-container animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="scene-3d">
            <div className="hero-visual-3d">
              <div className="floating-card card-1 active-interactive">
                <div className="card-icon">🎯</div>
                <div className="card-label">Gap Detection</div>
              </div>
              <div className="floating-card card-2 active-interactive">
                <div className="card-icon">📊</div>
                <div className="card-label">Skill Analysis</div>
              </div>
              <div className="floating-card card-3 active-interactive">
                <div className="card-icon">🚀</div>
                <div className="card-label">Career Roadmap</div>
              </div>
              <div className="hero-circle-3d">
                <div className="circle-inner"></div>
                <div className="circle-pulse"></div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Why Skills Matter Section */}
      <section className="skills-matter">
        <div className="section-container">
          <div className="skills-matter-grid">
            <div className="skills-matter-info">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                Industry Insights
              </div>
              <h2 className="section-title">Why Continuous Skill Alignment Matters</h2>
              <p className="section-subtitle">
                In the rapidly evolving tech landscape, traditional degrees are only the starting point. 
                True employability comes from matching your technical stack with real-world market demands.
              </p>
              <div className="insight-list">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <div className="insight-text">
                    <h4>The Half-Life of Tech Skills</h4>
                    <p>Technical skills now have a half-life of just 5 years. Staying relevant requires constant gap detection.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🔍</div>
                  <div className="insight-text">
                    <h4>Precision over Volume</h4>
                    <p>It's not about how many skills you have, but having the *right* skills for your specific career path.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">💼</div>
                  <div className="insight-text">
                    <h4>AI-Enhanced Roles</h4>
                    <p>Modern roles require a blend of core engineering and AI literacy. GAP0 helps you navigate this hybrid future.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="skills-matter-visual">
              <div className="stats-card animate-glow">
                <h3>42.6%</h3>
                <p>Employability rate of graduates in 2024</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '42.6%' }}></div>
                </div>
                <span className="stat-source:">Source: Graduate Skill Index</span>
              </div>
              <div className="info-card-floating">
                <div className="card-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <code>
                  {`if (skillGap > threshold) {\n  generateRoadmap();\n  focusLearning();\n}`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack">
        <div className="section-container">
          <div className="tech-stack-header" style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              The Engine
            </div>
            <h2 className="section-title">Powered by Modern Intelligence</h2>
            <p className="section-subtitle" style={{ margin: '0 auto var(--sp-10)' }}>
              GAP0 leverages a state-of-the-art technology stack to provide high-precision skill analysis.
            </p>
          </div>
          
          <div className="tech-grid">
            <div className="tech-card active-interactive">
              <div className="tech-icon">🧠</div>
              <h3>Google Gemini AI</h3>
              <p>Uses LLM-based reasoning to extract deep semantic meaning from resumes and match them to complex job requirements.</p>
            </div>
            <div className="tech-card active-interactive">
              <div className="tech-icon">🐍</div>
              <h3>Python Backend</h3>
              <p>A robust Flask-based processing engine handles file conversions (PDF/DOCX) and coordinates the analysis pipeline.</p>
            </div>
            <div className="tech-card active-interactive">
              <div className="tech-icon">⚛️</div>
              <h3>React Frontend</h3>
              <p>A high-performance cinematic UI built with React and Vite for a seamless, interactive user experience.</p>
            </div>
            <div className="tech-card active-interactive">
              <div className="tech-icon">🗄️</div>
              <h3>SQLite Persistence</h3>
              <p>Secure, lightweight data persistence for tracking your history and career growth over time.</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
