import { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, X, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom high-performance brand SVG component
const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Projects = ({ projects = [], apiBaseUrl = 'http://localhost:5000' }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [screenshotIdx, setScreenshotIdx] = useState(0);

  const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Cloud & DevOps', 'Full Stack'];

  const projectList = Array.isArray(projects) ? projects : [];

  const filteredProjects = activeFilter === 'All'
    ? projectList
    : projectList.filter(p => p.category?.toLowerCase().replace('&', 'and') === activeFilter.toLowerCase().replace('&', 'and') || p.category === activeFilter);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${apiBaseUrl}${path}`;
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setScreenshotIdx(0);
  };

  const handleNextScreenshot = (screenshots) => {
    setScreenshotIdx(prev => (prev + 1) % screenshots.length);
  };

  const handlePrevScreenshot = (screenshots) => {
    setScreenshotIdx(prev => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Background backing blur */}
      <div className="absolute right-1/4 top-1/3 w-96 h-96 rounded-full bg-cyber-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">Project Artifacts</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      {/* Filters menu */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-full font-orbitron text-[10px] uppercase tracking-widest border transition-all duration-300 ${
              activeFilter === cat
                ? 'bg-cyber-gradient text-black font-bold border-transparent shadow-neon-teal'
                : 'bg-white/5 border-white/5 text-cyber-textMuted hover:text-cyber-text hover:bg-white/10 hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={project._id || project.id}
              onClick={() => handleOpenModal(project)}
              className="glass-panel rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-cyber-primary/30 transition-all duration-300 relative"
            >
              {/* Primary Image Cover */}
              <div className="h-48 w-full overflow-hidden relative border-b border-white/5">
                <div className="absolute inset-0 bg-[#08090d]/30 group-hover:bg-transparent z-10 transition-colors duration-300" />
                <img
                  src={getImageUrl(project.primaryImage)}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-orbitron tracking-widest text-cyber-primary border border-cyber-primary/35 uppercase">
                  {project.category}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-base md:text-lg font-orbitron font-bold text-cyber-text group-hover:text-cyber-primary transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-xs text-cyber-textMuted leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies?.slice(0, 3).map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-cyber-primary/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-cyber-textMuted">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl p-8 max-w-md mx-auto border border-white/5">
          <p className="text-cyber-textMuted font-mono text-sm uppercase tracking-wider">No dynamic projects found in this repository.</p>
        </div>
      )}

      {/* Modern Detailed Modal Backdrop overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-4xl bg-[#0a0b10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Corner tech accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyber-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyber-primary" />

              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cyber-textMuted hover:text-cyber-text border border-white/5 z-20 transition-all focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto flex-1">
                {/* Carousel Screenshots Section */}
                {selectedProject.screenshots && selectedProject.screenshots.length > 0 ? (
                  <div className="h-64 md:h-96 w-full bg-black relative flex items-center justify-center border-b border-white/5">
                    <img
                      src={getImageUrl(selectedProject.screenshots[screenshotIdx])}
                      alt={`Screenshot ${screenshotIdx + 1}`}
                      className="w-full h-full object-contain"
                    />

                    {selectedProject.screenshots.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevScreenshot(selectedProject.screenshots)}
                          className="absolute left-4 p-2 rounded-full bg-black/60 border border-white/10 text-cyber-text hover:bg-cyber-primary hover:text-black z-10 transition-all focus:outline-none"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleNextScreenshot(selectedProject.screenshots)}
                          className="absolute right-4 p-2 rounded-full bg-black/60 border border-white/10 text-cyber-text hover:bg-cyber-primary hover:text-black z-10 transition-all focus:outline-none"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {selectedProject.screenshots.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setScreenshotIdx(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                screenshotIdx === idx ? 'bg-cyber-primary w-4' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-48 md:h-72 w-full overflow-hidden border-b border-white/5">
                    <img
                      src={getImageUrl(selectedProject.primaryImage)}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Metadata Specs */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <span className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-cyber-primary mb-1 block">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold text-cyber-text">
                        {selectedProject.title}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-orbitron font-bold uppercase tracking-widest text-cyber-textMuted border-b border-white/5 pb-2">
                        System Overview
                      </h4>
                      <p className="text-sm text-cyber-textMuted leading-relaxed font-light">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Integrated Documentation PDF View */}
                    {selectedProject.docFile && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="text-xs font-orbitron font-bold uppercase tracking-widest text-cyber-primary flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>PDF Product Documentation</span>
                        </h4>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="text-xs text-cyber-textMuted font-mono">
                            Technical specification ledger.pdf
                          </span>
                          <a
                            href={getImageUrl(selectedProject.docFile)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary font-orbitron font-bold text-[10px] uppercase tracking-wider hover:bg-cyber-primary hover:text-black transition-all duration-300"
                          >
                            Read / Open PDF
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Specifications Grid Details */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <h4 className="text-xs font-orbitron font-bold uppercase tracking-widest text-cyber-textMuted border-b border-white/5 pb-2">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies?.map((tech, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0a0b10] border border-white/5 text-[10px] font-mono text-cyber-primary/90"
                          >
                            <CheckCircle2 className="w-3 h-3 text-cyber-glow" />
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-3">
                      {selectedProject.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyber-text font-orbitron text-xs font-bold uppercase tracking-widest transition-all duration-300"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code Repository</span>
                        </a>
                      )}
                      {selectedProject.liveLink && (
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-gradient text-black font-orbitron text-xs font-extrabold uppercase tracking-widest shadow-neon-teal hover:opacity-95 transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Launch Live Simulator</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
