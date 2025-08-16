import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimatedCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTextRef = useRef(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorText = cursorTextRef.current;
    
    if (!cursor || !cursorDot || !cursorText) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let cursorDotX = 0;
    let cursorDotY = 0;

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursorDotX += (mouseX - cursorDotX) * 0.3;
      cursorDotY += (mouseY - cursorDotY) * 0.3;

      gsap.set(cursor, {
        x: cursorX - 20,
        y: cursorY - 20
      });
      
      gsap.set(cursorDot, {
        x: cursorDotX - 4,
        y: cursorDotY - 4
      });
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Magnetic effect for interactive elements
    const handleInteractiveEnter = (e) => {
      const target = e.currentTarget;
      
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cursorText, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Set cursor text based on element type
      if (target.tagName === 'A') {
        cursorText.textContent = 'View';
      } else if (target.tagName === 'BUTTON') {
        cursorText.textContent = 'Click';
      }
    };

    const handleInteractiveLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cursorText, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add magnetic effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-button, .nav-link');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleInteractiveEnter);
      el.addEventListener('mouseleave', handleInteractiveLeave);
    });

    // Animation loop
    const tick = () => {
      updateCursor();
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleInteractiveEnter);
        el.removeEventListener('mouseleave', handleInteractiveLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="animated-cursor">
        <div ref={cursorTextRef} className="cursor-text"></div>
      </div>
      <div ref={cursorDotRef} className="cursor-dot"></div>
    </>
  );
};

export default AnimatedCursor;
