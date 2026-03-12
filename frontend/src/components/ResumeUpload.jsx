import { useState, useRef } from 'react';
import './ResumeUpload.css';

export default function ResumeUpload({ careerId, careerTitle, onResults, onCancel }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const inputRef = useRef(null);

  const acceptedTypes = ['.pdf', '.docx', '.txt'];
  const maxSizeMB = 10;

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(ext)) {
      return `Unsupported format: ${ext}. Please upload PDF, DOCX, or TXT.`;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      return `File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Max: ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFile = (f) => {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !careerId) return;

    setUploading(true);
    setError(null);
    setProgress('Uploading resume…');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('career_id', careerId);

      setProgress('Extracting text from resume…');

      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      setProgress('Analyzing skills against industry requirements…');

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(err.error || 'Resume analysis failed');
      }

      const data = await res.json();
      setProgress('Analysis complete!');

      // Small delay to show completion
      setTimeout(() => {
        onResults(data);
      }, 500);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📄';
    if (ext === 'docx') return '📝';
    return '📃';
  };

  return (
    <div className="resume-upload" id="resume-upload">
      <div className="resume-upload-header">
        <div className="resume-header-icon">📋</div>
        <div className="resume-header-text">
          <h3>Resume Analyzer</h3>
          <p>Upload your resume to auto-detect skills and find gaps for <strong>{careerTitle}</strong></p>
        </div>
      </div>

      {!uploading ? (
        <>
          {/* Drop Zone */}
          <div
            className={`resume-dropzone ${dragActive ? 'dropzone-active' : ''} ${file ? 'dropzone-has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleInputChange}
              className="resume-file-input"
              id="resume-file-input"
            />

            {!file ? (
              <div className="dropzone-content">
                <div className="dropzone-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="dropzone-title">
                  {dragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="dropzone-subtitle">or click to browse files</p>
                <div className="dropzone-formats">
                  <span className="format-tag">PDF</span>
                  <span className="format-tag">DOCX</span>
                  <span className="format-tag">TXT</span>
                  <span className="format-size">Max {maxSizeMB}MB</span>
                </div>
              </div>
            ) : (
              <div className="dropzone-file-preview">
                <div className="file-preview-icon">{getFileIcon(file.name)}</div>
                <div className="file-preview-info">
                  <span className="file-preview-name">{file.name}</span>
                  <span className="file-preview-size">{formatFileSize(file.size)}</span>
                </div>
                <button className="file-remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(); }} title="Remove file">
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="resume-error animate-fade-in">
              <span className="resume-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="resume-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleUpload}
              disabled={!file}
              id="resume-analyze-btn"
            >
              <span className="btn-icon">🚀</span>
              <span>Analyze Resume</span>
            </button>
            <button className="btn btn-outline" onClick={onCancel}>
              Rate Skills Manually
            </button>
          </div>

          {/* Info */}
          <div className="resume-info">
            <div className="resume-info-item">
              <span className="info-icon">🔒</span>
              <span>Your resume is processed securely and never stored</span>
            </div>
            <div className="resume-info-item">
              <span className="info-icon">🤖</span>
              <span>AI-powered skill detection with Gemini (if configured)</span>
            </div>
            <div className="resume-info-item">
              <span className="info-icon">📊</span>
              <span>Compares your skills against 120+ industry requirements</span>
            </div>
          </div>
        </>
      ) : (
        /* Upload Progress */
        <div className="resume-progress animate-fade-in">
          <div className="progress-animation">
            <div className="progress-ring">
              <div className="progress-ring-inner">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
          <h4>{progress}</h4>
          <p>This may take a few seconds…</p>
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      )}
    </div>
  );
}
