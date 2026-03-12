import { useEffect, useRef } from 'react';
import './MatchRing.css';

export default function MatchRing({ percentage }) {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const circumference = 2 * Math.PI * 54; // r=54

  useEffect(() => {
    const offset = circumference - (percentage / 100) * circumference;
    const circle = circleRef.current;
    const text = textRef.current;

    if (circle) {
      // Animate from full offset to target
      setTimeout(() => {
        circle.style.strokeDashoffset = offset;
      }, 300);
    }

    // Animate counter
    if (text) {
      let current = 0;
      const increment = percentage / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          text.textContent = `${Math.round(percentage)}%`;
          clearInterval(timer);
        } else {
          text.textContent = `${Math.round(current)}%`;
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [percentage, circumference]);

  const ringColor =
    percentage >= 75 ? '#A7FF83' : percentage >= 50 ? '#FF9D2E' : '#FF6B6B';

  return (
    <div className="match-ring-container">
      <svg className="match-ring" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ringColor} />
            <stop offset="100%" stopColor={percentage >= 75 ? '#4ECDC4' : percentage >= 50 ? '#FFD93D' : '#FF9D2E'} />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth="8"
        />
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#matchGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 60 60)"
          className="match-ring-progress"
        />
      </svg>
      <div className="match-pct" ref={textRef} style={{ color: ringColor }}>
        0%
      </div>
    </div>
  );
}
