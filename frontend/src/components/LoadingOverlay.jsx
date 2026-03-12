export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
          <div className="loading-icon">🔍</div>
        </div>
        <h3>Analyzing Your Skills</h3>
        <p>Comparing against industry requirements…</p>
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
}
