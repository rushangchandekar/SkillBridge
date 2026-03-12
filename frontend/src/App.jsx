import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import Profiler from './pages/Profiler';
import Dashboard from './pages/Dashboard';
import { analyzeSkills } from './utils/api';
import './App.css';

export default function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (section) => {
    if (section === 'dashboard' && !analysisResults) return;
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = () => {
    setCurrentSection('profiler');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (careerId, skills) => {
    setIsLoading(true);
    try {
      const results = await analyzeSkills(careerId, skills);
      setAnalysisResults(results);
      setCurrentSection('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Analysis failed. Please make sure the backend server is running on localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setAnalysisResults(null);
    setCurrentSection('profiler');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeResults = (data) => {
    // Resume analysis returns full results from backend
    setAnalysisResults(data);
    setCurrentSection('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      <main>
        {currentSection === 'hero' && (
          <Hero onStart={handleStartAnalysis} />
        )}
        {currentSection === 'profiler' && (
          <Profiler onAnalyze={handleAnalyze} onResumeResults={handleResumeResults} />
        )}
        {currentSection === 'dashboard' && (
          <Dashboard results={analysisResults} onBack={handleBack} />
        )}
      </main>

      <Footer />
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
