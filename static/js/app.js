/**
 * SkillBridge — AI Skill Gap Analyzer
 * Main Application JavaScript
 */

// ============================================================
// CONFIG & STATE
// ============================================================
const API_BASE = '';  // Same origin
const STATE = {
    careers: [],
    selectedCareer: null,
    userSkills: {},            // { skillName: proficiency }
    analysisResult: null,
};

// Career emoji mapping
const CAREER_EMOJIS = {
    frontend_developer: '🎨',
    backend_developer: '⚙️',
    data_scientist: '📊',
    ml_engineer: '🤖',
    fullstack_developer: '🌐',
    devops_engineer: '🔧',
    ui_ux_designer: '✏️',
    cybersecurity_analyst: '🔒',
    mobile_developer: '📱',
    cloud_architect: '☁️',
};

// ============================================================
// DOM HELPERS
// ============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCounters();
    loadCareers();
    initTabs();
    initBackButton();
});

// ============================================================
// NAVBAR
// ============================================================
function initNavbar() {
    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Smooth nav links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
}

function animateCounters() {
    $$('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 30);
    });
}

// ============================================================
// LOAD CAREERS
// ============================================================
async function loadCareers() {
    try {
        const res = await fetch(`${API_BASE}/api/careers`);
        const data = await res.json();
        STATE.careers = data;
        renderCareerGrid(data);
    } catch (err) {
        console.error('Failed to load careers:', err);
        $('#career-grid').innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--text-secondary);">
                <p>Unable to connect to server.</p>
                <p style="font-size:0.8rem;margin-top:8px;">Make sure the Flask server is running on port 5000.</p>
            </div>`;
    }
}

function renderCareerGrid(careers) {
    const grid = $('#career-grid');
    grid.innerHTML = '';

    careers.forEach(career => {
        const el = document.createElement('div');
        el.className = 'career-option';
        el.dataset.careerId = career.id;

        const demandClass = career.demand === 'Very High' ? 'very-high' : 'high';

        el.innerHTML = `
            <div class="career-emoji">${CAREER_EMOJIS[career.id] || '💼'}</div>
            <div class="career-info">
                <div class="career-name">${career.title}</div>
                <div class="career-meta">${career.skill_count} skills · ${career.avg_salary_inr}</div>
            </div>
            <span class="career-demand-badge ${demandClass}">${career.demand}</span>
        `;

        el.addEventListener('click', () => selectCareer(career));
        grid.appendChild(el);
    });
}

// ============================================================
// SELECT CAREER & BUILD SKILL FORM
// ============================================================
async function selectCareer(career) {
    STATE.selectedCareer = career;
    STATE.userSkills = {};

    // Update UI highlights
    $$('.career-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.career-option[data-career-id="${career.id}"]`)?.classList.add('selected');

    // Show the skill panel
    $('#panel-empty').style.display = 'none';
    $('#panel-content').style.display = 'block';
    $('#selected-career-title').textContent = career.title;
    $('#selected-career-demand').textContent = career.demand + ' Demand';
    $('#selected-career-salary').textContent = '💰 ' + career.avg_salary_inr;
    $('#selected-career-desc').textContent = career.description + ' — Rate your proficiency for each skill below.';

    // Fetch required skills
    try {
        const res = await fetch(`${API_BASE}/api/careers/${career.id}/skills`);
        const data = await res.json();
        renderSkillSliders(data.skills, career);
    } catch (err) {
        console.error('Failed to load skills:', err);
    }

    // Attach analyze listener
    const btn = $('#analyze-btn');
    btn.onclick = () => analyzeSkills();
}

function renderSkillSliders(skillNames, career) {
    const list = $('#skills-list');
    list.innerHTML = '';

    // Find detailed skill info from career data in the full list
    const careerData = STATE.careers.find(c => c.id === career.id);

    skillNames.forEach(skillName => {
        // Try to find importance from the job_skills data
        const importance = getSkillImportance(career.id, skillName);

        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-header">
                <span class="skill-name">${skillName}</span>
                <span class="skill-importance ${importance}">${importance.replace('-', ' ')}</span>
            </div>
            <div class="skill-slider-row">
                <input type="range" class="skill-slider" min="0" max="100" value="0"
                       data-skill="${skillName}" aria-label="${skillName} proficiency">
                <span class="skill-value">0%</span>
            </div>
        `;

        const slider = item.querySelector('.skill-slider');
        const valueDisplay = item.querySelector('.skill-value');

        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            valueDisplay.textContent = val + '%';
            STATE.userSkills[skillName] = val;

            // Color coding for the value text
            if (val >= 70) valueDisplay.style.color = 'var(--success)';
            else if (val >= 40) valueDisplay.style.color = 'var(--warning)';
            else if (val > 0) valueDisplay.style.color = 'var(--danger)';
            else valueDisplay.style.color = 'var(--accent-2)';
        });

        list.appendChild(item);
    });
}

// Map skill importance (we get this from the original job data loaded on the server)
// For client side we do a simple heuristic based on position
function getSkillImportance(careerId, skillName) {
    // We'll request this from the frontend's cached data
    // For now, use a simple mapping
    const mapping = getImportanceMapping();
    return mapping[skillName] || 'important';
}

function getImportanceMapping() {
    // This is populated after analysis from the server response
    return STATE._importanceMap || {};
}

// ============================================================
// ANALYZE SKILLS
// ============================================================
async function analyzeSkills() {
    if (!STATE.selectedCareer) return;

    const skills = Object.entries(STATE.userSkills).map(([name, proficiency]) => ({
        name,
        proficiency
    }));

    // Show loading overlay
    $('#loading-overlay').style.display = 'flex';

    try {
        const res = await fetch(`${API_BASE}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                career_id: STATE.selectedCareer.id,
                skills
            })
        });

        const data = await res.json();
        STATE.analysisResult = data;

        // Build importance mapping for future use
        STATE._importanceMap = {};
        [...(data.analysis.matched_skills || []),
         ...(data.analysis.partial_skills || []),
         ...(data.analysis.missing_skills || [])].forEach(s => {
            STATE._importanceMap[s.name] = s.importance;
        });

        renderDashboard(data);
    } catch (err) {
        console.error('Analysis failed:', err);
        alert('Analysis failed. Make sure the server is running.');
    } finally {
        $('#loading-overlay').style.display = 'none';
    }
}

// ============================================================
// RENDER DASHBOARD
// ============================================================
function renderDashboard(data) {
    const { analysis, roadmap, insights } = data;

    // Show dashboard, hide profiler
    $('#profiler').style.display = 'none';
    const heroSection = $('#hero');
    if (heroSection) heroSection.style.display = 'none';
    const howSection = $('#how-it-works');
    if (howSection) howSection.style.display = 'none';
    $('#dashboard').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update subtitle
    $('#dashboard-subtitle').textContent =
        `Analysis for: ${analysis.career.title} — ${analysis.career.category}`;

    // Overview cards
    animateMatchRing(analysis.match_percentage);
    animateCountTo($('#matched-count'), analysis.matched_count);
    animateCountTo($('#partial-count'), analysis.partial_count);
    animateCountTo($('#missing-count'), analysis.missing_count);

    // Gap analysis tab
    renderGapList('gap-missing-list', analysis.missing_skills, 'missing');
    renderGapList('gap-partial-list', analysis.partial_skills, 'partial');
    renderGapList('gap-matched-list', analysis.matched_skills, 'matched');

    // Toggle section visibility
    toggleSection('gap-missing-section', analysis.missing_skills.length > 0);
    toggleSection('gap-partial-section', analysis.partial_skills.length > 0);
    toggleSection('gap-matched-section', analysis.matched_skills.length > 0);

    // Roadmap tab
    renderRoadmap(roadmap);

    // Insights tab
    renderInsights(insights);

    // Activate gap tab by default
    activateTab('gap-tab');
}

function toggleSection(id, visible) {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? 'block' : 'none';
}

function animateMatchRing(pct) {
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (pct / 100) * circumference;
    const ring = $('#match-ring-fill');
    const label = $('#match-pct');

    // Animate
    setTimeout(() => {
        ring.style.transition = 'stroke-dashoffset 1.5s ease';
        ring.style.strokeDashoffset = offset;
    }, 100);

    // Count up the percentage
    let current = 0;
    const step = Math.max(1, Math.floor(pct / 50));
    const interval = setInterval(() => {
        current += step;
        if (current >= pct) {
            current = pct;
            clearInterval(interval);
        }
        label.textContent = current + '%';
    }, 30);
}

function animateCountTo(el, target) {
    let current = 0;
    const interval = setInterval(() => {
        current++;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current;
    }, 60);
}

function renderGapList(containerId, skills, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    skills.forEach(skill => {
        const userP = skill.user_proficiency;
        const reqP = skill.required_proficiency;

        let barColor;
        if (type === 'matched') barColor = 'var(--success)';
        else if (type === 'partial') barColor = 'var(--warning)';
        else barColor = 'var(--danger)';

        let resourcesHTML = '';
        if (skill.resources && skill.resources.length > 0) {
            resourcesHTML = `<div class="gap-resources">
                ${skill.resources.map(r =>
                    `<a href="${r.url}" target="_blank" rel="noopener" class="gap-resource-link">📚 ${r.title} (${r.duration || r.type})</a>`
                ).join('')}
            </div>`;
        }

        const item = document.createElement('div');
        item.className = 'gap-item';
        item.innerHTML = `
            <div class="gap-item-header">
                <span class="gap-item-name">${skill.name}</span>
                <div class="gap-item-badges">
                    <span class="skill-importance ${skill.importance}">${skill.importance.replace('-', ' ')}</span>
                </div>
            </div>
            <div class="gap-bar-container">
                <div class="gap-bar-track">
                    <div class="gap-bar-user" style="width:${userP}%;background:${barColor};"></div>
                    <div class="gap-bar-required" style="left:${reqP}%;" title="Required: ${reqP}%"></div>
                </div>
                <div class="gap-bar-labels">${userP}% / ${reqP}%</div>
            </div>
            ${resourcesHTML}
        `;
        container.appendChild(item);
    });
}

function renderRoadmap(phases) {
    const timeline = $('#roadmap-timeline');
    timeline.innerHTML = '';

    if (!phases || phases.length === 0) {
        timeline.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">🎉 No gaps detected! You\'re well-prepared for this career.</p>';
        return;
    }

    phases.forEach((phase, idx) => {
        const phaseEl = document.createElement('div');
        phaseEl.className = 'roadmap-phase';
        phaseEl.style.animationDelay = `${idx * 0.15}s`;

        const skillCards = phase.skills.map(skill => {
            const resourceLinks = (skill.resources || []).map(r =>
                `<a href="${r.url}" target="_blank" rel="noopener">📖 ${r.title}</a>`
            ).join('');

            return `
                <div class="phase-skill-card">
                    <div class="phase-skill-name">${skill.name}</div>
                    <div class="phase-skill-gap">Gap: ${skill.gap}% (You: ${skill.user_proficiency}% → Need: ${skill.required_proficiency}%)</div>
                    <div class="phase-skill-resources">${resourceLinks}</div>
                </div>
            `;
        }).join('');

        phaseEl.innerHTML = `
            <div class="phase-header">
                <span class="phase-number">Phase ${phase.phase}</span>
                <span class="phase-name">${phase.name}</span>
                <span class="phase-duration">⏱ ${phase.estimated_duration}</span>
            </div>
            <p class="phase-description">${phase.description}</p>
            <div class="phase-skills">${skillCards}</div>
        `;

        timeline.appendChild(phaseEl);
    });
}

function renderInsights(insightsText) {
    const container = $('#insights-content');

    if (!insightsText) {
        container.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:40px;">No insights available.</p>';
        return;
    }

    // Convert markdown-like text to HTML
    let html = insightsText
        // Headers
        .replace(/###\s+(.+)/g, '<h3>$1</h3>')
        .replace(/##\s+(.+)/g, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Unordered lists
        .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        // Wrap consecutive <li> in <ul>
        .replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    container.innerHTML = `<div class="insights-body"><p>${html}</p></div>`;
}

// ============================================================
// TABS
// ============================================================
function initTabs() {
    $$('.dash-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.dataset.tab);
        });
    });
}

function activateTab(tabId) {
    $$('.dash-tab').forEach(t => t.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));

    const tab = document.querySelector(`.dash-tab[data-tab="${tabId}"]`);
    const panel = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    if (panel) panel.classList.add('active');
}

// ============================================================
// BACK BUTTON
// ============================================================
function initBackButton() {
    const btn = $('#back-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            $('#dashboard').style.display = 'none';
            $('#profiler').style.display = 'block';
            const heroSection = $('#hero');
            if (heroSection) heroSection.style.display = 'flex';
            const howSection = $('#how-it-works');
            if (howSection) howSection.style.display = 'block';

            // Reset match ring
            const ring = $('#match-ring-fill');
            if (ring) {
                ring.style.transition = 'none';
                ring.style.strokeDashoffset = '339.29';
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
