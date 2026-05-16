import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const outlineRef = useRef(null);

  useEffect(() => {
    const outline = outlineRef.current;

    const moveCursor = (e) => {
      // Larger outline follows with a slight delay (smooth trailing)
      gsap.to(outline, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out"
      });
    };

    const handleMouseDown = () => {
      gsap.to(outline, { scale: 0.8, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(outline, { scale: 1, duration: 0.2 });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .interactive')) {
        gsap.to(outline, { 
          scale: 1.6, 
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
          borderColor: 'var(--gold)',
          duration: 0.3 
        });
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], .interactive')) {
        gsap.to(outline, { 
          scale: 1, 
          backgroundColor: 'rgba(255, 215, 0, 0.05)',
          borderColor: 'var(--gold)',
          duration: 0.3 
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div ref={outlineRef} className="cursor-outline" />
  );
}
