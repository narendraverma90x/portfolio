import { useState, useEffect } from 'react';
import { Mail, ArrowDown, FileDown, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom high-performance brand SVG components
const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Hero = ({ adminLoggedIn, onResumeUpload, resumeUrl, name = "Narendra Verma" }) => {
  const [typedRole, setTypedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    "Software Engineer",
    "AI/ML Developer",
    "Cloud & DevOps Learner",
    "Full Stack Developer"
  ];

  const typingSpeed = isDeleting ? 40 : 100;
  const holdDelay = 1800; // Hold role in viewport

  useEffect(() => {
    let timer;
    const currentRole = roles[roleIndex];

    if (!isDeleting && charIndex < currentRole.length) {
      // Typing characters
      timer = setTimeout(() => {
        setTypedRole(prev => prev + currentRole.charAt(charIndex));
        setCharIndex(prev => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Deleting characters
      timer = setTimeout(() => {
        setTypedRole(prev => prev.substring(0, prev.length - 1));
        setCharIndex(prev => prev - 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing, hold
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, holdDelay);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, shift role
      setIsDeleting(false);
      setRoleIndex(prev => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  const handleDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert("No active resume uploaded. Access the system console to upload your PDF resume!");
    }
  };

  const handleLocalFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onResumeUpload) {
      onResumeUpload(file);
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-20 overflow-hidden"
    >
      {/* Glow Ambient backing lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyber-primary/10 blur-[130px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyber-accent/15 blur-[130px] animate-pulse-slow pointer-events-none" />

      {/* Main Glassmorphic HUD Console Panel */}
      <div className="w-full max-w-5xl glass-panel rounded-3xl p-8 md:p-16 text-center z-10 relative overflow-hidden flex flex-col items-center">
        {/* Futuristic Grid border elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-primary" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-primary" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-primary" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-primary" />

        {/* Console Header indicator */}
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-cyber-primary uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-cyber-glow animate-ping" />
          <span>System active: developer_student.sh</span>
        </div>

        {/* Hello Text */}
        <h4 className="text-sm md:text-base font-orbitron font-semibold tracking-widest text-cyber-textMuted mb-2">
          HELLO WORLD, I AM
        </h4>

        {/* Prominent Name */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-wider bg-cyber-gradient bg-clip-text text-transparent font-orbitron mb-4 filter drop-shadow-[0_0_12px_rgba(0,242,254,0.15)]">
          {name}
        </h1>

        {/* Dynamic Typing Title */}
        <div className="h-8 md:h-12 flex items-center justify-center mb-8">
          <h2 className="text-lg md:text-3xl font-orbitron font-bold tracking-widest text-cyber-primary">
            <span>&gt; </span>
            <span className="text-glow-teal">{typedRole}</span>
            <span className="animate-ping font-light text-cyber-accent">|</span>
          </h2>
        </div>

        {/* Description intro */}
        <p className="max-w-2xl text-cyber-textMuted text-sm md:text-lg mb-10 leading-relaxed font-light">
          A forward-thinking Software Engineering student constructing hyper-performing modern user experiences, distributed backends, and AI pipelines with absolute architectural elegance.
        </p>

        {/* Resume Operations at Top Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyber-primary/10 border border-cyber-primary/40 hover:border-cyber-primary text-cyber-primary font-orbitron font-bold text-xs uppercase tracking-widest hover:bg-cyber-primary/20 shadow-neon-teal transition-all duration-300"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Resume</span>
          </button>
          
          {adminLoggedIn && (
            <label className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyber-accent/10 border border-cyber-accent/40 hover:border-cyber-accent text-cyber-accent font-orbitron font-bold text-xs uppercase tracking-widest hover:bg-cyber-accent/20 cursor-pointer transition-all duration-300">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleLocalFileChange}
              />
            </label>
          )}
        </div>

        {/* Social connections */}
        <div className="flex items-center gap-6">
          {[
            { Icon: Github, href: "https://github.com", color: "hover:text-cyber-primary hover:border-cyber-primary/30" },
            { Icon: Linkedin, href: "https://linkedin.com", color: "hover:text-cyber-secondary hover:border-cyber-secondary/30" },
            { Icon: Instagram, href: "https://instagram.com", color: "hover:text-cyber-accent hover:border-cyber-accent/30" },
            { Icon: Mail, href: "mailto:your-email@portfolio.dev", color: "hover:text-cyber-primary hover:border-cyber-primary/30" }
          ].map((item, idx) => {
            const SocialIcon = item.Icon;
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-xl bg-white/5 border border-white/5 text-cyber-textMuted transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/10 ${item.color}`}
              >
                <SocialIcon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bounce scroll down indicators */}
      <a 
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('about');
          if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        }}
        className="mt-16 text-cyber-textMuted hover:text-cyber-primary transition-colors duration-300 z-10 flex flex-col items-center gap-2 animate-bounce cursor-pointer"
      >
        <span className="font-orbitron font-semibold text-[10px] uppercase tracking-widest text-glow-teal">Scroll Grid</span>
        <ArrowDown className="w-4 h-4 text-cyber-primary" />
      </a>
    </section>
  );
};

export default Hero;
