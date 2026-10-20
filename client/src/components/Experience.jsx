import { Award, Briefcase, Calendar, Star } from 'lucide-react';

const Experience = ({ experienceContent }) => {
  const items = Array.isArray(experienceContent) ? experienceContent : [];

  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-5xl mx-auto relative">
      {/* Background glow dot */}
      <div className="absolute right-1/4 top-1/2 w-80 h-80 rounded-full bg-cyber-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-20 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">Experience Ledger</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyber-primary/45" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyber-primary/45" />
          <p className="text-cyber-textMuted font-mono text-xs uppercase tracking-widest leading-relaxed">
            No active timeline records located.<br />
            <span className="text-[10px] text-cyber-primary/60">Initialize console to register entries.</span>
          </p>
        </div>
      ) : (
        /* Timeline Layout */
        <div className="relative border-l-2 border-white/5 space-y-16 pl-8 md:pl-12 ml-4 md:ml-8">
          {items.map((item, idx) => {
            const isAchievement = item.id?.startsWith('ach');
            const NodeIcon = isAchievement ? Star : Briefcase;
            const nodeColorClass = isAchievement ? 'text-cyber-accent border-cyber-accent/30' : 'text-cyber-primary border-cyber-primary/30';
            const nodeGlowBg = isAchievement ? 'bg-cyber-accent/10' : 'bg-cyber-primary/10';

            return (
              <div key={item.id || idx} className="relative group">
                {/* Glowing Timeline Bullet Circle */}
                <div className={`absolute -left-[45px] md:-left-[61px] top-1.5 w-8 h-8 rounded-full bg-cyber-bg border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 z-10 ${nodeColorClass} ${nodeGlowBg}`}>
                  <NodeIcon className="w-3.5 h-3.5" />
                </div>

                {/* Glassmorphic Timeline Card */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 hover:border-cyber-primary/20 transition-all duration-300 relative">
                  {/* Decorative border line */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-cyber-gradient rounded-l-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Meta details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-orbitron font-bold text-cyber-text group-hover:text-cyber-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-cyber-accent font-semibold tracking-wider font-orbitron uppercase mt-0.5">
                        {item.company}
                      </p>
                    </div>
                    
                    {/* Date badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-cyber-textMuted tracking-wider self-start md:self-center">
                      <Calendar className="w-3.5 h-3.5 text-cyber-primary" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-cyber-textMuted leading-relaxed font-light whitespace-pre-wrap">
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Experience;
