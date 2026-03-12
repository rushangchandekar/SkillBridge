import { useState, useEffect } from 'react';
import { fetchHistory, deleteHistoryItem } from '../utils/api';
import './HistoryPage.css';

export default function HistoryPage({ onViewResults, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchHistory();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete history item');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="history-page-loading">
        <div className="spinner"></div>
        <p>Retrieving your history...</p>
      </div>
    );
  }

  return (
    <div className="history-page animate-fade-in" id="history-page">
      <div className="section-container">
        <div className="history-header">
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back to Home
          </button>
          <h2 className="section-title">Analysis History</h2>
          <p className="section-subtitle">Revisit your previous skill gaps and career roadmaps</p>
        </div>

        {error ? (
          <div className="history-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={loadHistory}>Retry</button>
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon">📂</div>
            <h3>No History Found</h3>
            <p>You haven't performed any skill analyses yet.</p>
            <button className="btn btn-primary" onClick={onBack}>Start New Analysis</button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="history-card active-interactive" 
                onClick={() => onViewResults(item.results)}
              >
                <div className="history-card-header">
                  <div className="history-career-title">
                    <h4>{item.career_title}</h4>
                    <span className="history-date">{formatDate(item.timestamp)}</span>
                  </div>
                  <div className="history-score-badge">
                    <span className="score-value">{Math.round(item.match_percentage)}%</span>
                    <span className="score-label">Match</span>
                  </div>
                </div>
                
                <div className="history-card-body">
                  <div className="history-meta">
                    <div className="meta-item">
                      <span className="meta-icon">🔑</span>
                      <span>{item.results.analysis.missing_skills.length} gaps identified</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🗺️</span>
                      <span>{item.results.roadmap.length} learning phases</span>
                    </div>
                  </div>
                </div>

                <div className="history-card-footer">
                  <button className="btn btn-ghost btn-sm" onClick={(e) => handleDelete(e, item.id)}>
                    <span className="btn-icon">🗑️</span>
                    Delete
                  </button>
                  <button className="btn btn-primary btn-sm">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
