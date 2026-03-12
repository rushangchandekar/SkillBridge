import './Insights.css';

export default function Insights({ content }) {
  if (!content) {
    return (
      <div className="insights-card">
        <div className="insights-loading">
          <div className="spinner"></div>
          <p>Generating AI insights…</p>
        </div>
      </div>
    );
  }

  // Parse markdown-style content to basic HTML
  const formatContent = (text) => {
    return text
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="insights-card animate-fade-in">
      <div className="insights-header">
        <div className="insights-icon-row">
          <span className="insights-ai-icon">🤖</span>
          <h3>AI Career Insights</h3>
        </div>
        <span className="badge badge-mint">Powered by Gemini</span>
      </div>
      <div
        className="insights-content"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
}
