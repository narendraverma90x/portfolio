import { motion } from 'framer-motion';
import { Shield, Target, Cpu, Award } from 'lucide-react';

const About = ({ aboutContent }) => {
  const intro = aboutContent?.intro || "I am an enthusiastic Software Engineer student passionate about developing cutting-edge AI/ML systems, clean web architectures, and scalable cloud solutions. I thrive in challenging environments and love solving architectural puzzles.";
  const objective = aboutContent?.objective || "To obtain a challenging role as a Software Engineer where I can apply my full-stack expertise, AI/ML skills, and DevOps mindset to build premium, next-generation user experiences.";
  
  const defaultStats = [
    { id: 'projects', label: 'Projects Completed', value: '12+', Icon: Cpu },
    { id: 'certificates', label: 'Certifications', value: '8+', Icon: Award },
    { id: 'experience', label: 'Months Experience', value: '6+', Icon: Shield },
    { id: 'gpa', label: 'Academic GPA', value: '3.9/4.0', Icon: Target }
  ];

  const stats = aboutContent?.stats?.map(s => {
    let Icon = Cpu;
    if (s.id === 'certificates') Icon = Award;
    if (s.id === 'experience') Icon = Shield;
    if (s.id === 'gpa') Icon = Target;
    return { ...s, Icon };
  }) || defaultStats;

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Background glow dot */}
      <div className="absolute right-0 top-1/2 w-80 h-80 rounded-full bg-cyber-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">About Me</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Glassmorphic Profile Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 relative group overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyber-primary/10 blur-[40px] pointer-events-none" />
            
            {/* Custom futuristic image bracket grid overlay */}
            <div className="aspect-square w-full rounded-2xl bg-cyber-bg border border-white/5 relative overflow-hidden flex items-center justify-center p-8">
              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyber-primary/50">SYSTEM: VERIFY_STUDENT</div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyber-accent/50">ACTIVE_NODE_092</div>
              
              <div className="w-36 h-36 rounded-full bg-cyber-gradient flex items-center justify-center shadow-neon-teal group-hover:scale-105 transition-transform duration-500">
                <Cpu className="w-16 h-16 text-black" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <h3 className="font-orbitron font-bold text-lg text-cyber-text">Developer Student</h3>
              <p className="font-mono text-xs text-cyber-primary/80 mt-1">&lt; verification: successful /&gt;</p>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Details + Objectives */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-panel rounded-2xl p-8 relative">
            <h3 className="text-lg font-orbitron font-bold text-cyber-primary mb-4 flex items-center gap-2">
              <span>01.</span> Core Overview
            </h3>
            <p className="text-cyber-textMuted text-sm md:text-base leading-relaxed font-light">
              {intro}
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 relative">
            <h3 className="text-lg font-orbitron font-bold text-cyber-accent mb-4 flex items-center gap-2">
              <span>02.</span> Professional Objective
            </h3>
            <p className="text-cyber-textMuted text-sm md:text-base leading-relaxed font-light italic">
              "{objective}"
            </p>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {stats.map((stat, idx) => {
          const StatIcon = stat.Icon;
          return (
            <div 
              key={idx}
              className="glass-panel rounded-2xl p-6 text-center relative group overflow-hidden border border-white/5 hover:border-cyber-primary/20 transition-all duration-300"
            >
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-cyber-primary/5 blur-[20px]" />
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-cyber-primary mx-auto mb-4 border border-white/5 group-hover:bg-cyber-gradient group-hover:text-black transition-all duration-300">
                <StatIcon className="w-5 h-5" />
              </div>
              <h4 className="text-2xl md:text-3xl font-extrabold font-orbitron text-cyber-text mb-1 group-hover:text-cyber-primary transition-colors">
                {stat.value}
              </h4>
              <p className="text-xs text-cyber-textMuted font-mono uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default About;
