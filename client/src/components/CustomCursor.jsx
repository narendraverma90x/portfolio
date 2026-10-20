import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [outlinePos, setOutlinePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Simple lag tracking interpolation for outline ring
    const interval = setInterval(() => {
      setOutlinePos(prev => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.25, // Interp speed
          y: prev.y + dy * 0.25
        };
      });
    }, 16); // ~60fps refresh

    // Hover listeners
    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .project-card, .doc-card');
      targets.forEach(target => {
        target.addEventListener('mouseenter', () => setIsHovering(true));
        target.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Periodically bind hover listeners to handle dynamic DOM additions
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
      observer.disconnect();
    };
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="cursor-dot hidden md:block" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          backgroundColor: isHovering ? '#9b5de5' : '#00f2fe',
          boxShadow: isHovering ? '0 0 12px #9b5de5' : '0 0 8px #00f2fe'
        }} 
      />
      <div 
        className="cursor-outline hidden md:block" 
        style={{ 
          left: `${outlinePos.x}px`, 
          top: `${outlinePos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`,
          borderColor: isHovering ? '#9b5de5' : 'rgba(0, 242, 254, 0.5)',
          backgroundColor: isHovering ? 'rgba(155, 93, 229, 0.05)' : 'transparent',
          boxShadow: isHovering ? '0 0 12px rgba(155, 93, 229, 0.2)' : '0 0 8px rgba(0, 242, 254, 0.05)'
        }} 
      />
    </>
  );
};

export default CustomCursor;
