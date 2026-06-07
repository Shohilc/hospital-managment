import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MouseParticles() {
  const [isClicking, setIsClicking] = useState(false);

  // Motion values to track the raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply a spring physics wrapper for that smooth, delayed "Antigravity" tracking feel
  const springConfig = { damping: 40, stiffness: 200, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Center the 400x400 orb on the cursor
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial center position if mouse hasn't moved
    mouseX.set(window.innerWidth / 2 - 200);
    mouseY.set(window.innerHeight / 2 - 200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          width: 400,
          height: 400,
          borderRadius: '50%',
          // Stronger opacity for white background
          background: 'radial-gradient(circle at center, rgba(45,212,191,0.8) 0%, rgba(139,92,246,0.6) 30%, rgba(59,130,246,0.4) 50%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform'
        }}
        animate={{
          scale: isClicking ? 1.5 : 1,
          opacity: isClicking ? 1 : 0.8,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </div>
  );
}
