# ⚡ SkillBridge — AI Skill Gap Analyzer for Employability

An AI-powered platform that compares a student's skills against industry job requirements and generates a personalized learning roadmap — built for hackathon-scale deployment.

## 🎯 Problem Statement

> Students often don't know which skills they lack for their desired careers.

Only **42.6%** of Indian graduates are employable (India's Graduate Skill Index 2024). The gap between academic education and industry demands is growing. SkillBridge bridges this gap with AI-driven analysis.

## 🧩 Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Student Skill Profiling** | Interactive career selection + skill self-assessment with proficiency sliders |
| 2 | **Industry Job Skill Database** | 10 career paths × 12 skills each = 120+ tracked skills with importance weights |
| 3 | **AI Skill Gap Detection** | Weighted matching algorithm comparing user skills vs. industry requirements |
| 4 | **Personalized Learning Recommendations** | Phased learning roadmap with 50+ curated resources (MDN, Coursera, freeCodeCamp, etc.) |
| 5 | **Career Progress Dashboard** | Match score ring, gap visualization, and AI-generated career insights |

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip

### Installation

```bash
# Clone and navigate to the project
cd Raisoni

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your Gemini API key for AI-powered insights
# Copy .env.example to .env and add your key
copy .env.example .env

# Run the server
python app.py
```

Open **http://localhost:5000** in your browser.

### With Gemini AI (Optional)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a `.env` file: `GEMINI_API_KEY=your_key_here`
3. Restart the server — AI insights will now be personalized by Gemini

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (No framework needed) |
| **Backend** | Python Flask |
| **AI Engine** | Google Gemini API (optional), Built-in fallback engine |
| **Database** | JSON-based skill database (no DB setup required) |
| **Design** | Glassmorphic dark-mode UI, CSS custom properties |

## 📁 Project Structure

```
Raisoni/
├── app.py                  # Flask backend server
├── requirements.txt        # Python dependencies
├── .env.example            # Environment config template
├── data/
│   └── job_skills.json     # Industry job skills database (10 careers, 120+ skills)
├── static/
│   ├── index.html          # Main SPA page
│   ├── css/
│   │   └── style.css       # Complete design system
│   └── js/
│       └── app.js          # Frontend application logic
└── README.md
```

## 📊 Supported Career Paths

- 🎨 Frontend Developer
- ⚙️ Backend Developer
- 📊 Data Scientist
- 🤖 ML Engineer
- 🌐 Full Stack Developer
- 🔧 DevOps Engineer
- ✏️ UI/UX Designer
- 🔒 Cybersecurity Analyst
- 📱 Mobile App Developer
- ☁️ Cloud Solutions Architect

## 👥 Team

Built for Hackathon 2026 — G.H. Raisoni College of Engineering
