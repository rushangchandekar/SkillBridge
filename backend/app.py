"""
SkillBridge - Skill Gap Analyzer for Employability
Flask Backend Server
"""

import os
import json
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# ---------------------------------------------------------------------------
# Load the industry job-skills database once at startup
# ---------------------------------------------------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'job_skills.json')
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    JOB_DATA = json.load(f)

CAREERS = {c['id']: c for c in JOB_DATA['careers']}
LEARNING_RESOURCES = JOB_DATA.get('learning_resources', {})

# ---------------------------------------------------------------------------
# Optional: Google Gemini AI integration
# ---------------------------------------------------------------------------
GEMINI_KEY = os.getenv('GEMINI_API_KEY', '')
genai = None
model = None

if GEMINI_KEY and GEMINI_KEY != 'your_gemini_api_key_here':
    try:
        import google.generativeai as _genai
        _genai.configure(api_key=GEMINI_KEY)
        model = _genai.GenerativeModel('gemini-2.0-flash')
        genai = _genai
        print("[✓] Gemini AI model loaded successfully")
    except Exception as e:
        print(f"[!] Gemini AI initialization failed: {e}")
else:
    print("[i] No Gemini API key found – using built-in analysis engine")


# ========================== HELPER FUNCTIONS ================================

def normalize_skill(name: str) -> str:
    """Lowercase and strip a skill name for comparison."""
    return name.strip().lower()


def compute_gap_analysis(user_skills: list[dict], career_id: str) -> dict:
    """
    Compare user skills against career requirements.
    Returns matched, missing and partially-matched skills with scores.
    """
    career = CAREERS.get(career_id)
    if not career:
        return {"error": "Career not found"}

    required = career['required_skills']

    # Build a lookup from the user's self-reported skills
    user_lookup = {}
    for s in user_skills:
        key = normalize_skill(s.get('name', ''))
        user_lookup[key] = int(s.get('proficiency', 0))

    matched = []
    partial = []
    missing = []
    total_weight = 0
    earned_weight = 0

    importance_weight = {'critical': 3, 'important': 2, 'nice-to-have': 1}

    for req in required:
        req_key = normalize_skill(req['name'])
        weight = importance_weight.get(req['importance'], 1)
        total_weight += weight * req['proficiency_needed']

        user_prof = user_lookup.get(req_key, 0)

        entry = {
            'name': req['name'],
            'category': req['category'],
            'importance': req['importance'],
            'required_proficiency': req['proficiency_needed'],
            'user_proficiency': user_prof,
            'gap': max(0, req['proficiency_needed'] - user_prof),
            'resources': LEARNING_RESOURCES.get(req['name'], [])
        }

        if user_prof >= req['proficiency_needed']:
            entry['status'] = 'matched'
            matched.append(entry)
            earned_weight += weight * req['proficiency_needed']
        elif user_prof > 0:
            entry['status'] = 'partial'
            partial.append(entry)
            earned_weight += weight * user_prof
        else:
            entry['status'] = 'missing'
            missing.append(entry)

    match_pct = round((earned_weight / total_weight) * 100, 1) if total_weight else 0

    # Sort missing/partial by importance weight descending
    imp_order = {'critical': 0, 'important': 1, 'nice-to-have': 2}
    missing.sort(key=lambda x: (imp_order.get(x['importance'], 9), -x['required_proficiency']))
    partial.sort(key=lambda x: (imp_order.get(x['importance'], 9), -x['gap']))

    return {
        'career': {
            'id': career['id'],
            'title': career['title'],
            'category': career['category'],
            'description': career['description'],
            'avg_salary_inr': career['avg_salary_inr'],
            'demand': career['demand']
        },
        'match_percentage': match_pct,
        'total_required_skills': len(required),
        'matched_count': len(matched),
        'partial_count': len(partial),
        'missing_count': len(missing),
        'matched_skills': matched,
        'partial_skills': partial,
        'missing_skills': missing,
    }


def build_roadmap(gap_result: dict) -> list[dict]:
    """
    Build a phased learning roadmap from gap analysis results.
    Phase 1 = Critical missing/partial
    Phase 2 = Important missing/partial
    Phase 3 = Nice-to-have
    """
    phases = []

    # Collect all gap skills
    all_gap = gap_result['missing_skills'] + gap_result['partial_skills']

    phase_map = {
        'critical': {'name': 'Foundation', 'description': 'Master these critical skills first', 'duration': '4-8 weeks', 'skills': []},
        'important': {'name': 'Growth', 'description': 'Build these important skills next', 'duration': '6-10 weeks', 'skills': []},
        'nice-to-have': {'name': 'Edge', 'description': 'These skills give you a competitive advantage', 'duration': '4-6 weeks', 'skills': []},
    }

    for skill in all_gap:
        imp = skill['importance']
        if imp in phase_map:
            phase_map[imp]['skills'].append(skill)

    phase_num = 1
    for imp in ['critical', 'important', 'nice-to-have']:
        p = phase_map[imp]
        if p['skills']:
            phases.append({
                'phase': phase_num,
                'name': p['name'],
                'description': p['description'],
                'estimated_duration': p['duration'],
                'skills': p['skills']
            })
            phase_num += 1

    return phases


def get_ai_insights(user_skills: list[dict], career_title: str, gap_result: dict) -> str:
    """Use Gemini to generate personalised advice (if available)."""
    if not model:
        return generate_fallback_insights(career_title, gap_result)

    missing_names = [s['name'] for s in gap_result['missing_skills']]
    partial_names = [f"{s['name']} ({s['user_proficiency']}%)" for s in gap_result['partial_skills']]
    matched_names = [s['name'] for s in gap_result['matched_skills']]
    user_skill_names = [s.get('name', '') for s in user_skills]

    prompt = f"""You are a career coach AI. A student wants to become a **{career_title}**.

Their current skills: {', '.join(user_skill_names)}
Match percentage: {gap_result['match_percentage']}%

Matched skills: {', '.join(matched_names) if matched_names else 'None'}
Partially matched skills: {', '.join(partial_names) if partial_names else 'None'}
Missing critical skills: {', '.join(missing_names) if missing_names else 'None'}

Please provide:
1. A brief encouraging assessment (2-3 sentences)
2. Top 3 priority actions they should take immediately
3. One specific project idea they can build to practice their missing skills
4. An estimated timeline to become job-ready

Keep the response concise, practical, and motivating. Use markdown formatting. Focus on the Indian job market context."""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini error: {e}")
        return generate_fallback_insights(career_title, gap_result)


def generate_fallback_insights(career_title: str, gap_result: dict) -> str:
    """Generate structured insights without AI."""
    match_pct = gap_result['match_percentage']
    missing = gap_result['missing_skills']
    partial = gap_result['partial_skills']

    if match_pct >= 80:
        assessment = f"Great progress! You're **{match_pct}%** aligned with the {career_title} role. You're almost job-ready — just a few skills to polish."
    elif match_pct >= 50:
        assessment = f"You're on the right track at **{match_pct}%** match for {career_title}. With focused effort on the gaps below, you can be competitive in **3-4 months**."
    else:
        assessment = f"You're at **{match_pct}%** match for {career_title}. Don't worry — this is a great starting point! Follow the roadmap below and you'll see rapid improvement."

    actions = []
    critical_missing = [s for s in missing if s['importance'] == 'critical']
    critical_partial = [s for s in partial if s['importance'] == 'critical']

    priority_skills = (critical_missing + critical_partial)[:3]
    for i, skill in enumerate(priority_skills, 1):
        if skill['resources']:
            res = skill['resources'][0]
            actions.append(f"**{i}. Learn {skill['name']}** — Start with [{res['title']}]({res['url']}) ({res['duration']})")
        else:
            actions.append(f"**{i}. Learn {skill['name']}** — Search for beginner tutorials and practice daily")

    if not actions:
        important_missing = [s for s in missing if s['importance'] == 'important'][:3]
        for i, skill in enumerate(important_missing, 1):
            actions.append(f"**{i}. Improve {skill['name']}** — Focus on hands-on projects and practice")

    actions_text = "\n".join(actions) if actions else "Keep practicing your current skills and start building projects!"

    project = f"Build a portfolio project that combines your strongest skills with {missing[0]['name'] if missing else 'new technologies'} to demonstrate practical ability." if missing else "Build a capstone project showcasing all your skills."

    if match_pct >= 75:
        timeline = "**2-4 weeks** of focused practice to become fully job-ready."
    elif match_pct >= 50:
        timeline = "**2-3 months** of consistent learning (2-3 hours/day) to become competitive."
    elif match_pct >= 25:
        timeline = "**4-6 months** with a structured learning plan to reach interview readiness."
    else:
        timeline = "**6-9 months** of dedicated learning to build a strong foundation."

    return f"""### 📊 Assessment
{assessment}

### 🎯 Priority Actions
{actions_text}

### 💡 Project Idea
{project}

### ⏱️ Estimated Timeline
{timeline}"""


# ============================= API ROUTES ===================================

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')


@app.route('/api/careers', methods=['GET'])
def get_careers():
    """Return all available careers for the dropdown."""
    careers_list = []
    for c in JOB_DATA['careers']:
        careers_list.append({
            'id': c['id'],
            'title': c['title'],
            'category': c['category'],
            'description': c['description'],
            'avg_salary_inr': c['avg_salary_inr'],
            'demand': c['demand'],
            'skill_count': len(c['required_skills'])
        })
    return jsonify(careers_list)


@app.route('/api/careers/<career_id>/skills', methods=['GET'])
def get_career_skills(career_id):
    """Return the required skills for a specific career."""
    career = CAREERS.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404
    return jsonify({
        'career': career['title'],
        'skills': [s['name'] for s in career['required_skills']]
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_skills():
    """
    Main analysis endpoint.
    Expects JSON: { "career_id": "...", "skills": [{"name": "...", "proficiency": 70}, ...] }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    career_id = data.get('career_id')
    user_skills = data.get('skills', [])

    if not career_id:
        return jsonify({"error": "career_id is required"}), 400

    # 1. Gap Analysis
    gap = compute_gap_analysis(user_skills, career_id)
    if 'error' in gap:
        return jsonify(gap), 404

    # 2. Learning Roadmap
    roadmap = build_roadmap(gap)

    # 3. AI Insights
    career_title = gap['career']['title']
    insights = get_ai_insights(user_skills, career_title, gap)

    return jsonify({
        'analysis': gap,
        'roadmap': roadmap,
        'insights': insights
    })


@app.route('/api/all-skills', methods=['GET'])
def get_all_skills():
    """Return a unique list of all skills across all careers."""
    skills_set = set()
    for career in JOB_DATA['careers']:
        for skill in career['required_skills']:
            skills_set.add(skill['name'])
    return jsonify(sorted(list(skills_set)))


# ============================================================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
