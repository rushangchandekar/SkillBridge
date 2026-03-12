import { useState } from 'react';
import MatchRing from '../components/MatchRing';
import GapAnalysis from '../components/GapAnalysis';
import Roadmap from '../components/Roadmap';
import Insights from '../components/Insights';
import { CAREER_META } from '../utils/constants';
import './Dashboard.css';

export default function Dashboard({ results, onBack }) {
  const [activeTab, setActiveTab] = useState('gap');

  if (!results) return null;

  const { analysis, roadmap, insights } = results;
  const meta = CAREER_META[analysis.career.id] || { icon: '💼', color: '#A7FF83' };

  const tabs = [
    { id: 'gap', label: 'Skill Gap Analysis', icon: '📊' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: '🗺️' },
    { id: 'insights', label: 'AI Insights', icon: '🤖' },
  ];

  return (
    <section className="dashboard" id="dashboard">
      <div className="section-container">
        <div className="dash-header animate-fade-in-up">
          <div className="dash-header-left">
            <h2 className="section-title">Career Progress Dashboard</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              <span className="dash-career-icon">{meta.icon}</span>{' '}
              Analysis for <strong>{analysis.career.title}</strong>
            </p>
          </div>
          <div className="dash-header-right">
            <span className="badge badge-muted">{analysis.career.category}</span>
            <span className="dash-salary">💰 {analysis.career.avg_salary_inr}</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="overview-card match-card">
            <div className="overview-label">Job Match Score</div>
            <MatchRing percentage={analysis.match_percentage} />
          </div>
          <div className="overview-card">
            <div className="overview-icon-large">✅</div>
            <div className="overview-value text-mint">{analysis.matched_count}</div>
            <div className="overview-label">Skills Matched</div>
            <div className="overview-bar">
              <div
                className="overview-bar-fill bar-mint"
                style={{ width: `${(analysis.matched_count / analysis.total_required_skills) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon-large">⚠️</div>
            <div className="overview-value text-orange">{analysis.partial_count}</div>
            <div className="overview-label">Needs Improvement</div>
            <div className="overview-bar">
              <div
                className="overview-bar-fill bar-orange"
                style={{ width: `${(analysis.partial_count / analysis.total_required_skills) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon-large">❌</div>
            <div className="overview-value text-red">{analysis.missing_count}</div>
            <div className="overview-label">Skills Missing</div>
            <div className="overview-bar">
              <div
                className="overview-bar-fill bar-red"
                style={{ width: `${(analysis.missing_count / analysis.total_required_skills) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="dash-tabs animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content animate-fade-in" key={activeTab}>
          {activeTab === 'gap' && <GapAnalysis analysis={analysis} />}
          {activeTab === 'roadmap' && <Roadmap phases={roadmap} />}
          {activeTab === 'insights' && <Insights content={insights} />}
        </div>

        {/* Back Button */}
        <div className="dash-footer animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button className="btn btn-outline" id="back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Analyze Another Career</span>
          </button>
        </div>
      </div>
    </section>
  );
}
