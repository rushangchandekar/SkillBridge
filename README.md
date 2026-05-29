# ⚡ GAP0 — AI Skill Gap Analyzer for Employability

An AI-powered career analysis platform that bridges the gap between academic capabilities and real-world industry demands. **GAP0** profiles student skills, extracts intelligence from resumes via NLP, detects skill gaps using advanced weighted matching, and generates custom, phased learning roadmaps.

Built with a gorgeous, high-performance glassmorphic user interface and robust micro-animations.

---

## 🎯 The Core Problem

> **Only 42.6% of Indian graduates are employable** *(Graduate Skill Index 2024)*.

Traditional academic degrees often leave students unaware of the specific, rapidly evolving technology stacks demanded by modern industry. **GAP0** solves this by providing immediate, precise alignment metrics and personal, actionable study routes.

---

## 🚀 Key Modules & Features

1. **Student Skill Profiling**: Dynamic career-path selector (10 paths) combined with intuitive capability sliders.
2. **AI Resume Parser**: Direct parsing of PDF and DOCX files using Gemini NLP to extract semantic skillset matrices.
3. **High-Precision Gap Analytics**: Custom mathematical matching comparing user capabilities against real industry weights.
4. **Interactive Dashboard**: Match score visualization, modular radar charts, and AI-driven growth insights.
5. **Personalized Learning Roadmaps**: Actionable, phased learning schedules populated with 50+ curated resources.
6. **Career History Log**: Local secure persistence allowing students to track their growth curves over time.

---

## 🛠️ Advanced Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend UI** | **React 19 + Vite** | Ultra-responsive cinematic layout, vanilla HSL CSS design system, and custom rotating concentric sparkle animations. |
| **Backend API** | **Python Flask** | Restful service layer managing file ingestion, database routing, and semantic AI queries. |
| **AI Ingestion** | **Google Gemini AI API** | Generative Reasoning Engine reading resumes and outputting structured JSON analyses. |
| **Persistence** | **SQLite3** | Lightweight local database storing audit trials and analytical history. |

---

## 📁 Repository Structure

```
Gap0/
├── backend/
│   ├── main.py             # Flask REST API server
│   ├── database.py         # SQLite persistence configurations
│   ├── requirements.txt    # Production Python libraries
│   └── Procfile            # Deployment script for web servers
├── frontend/
│   ├── src/
│   │   ├── components/     # UI elements (Hero, Navbar, ResumeUpload)
│   │   ├── pages/          # Full layouts (Dashboard, Profiler, History)
│   │   └── utils/          # Client API fetch wrappers
│   ├── package.json        # Frontend NPM configurations
│   ├── vercel.json         # Vercel Production Reverse Proxy Config
│   └── vite.config.js      # Dev proxy configurations
└── README.md
```

---

## 💻 Quick Start & Running Locally

### 1. Fire Up the Flask Backend
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your API key in a .env file
# GEMINI_API_KEY=your_gemini_api_key_here

# Run the Flask development server
python main.py
```
*Backend runs on `http://localhost:5000`*

### 2. Start the React Frontend
```bash
# Navigate to the frontend folder
cd ../frontend

# Install dependencies
npm install

# Run the development compiler
npm run dev
```
*Frontend compiled live at `http://localhost:5173`*

---

## 👥 Authors & Team
Built with ❤️ for **Hackathon 2026** — G.H. Raisoni College of Engineering.
