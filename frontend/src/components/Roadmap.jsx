import './Roadmap.css';

export default function Roadmap({ phases }) {
  if (!phases || phases.length === 0) {
    return (
      <div className="roadmap-empty">
        <div className="roadmap-empty-icon">🎉</div>
        <h3>You&apos;re All Set!</h3>
        <p>No learning roadmap needed — your skills already match the requirements!</p>
      </div>
    );
  }

  const phaseIcons = ['🏗️', '📈', '🚀'];
  const phaseColors = ['var(--accent-red)', 'var(--accent-orange)', 'var(--accent-mint)'];

  return (
    <div className="roadmap-timeline">
      {phases.map((phase, idx) => (
        <div
          className="roadmap-phase animate-fade-in-up"
          key={phase.phase}
          style={{ animationDelay: `${idx * 0.15}s`, '--phase-color': phaseColors[idx] || 'var(--accent-mint)' }}
        >
          <div className="phase-connector">
            <div className="phase-dot" style={{ background: phaseColors[idx] }}>
              {phaseIcons[idx] || '📌'}
            </div>
            {idx < phases.length - 1 && <div className="phase-line"></div>}
          </div>
          <div className="phase-content">
            <div className="phase-header">
              <div className="phase-title-row">
                <span className="phase-number">Phase {phase.phase}</span>
                <h3 className="phase-name">{phase.name}</h3>
              </div>
              <span className="badge badge-muted">{phase.estimated_duration}</span>
            </div>
            <p className="phase-description">{phase.description}</p>
            <div className="phase-skills">
              {phase.skills.map((skill) => (
                <div className="phase-skill-card" key={skill.name}>
                  <div className="phase-skill-header">
                    <span className="phase-skill-name">{skill.name}</span>
                    <span className="phase-skill-gap">
                      Gap: {skill.gap}%
                    </span>
                  </div>
                  <div className="phase-skill-bar">
                    <div
                      className="phase-skill-bar-current"
                      style={{
                        width: `${skill.user_proficiency}%`,
                        background: phaseColors[idx],
                      }}
                    ></div>
                    <div
                      className="phase-skill-bar-target"
                      style={{ left: `${skill.required_proficiency}%` }}
                    ></div>
                  </div>
                  {skill.resources && skill.resources.length > 0 && (
                    <div className="phase-resources">
                      {skill.resources.slice(0, 1).map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="phase-resource-link"
                        >
                          📖 {res.title}
                          <span className="phase-resource-type">{res.type} · {res.duration}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
