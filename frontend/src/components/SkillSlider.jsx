import { IMPORTANCE_COLORS } from '../utils/constants';
import './SkillSlider.css';

export default function SkillSlider({ skill, value, onChange }) {
  const imp = IMPORTANCE_COLORS[skill.importance] || IMPORTANCE_COLORS['nice-to-have'];

  return (
    <div className="skill-slider" id={`skill-${skill.name.replace(/[^a-zA-Z0-9]/g, '-')}`}>
      <div className="skill-slider-header">
        <div className="skill-slider-info">
          <span className="skill-slider-name">{skill.name}</span>
          <span className="badge" style={{ background: imp.bg, color: imp.color }}>
            {skill.category}
          </span>
        </div>
        <div className="skill-slider-meta">
          <span
            className="importance-dot"
            style={{ background: imp.color }}
            title={imp.label}
          ></span>
          <span className="skill-slider-value" style={{ color: value >= skill.proficiency_needed ? '#A7FF83' : '#FF9D2E' }}>
            {value}%
          </span>
        </div>
      </div>
      <div className="skill-slider-track-wrapper">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="skill-range-input"
          style={{
            '--fill-pct': `${value}%`,
            '--fill-color': value >= skill.proficiency_needed ? '#A7FF83' : value > 0 ? '#FF9D2E' : '#5A6868',
          }}
        />
        <div className="skill-required-marker" style={{ left: `${skill.proficiency_needed}%` }} title={`Required: ${skill.proficiency_needed}%`}>
          <div className="marker-line"></div>
          <span className="marker-label">{skill.proficiency_needed}%</span>
        </div>
      </div>
    </div>
  );
}
