import { useState, useEffect } from 'react';
import CareerCard from '../components/CareerCard';
import SkillSlider from '../components/SkillSlider';
import ResumeUpload from '../components/ResumeUpload';
import { fetchCareers, fetchCareerSkills } from '../utils/api';
import { CAREER_META } from '../utils/constants';
import './Profiler.css';

export default function Profiler({ onAnalyze, onResumeResults }) {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [skillValues, setSkillValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('choose'); // 'choose' | 'resume' | 'manual'

  useEffect(() => {
    fetchCareers()
      .then((data) => {
        setCareers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCareerSelect = (career) => {
    setSelectedCareer(career);
    setSkillValues({});
    setMode('choose'); // Reset mode when changing career
  };

  const handleSkillChange = (skillName, value) => {
    setSkillValues((prev) => ({ ...prev, [skillName]: value }));
  };

  const handleAnalyze = () => {
    if (!selectedCareer) return;
    const skills = Object.entries(skillValues).map(([name, proficiency]) => ({
      name,
      proficiency,
    }));
    onAnalyze(selectedCareer.id, skills);
  };

  const handleResumeResults = (data) => {
    // Resume analysis returns the full results directly
    onResumeResults(data);
  };

  if (loading) {
    return (
      <section className="profiler" id="profiler">
        <div className="section-container">
          <div className="profiler-loading">
            <div className="spinner"></div>
            <p>Loading career paths…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profiler" id="profiler">
        <div className="section-container">
          <div className="profiler-error">
            <div className="error-icon">⚠️</div>
            <h3>Connection Error</h3>
            <p>Make sure the backend is running on <code>localhost:5000</code></p>
            <p className="error-detail">{error}</p>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profiler" id="profiler">
      <div className="section-container">
        <h2 className="section-title">Student Skill Profiler</h2>
        <p className="section-subtitle">
          Select your dream career, then upload your resume or rate skills manually
        </p>

        <div className="profiler-layout">
          {/* Career Selection */}
          <div className="profiler-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <span className="sidebar-icon">🎓</span>
                Choose Your Target Career
              </h3>
              <div className="career-grid" id="career-grid">
                {careers.map((career) => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    isSelected={selectedCareer?.id === career.id}
                    onSelect={handleCareerSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="profiler-main">
            <div className="skill-panel" id="skill-panel">
              {!selectedCareer ? (
                <div className="panel-empty" id="panel-empty">
                  <div className="empty-icon">👈</div>
                  <h3>Select a Career Path</h3>
                  <p>Choose a target career from the left to begin</p>
                </div>
              ) : mode === 'choose' ? (
                /* Mode Selection — Resume or Manual */
                <div className="panel-content animate-fade-in" id="panel-mode-select">
                  <div className="panel-header">
                    <div className="panel-header-info">
                      <div className="panel-header-title-row">
                        <span className="panel-career-icon">
                          {(CAREER_META[selectedCareer.id] || { icon: '💼' }).icon}
                        </span>
                        <h3 id="selected-career-title">{selectedCareer.title}</h3>
                      </div>
                      <span className={`badge ${selectedCareer.demand === 'Very High' ? 'badge-mint' : 'badge-orange'}`}>
                        {selectedCareer.demand} Demand
                      </span>
                    </div>
                    <div className="panel-header-meta">
                      <span>💰 {selectedCareer.avg_salary_inr}</span>
                      <span>📊 {selectedCareer.skill_count} skills</span>
                    </div>
                  </div>
                  <p className="panel-description">{selectedCareer.description}</p>

                  <div className="mode-selection">
                    <h4 className="mode-selection-title">How would you like to assess your skills?</h4>
                    <div className="mode-cards">
                      <button className="mode-card mode-card-resume" onClick={() => setMode('resume')} id="mode-resume-btn">
                        <div className="mode-card-icon">📄</div>
                        <div className="mode-card-badge">
                          <span className="badge badge-mint">AI-Powered</span>
                        </div>
                        <h4>Upload Resume</h4>
                        <p>Upload your resume and let AI detect your skills automatically. We'll analyze gaps and suggest learning paths.</p>
                        <div className="mode-card-features">
                          <span>✓ Auto skill detection</span>
                          <span>✓ AI gap analysis</span>
                          <span>✓ Instant roadmap</span>
                        </div>
                      </button>

                      <button className="mode-card mode-card-manual" onClick={() => setMode('manual')} id="mode-manual-btn">
                        <div className="mode-card-icon">🎚️</div>
                        <div className="mode-card-badge">
                          <span className="badge badge-muted">Self-Assessment</span>
                        </div>
                        <h4>Rate Skills Manually</h4>
                        <p>Rate your proficiency for each skill using interactive sliders. Best for accurate self-assessment.</p>
                        <div className="mode-card-features">
                          <span>✓ Precise control</span>
                          <span>✓ Skill-by-skill rating</span>
                          <span>✓ Detailed analysis</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : mode === 'resume' ? (
                /* Resume Upload Mode */
                <ResumeUpload
                  careerId={selectedCareer.id}
                  careerTitle={selectedCareer.title}
                  onResults={handleResumeResults}
                  onCancel={() => setMode('manual')}
                />
              ) : (
                /* Manual Rating Mode */
                <div className="panel-content animate-fade-in" id="panel-content">
                  <div className="panel-header">
                    <div className="panel-header-info">
                      <div className="panel-header-title-row">
                        <span className="panel-career-icon">
                          {(CAREER_META[selectedCareer.id] || { icon: '💼' }).icon}
                        </span>
                        <h3 id="selected-career-title">{selectedCareer.title}</h3>
                      </div>
                      <span className={`badge ${selectedCareer.demand === 'Very High' ? 'badge-mint' : 'badge-orange'}`}>
                        {selectedCareer.demand} Demand
                      </span>
                    </div>
                    <div className="panel-header-meta">
                      <span>💰 {selectedCareer.avg_salary_inr}</span>
                      <span>📊 {selectedCareer.skill_count} skills</span>
                      <button className="btn btn-ghost" onClick={() => setMode('choose')} style={{ fontSize: '0.75rem' }}>
                        ← Change method
                      </button>
                    </div>
                  </div>
                  <p className="panel-description">{selectedCareer.description}</p>
                  <p className="panel-instruction">
                    Rate your proficiency for each skill below (0 = No knowledge, 100 = Expert)
                  </p>

                  <SkillRatingList
                    careerId={selectedCareer.id}
                    skillValues={skillValues}
                    onSkillChange={handleSkillChange}
                    setSkillValues={setSkillValues}
                  />

                  <div className="panel-footer">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      id="analyze-btn"
                      onClick={handleAnalyze}
                    >
                      <span className="btn-icon">🔍</span>
                      <span>Analyze My Skills</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillRatingList({ careerId, skillValues, onSkillChange, setSkillValues }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCareerSkills(careerId)
      .then((data) => {
        const skillObjects = data.skills.map((name) => ({
          name,
          category: 'Skill',
          importance: 'important',
          proficiency_needed: 70,
        }));
        setSkills(skillObjects);
        const newValues = {};
        data.skills.forEach((name) => {
          newValues[name] = skillValues[name] ?? 0;
        });
        setSkillValues(() => ({ ...newValues }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [careerId]);

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="spinner"></div>
        <p>Loading skills…</p>
      </div>
    );
  }

  return (
    <div className="skills-list" id="skills-list">
      {skills.map((skill, idx) => (
        <div key={skill.name} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
          <SkillSlider
            skill={skill}
            value={skillValues[skill.name] || 0}
            onChange={(val) => onSkillChange(skill.name, val)}
          />
        </div>
      ))}
    </div>
  );
}
