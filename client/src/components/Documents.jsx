import { useState } from 'react';
import { FileText, Search, Download, Eye, Award, GraduationCap, Briefcase, FileSignature, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Documents = ({ documents = [], apiBaseUrl = 'http://localhost:5000' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);

  const categories = ['All', 'Certificate', 'Research Paper', 'Internship', 'Resume'];

  const docList = Array.isArray(documents) ? documents : [];

  const filteredDocs = docList.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${apiBaseUrl}${path}`;
  };

  const getDocIcon = (category) => {
    switch (category) {
      case 'Certificate': return Award;
      case 'Research Paper': return GraduationCap;
      case 'Internship': return Briefcase;
      case 'Resume': return FileSignature;
      default: return FileText;
    }
  };

  const getDocColor = (category) => {
    switch (category) {
      case 'Certificate': return 'text-cyber-glow';
      case 'Research Paper': return 'text-cyber-accent';
      case 'Internship': return 'text-cyber-secondary';
      case 'Resume': return 'text-cyber-primary';
      default: return 'text-cyber-textMuted';
    }
  };

  return (
    <section id="documents" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Glow Lights */}
      <div className="absolute left-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-cyber-accent/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">Verified Documents</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-10 border border-white/5 space-y-8 z-10 relative">
        {/* Search controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Text Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-textMuted" />
            <input
              type="text"
              placeholder="Search documents by keyword title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-cyber-primary/40 text-cyber-text text-sm font-mono focus:outline-none transition-all placeholder:text-cyber-textMuted/50"
            />
          </div>

          {/* Categories Tab pills */}
          <div className="md:col-span-6 flex flex-wrap gap-2 items-center justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg font-orbitron text-[9px] uppercase tracking-widest border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-cyber-gradient text-black font-bold border-transparent shadow-neon-teal'
                    : 'bg-white/5 border-white/5 text-cyber-textMuted hover:text-cyber-text hover:bg-white/10 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc) => {
              const DocIcon = getDocIcon(doc.category);
              const docColorClass = getDocColor(doc.category);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                  key={doc._id || doc.id}
                  className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-cyber-primary/20 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center ${docColorClass}`}>
                      <DocIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <span className={`text-[9px] font-orbitron font-bold uppercase tracking-wider block ${docColorClass}`}>
                        {doc.category}
                      </span>
                      <h4 className="text-sm font-orbitron font-semibold text-cyber-text tracking-wide group-hover:text-cyber-primary transition-colors line-clamp-1">
                        {doc.title}
                      </h4>
                      {doc.description && (
                        <p className="text-[11px] text-cyber-textMuted font-light leading-relaxed line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-cyber-primary/10 border border-white/5 hover:border-cyber-primary/30 text-cyber-text hover:text-cyber-primary text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all duration-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Online</span>
                    </button>
                    <a
                      href={getFileUrl(doc.fileUrl)}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-cyber-accent/15 border border-white/5 hover:border-cyber-accent/30 text-cyber-text hover:text-cyber-accent transition-all duration-300"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-cyber-textMuted/40 mx-auto mb-4" />
            <p className="text-sm text-cyber-textMuted font-mono uppercase tracking-widest">
              No matching verified documents found.
            </p>
          </div>
        )}
      </div>

      {/* Embedded inline PDF Document Modal Viewer */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl h-[85vh] bg-[#0a0b10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyber-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyber-primary" />

              {/* Close controls */}
              <div className="p-4 md:px-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyber-primary" />
                  <div>
                    <h3 className="text-sm font-orbitron font-bold text-cyber-text line-clamp-1">{previewDoc.title}</h3>
                    <p className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-widest">{previewDoc.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-cyber-textMuted hover:text-cyber-text border border-white/5 transition-all focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF Document Viewer Frame */}
              <div className="flex-1 bg-neutral-900 relative">
                <iframe
                  src={getFileUrl(previewDoc.fileUrl)}
                  title={previewDoc.title}
                  className="w-full h-full border-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Documents;
