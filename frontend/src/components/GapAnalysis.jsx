import { IMPORTANCE_COLORS } from '../utils/constants';
import './GapAnalysis.css';

export default function GapAnalysis({ analysis }) {
  const sections = [
    {
      id: 'missing',
      title: 'Missing Skills',
      dotClass: 'dot-red',
      skills: analysis.missing_skills,
      barClass: 'gap-bar-red',
    },
    {
      id: 'partial',
      title: 'Needs Improvement',
      dotClass: 'dot-orange',
      skills: analysis.partial_skills,
      barClass: 'gap-bar-orange',
    },
    {
      id: 'matched',
      title: 'Matched Skills',
      dotClass: 'dot-mint',
      skills: analysis.matched_skills,
      barClass: 'gap-bar-mint',
    },
  ];

  return (
    <div className="gap-analysis">
      {sections.map((section) =>
        section.skills.length > 0 ? (
          <div className="gap-section" key={section.id}>
            <h3 className="gap-heading">
              <span className={`gap-dot ${section.dotClass}`}></span>
              {section.title}
              <span className="gap-count">{section.skills.length}</span>
            </h3>
            <div className="gap-list">
              {section.skills.map((skill, idx) => {
                const imp = IMPORTANCE_COLORS[skill.importance] || IMPORTANCE_COLORS['nice-to-have'];
                return (
                  <div
                    className="gap-item animate-fade-in-up"
                    key={skill.name}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="gap-item-header">
                      <div className="gap-item-info">
                        <span className="gap-item-name">{skill.name}</span>
                        <span className="badge" style={{ background: imp.bg, color: imp.color }}>
                          {imp.label}
                        </span>
                      </div>
                      <div className="gap-item-values">
                        <span className="gap-user-val">{skill.user_proficiency}%</span>
                        <span className="gap-sep">/</span>
                        <span className="gap-req-val">{skill.required_proficiency}%</span>
                      </div>
                    </div>
                    <div className="gap-bar-track">
                      <div
                        className={`gap-bar-fill ${section.barClass}`}
                        style={{ width: `${skill.user_proficiency}%` }}
                      ></div>
                      <div
                        className="gap-bar-required"
                        style={{ left: `${skill.required_proficiency}%` }}
                      ></div>
                    </div>
                    {skill.resources && skill.resources.length > 0 && (
                      <div className="gap-resources">
                        <div className="resources-header">
                          <span className="resources-header-icon">🎯</span>
                          <span className="resources-header-title">Recommended Learning</span>
                          <span className="resources-header-badge">{skill.resources.length} resource{skill.resources.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="resources-grid">
                          {skill.resources.slice(0, 3).map((res, rIdx) => {
                            const isVideo = res.type === 'Video';
                            const isCourse = res.type === 'Course';
                            return (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`gap-resource-card ${isVideo ? 'resource-video' : isCourse ? 'resource-course' : 'resource-doc'}`}
                              >
                                <div className="resource-card-icon">
                                  {isVideo ? '🎥' : isCourse ? '📚' : '📖'}
                                </div>
                                <div className="resource-card-body">
                                  <span className="resource-card-type">{res.type || 'Documentation'}</span>
                                  <span className="resource-card-title">{res.title}</span>
                                  <span className="resource-card-duration">{res.duration}</span>
                                </div>
                                <div className="resource-card-arrow">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                                  </svg>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
