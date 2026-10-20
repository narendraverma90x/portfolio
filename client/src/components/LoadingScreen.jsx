import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [activeText, setActiveText] = useState('Initializing core protocols...');

  const loadingPhrases = [
    'Initializing core protocols...',
    'Loading cybernetic grid shaders...',
    'Synchronizing database shards...',
    'Mounting futuristic UI controls...',
    'Compiling creative matrix modules...',
    'Aetheric portfolio ready!'
  ];

  useEffect(() => {
    let index = 0;
    const textInterval = setInterval(() => {
      index = (index + 1) % loadingPhrases.length;
      setActiveText(loadingPhrases[index]);
    }, 450);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 80);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 bg-[#06070a] z-[99999] flex flex-col items-center justify-center font-orbitron"
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      <div className="absolute inset-0 grid-glow opacity-20 pointer-events-none" />
      
      {/* Glow Backing Blur */}
      <div className="w-[300px] h-[300px] rounded-full bg-cyber-primary/10 blur-[80px] absolute pointer-events-none" />

      {/* Rotating Cyber Ring */}
      <div className="relative mb-8">
        <motion.div 
          className="w-24 h-24 rounded-full border-2 border-dashed border-cyber-primary/30 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full border-t-2 border-r-2 border-cyber-accent"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyber-primary text-glow-teal font-bold">
          {Math.min(progress, 100)}%
        </span>
      </div>

      <div className="text-center w-80">
        <h2 className="text-cyber-text text-lg font-bold tracking-widest uppercase mb-1">
          System Loading
        </h2>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3 border border-white/5">
          <motion.div 
            className="h-full bg-cyber-gradient shadow-neon-teal"
            style={{ width: `${progress}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={activeText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-cyber-textMuted font-mono h-4 overflow-hidden"
          >
            {activeText}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
