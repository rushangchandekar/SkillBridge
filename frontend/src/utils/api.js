/**
 * API utility for SkillBridge backend communication
 * Uses Vite proxy — all /api requests forwarded to Flask backend
 */

const API_BASE = '/api';

export async function fetchCareers() {
  const res = await fetch(`${API_BASE}/careers`);
  if (!res.ok) throw new Error('Failed to fetch careers');
  return res.json();
}

export async function fetchCareerSkills(careerId) {
  const res = await fetch(`${API_BASE}/careers/${careerId}/skills`);
  if (!res.ok) throw new Error('Failed to fetch career skills');
  return res.json();
}

export async function analyzeSkills(careerId, skills) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ career_id: careerId, skills }),
  });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}

export async function fetchAllSkills() {
  const res = await fetch(`${API_BASE}/all-skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function analyzeResume(careerId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('career_id', careerId);

  const res = await fetch(`${API_BASE}/analyze-resume`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Resume analysis failed' }));
    throw new Error(err.error || 'Resume analysis failed');
  }
  return res.json();
}
