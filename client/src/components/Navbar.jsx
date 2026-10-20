import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal, User as UserIcon, Award, Code, Mail, FileText, Download, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onAdminClick, resumeUrl, portfolioName = "DEVPORTFOLIO", theme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Terminal },
    { name: 'About', href: '#about', icon: UserIcon },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: Code },
    { name: 'Documents', href: '#documents', icon: FileText },
    { name: 'Timeline', href: '#experience', icon: Award },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check current section for active highlighting
      const sections = ['hero', 'about', 'skills', 'projects', 'documents', 'experience', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  const handleDownloadResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert("No active resume uploaded yet. Visit the Admin Dashboard to manage your resumes!");
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#08090d]/85 backdrop-blur-md border-b border-white/5 py-4 shadow-glass' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Branding */}
          <a href="#hero" className="flex items-center gap-2 text-cyber-text group">
            <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center shadow-neon-teal group-hover:rotate-12 transition-transform duration-300">
              <Terminal className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="font-orbitron font-extrabold tracking-widest text-sm md:text-base bg-cyber-gradient bg-clip-text text-transparent group-hover:brightness-110 transition-all">
              {portfolioName}
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`font-orbitron text-xs tracking-wider uppercase transition-colors duration-300 ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-cyber-primary text-glow-teal font-semibold'
                    : 'text-cyber-textMuted hover:text-cyber-text'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons: Resume Manager + Theme Toggle + Admin */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary/30 transition-all duration-300"
              title={theme === 'dark' ? "Activate Light Mode" : "Activate Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadResume}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-cyber-primary/10 border border-white/5 hover:border-cyber-primary/30 text-cyber-text text-xs font-orbitron uppercase tracking-wider transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-gradient hover:opacity-90 text-white dark:text-black text-xs font-orbitron font-bold uppercase tracking-wider shadow-neon-teal transition-all duration-300"
            >
              <span>Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger toggle + Theme toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-cyber-primary hover:bg-white/10"
              title={theme === 'dark' ? "Activate Light Mode" : "Activate Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownloadResume}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-cyber-primary hover:bg-white/10"
              title="Download Resume"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-cyber-textMuted hover:text-cyber-text focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-30 bg-cyber-bg/95 backdrop-blur-lg border-b border-cyber-border flex flex-col p-8 lg:hidden h-[calc(100vh-72px)] overflow-y-auto"
          >
            <div className="absolute inset-0 grid-glow opacity-10 pointer-events-none" />
            <div className="flex flex-col gap-6 my-auto">
              {navLinks.map((link, idx) => {
                const IconComponent = link.icon;
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`flex items-center gap-4 py-2 border-b border-white/5 font-orbitron text-base tracking-widest uppercase transition-colors ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-cyber-primary font-bold'
                        : 'text-cyber-textMuted hover:text-cyber-text'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-cyber-accent" />
                    <span>{link.name}</span>
                  </motion.a>
                );
              })}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 mt-8"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAdminClick();
                  }}
                  className="w-full py-3 rounded-lg bg-cyber-gradient text-white dark:text-black font-orbitron font-extrabold uppercase tracking-widest shadow-neon-teal text-center block text-sm"
                >
                  ADMIN SYSTEM CONSOLE
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
