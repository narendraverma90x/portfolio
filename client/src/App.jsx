import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Documents from './components/Documents';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Admin from './pages/Admin';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import api from './utils/api';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const [activePage, setActivePage] = useState('portfolio'); // 'portfolio' | 'admin'
  const [appLoading, setAppLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [portfolioMeta, setPortfolioMeta] = useState(null);
  
  // Theme Management (defaults to dark cyber aesthetic)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const API_SERVER_URL = import.meta.env.VITE_API_SERVER || 'http://localhost:5000';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [projRes, docRes, metaRes] = await Promise.all([
        api.get('/projects'),
        api.get('/documents'),
        api.get('/portfolio')
      ]);

      if (projRes.data.success) setProjects(projRes.data.projects);
      if (docRes.data.success) setDocuments(docRes.data.documents);
      if (metaRes.data.success) setPortfolioMeta(metaRes.data.data);
    } catch (err) {
      console.error('Failed to load portfolio initial data:', err.message);
    }
  };

  const docList = Array.isArray(documents) ? documents : [];
  const activeResumeUrl = docList.find(d => d.category === 'Resume')?.fileUrl 
    ? (docList.find(d => d.category === 'Resume').fileUrl.startsWith('http') 
        ? docList.find(d => d.category === 'Resume').fileUrl 
        : `${API_SERVER_URL}${docList.find(d => d.category === 'Resume').fileUrl}`)
    : '';

  return (
    <>
      {/* Interactive Cyber Constellation Background Grid */}
      <ParticleBackground />

      {/* Futuristic soft lag outline custom cursor */}
      <CustomCursor />

      {/* Cyber System Init Loading screen */}
      <AnimatePresence>
        {appLoading && (
          <LoadingScreen onComplete={() => setAppLoading(false)} />
        )}
      </AnimatePresence>

      {!appLoading && (
        <div className="relative min-h-screen z-10 selection:bg-cyber-primary selection:text-black">
          {activePage === 'portfolio' ? (
            <>
              {/* Sticky Navigation Glass Header */}
              <Navbar 
                portfolioName="NARENDRA.DEV" 
                resumeUrl={activeResumeUrl}
                onAdminClick={() => setActivePage('admin')} 
                theme={theme}
                onToggleTheme={toggleTheme}
              />

              {/* Sections Grid */}
              <main className="space-y-4">
                <Hero 
                  name="Narendra Verma"
                  resumeUrl={activeResumeUrl}
                />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                  <About aboutContent={portfolioMeta?.about} />
                  <Skills skillsContent={portfolioMeta?.skills} />
                  <Projects projects={projects} apiBaseUrl={API_SERVER_URL} />
                  <Documents documents={documents} apiBaseUrl={API_SERVER_URL} />
                  <Experience experienceContent={portfolioMeta?.experience} />
                  <Contact />
                </div>
              </main>

              {/* Footer */}
              <footer className="py-12 border-t border-white/5 bg-black/40 text-center font-mono text-xs text-cyber-textMuted mt-20 relative">
                <div className="absolute inset-0 grid-glow opacity-5 pointer-events-none" />
                <p className="tracking-widest uppercase">
                  &lt; designed by antigravity &amp; compiled by devstudent /&gt;
                </p>
                <p className="text-[10px] text-cyber-primary/60 mt-2 tracking-widest font-sans font-bold">
                  ⚡ SECURE SYSTEM ACTIVE © 2026
                </p>
              </footer>
            </>
          ) : (
            /* Secure Administrative panel dashboard console */
            <Admin 
              onBackToPortfolio={() => setActivePage('portfolio')}
              onContentUpdate={fetchInitialData}
              onProjectsChange={setProjects}
              onDocumentsChange={setDocuments}
              initialProjects={projects}
              initialDocuments={documents}
              apiBaseUrl={API_SERVER_URL}
            />
          )}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
