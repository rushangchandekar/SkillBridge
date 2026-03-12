import { CAREER_META } from '../utils/constants';
import './CareerCard.css';

export default function CareerCard({ career, isSelected, onSelect }) {
  const meta = CAREER_META[career.id] || { icon: '💼', color: '#A7FF83' };

  const demandClass = career.demand === 'Very High'
    ? 'badge-mint'
    : career.demand === 'High'
      ? 'badge-orange'
      : 'badge-muted';

  return (
    <button
      className={`career-card ${isSelected ? 'career-card-selected' : ''}`}
      onClick={() => onSelect(career)}
      style={{ '--card-accent': meta.color }}
      id={`career-${career.id}`}
    >
      <div className="career-card-icon">{meta.icon}</div>
      <div className="career-card-body">
        <h4 className="career-card-title">{career.title}</h4>
        <div className="career-card-meta">
          <span className="badge badge-muted">{career.category}</span>
          <span className={`badge ${demandClass}`}>{career.demand}</span>
        </div>
        <div className="career-card-footer">
          <span className="career-salary">💰 {career.avg_salary_inr}</span>
          <span className="career-skills">{career.skill_count} skills</span>
        </div>
      </div>
      {isSelected && <div className="career-card-check">✓</div>}
    </button>
  );
}
