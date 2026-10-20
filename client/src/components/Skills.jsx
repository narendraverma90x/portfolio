import { useState } from 'react';
import { Layout, Server, BrainCircuit, Cloud, Database } from 'lucide-react';

const Skills = ({ skillsContent }) => {
  const [activeTab, setActiveTab] = useState('frontend');

  const defaultSkills = {
    frontend: [
      { name: 'React.js / Next.js', level: 90 },
      { name: 'JavaScript (ES6+) / TS', level: 85 },
      { name: 'Tailwind CSS / Glassmorphism', level: 95 },
      { name: 'Framer Motion / Canvas', level: 80 }
    ],
    backend: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'REST APIs / GraphQL', level: 85 },
      { name: 'Python (FastAPI / Flask)', level: 75 },
      { name: 'Java / Spring Boot', level: 60 }
    ],
    ai_ml: [
      { name: 'Python / NumPy / Pandas', level: 85 },
      { name: 'TensorFlow / PyTorch', level: 70 },
      { name: 'NLP & LLM Fine-Tuning', level: 65 },
      { name: 'Computer Vision (OpenCV)', level: 60 }
    ],
    cloud_devops: [
      { name: 'Docker / Containerization', level: 80 },
      { name: 'AWS (S3, EC2, Lambda)', level: 70 },
      { name: 'GitHub Actions (CI/CD)', level: 75 },
      { name: 'Linux / Bash Scripting', level: 80 }
    ],
    databases: [
      { name: 'MongoDB / Mongoose', level: 90 },
      { name: 'PostgreSQL / SQL', level: 80 },
      { name: 'Redis / Caching', level: 65 },
      { name: 'Firebase / Firestore', level: 85 }
    ]
  };

  const skills = skillsContent || defaultSkills;

  const categories = [
    { id: 'frontend', label: 'Frontend', Icon: Layout, color: 'text-[#00f2fe]', glow: 'shadow-neon-teal' },
    { id: 'backend', label: 'Backend', Icon: Server, color: 'text-[#4facfe]', glow: 'shadow-neon-teal' },
    { id: 'ai_ml', label: 'AI / ML', Icon: BrainCircuit, color: 'text-[#9b5de5]', glow: 'shadow-neon-purple' },
    { id: 'cloud_devops', label: 'Cloud & DevOps', Icon: Cloud, color: 'text-[#39ff14]', glow: 'shadow-neon-green' },
    { id: 'databases', label: 'Databases', Icon: Database, color: 'text-[#ff6b6b]', glow: 'shadow-neon-teal' }
  ];

  return (
    <section id="skills" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Background backing blur */}
      <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-cyber-accent/5 blur-[120px] pointer-events-none" />

      {/* Grid Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-cyber-text mb-4">
          [ <span className="text-cyber-primary text-glow-teal">Tech Core Stack</span> ]
        </h2>
        <div className="w-20 h-1 bg-cyber-gradient rounded-full shadow-neon-teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Category Tabs Selection */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {categories.map((cat) => {
            const CatIcon = cat.Icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-4 p-4 rounded-xl font-orbitron text-xs tracking-widest uppercase border text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-cyber-gradient text-black font-bold border-transparent shadow-neon-teal scale-[1.02]'
                    : 'bg-white/5 border-white/5 text-cyber-textMuted hover:text-cyber-text hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-black/15 text-black' : 'bg-white/5 ' + cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Skills Progress Display Panels */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-8 min-h-[380px] flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Corner Shaders */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-cyber-primary/5 blur-[30px]" />
          
          <div className="space-y-6">
            {skills[activeTab]?.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-orbitron font-semibold text-cyber-text tracking-wider">
                    {skill.name}
                  </span>
                  <span className="font-mono text-cyber-primary text-glow-teal font-bold">
                    {skill.level}%
                  </span>
                </div>
                
                {/* Custom Glowing Cyber Progress Bar */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-cyber-gradient shadow-neon-teal transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
