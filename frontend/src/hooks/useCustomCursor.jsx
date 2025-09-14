// hooks/useCustomCursor.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';

const useCustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const updateMousePosition = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, []);

  const onCursorEnter = useCallback(() => {
    setIsHovering(true);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 2,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    }
  }, []);

  const onCursorLeave = useCallback(() => {
    setIsHovering(false);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    }
  }, []);

  useEffect(() => {
    // Show cursor immediately
    setIsVisible(true);
    
    // Set initial position and visibility
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
      cursorRef.current.style.opacity = '1';
    }
    
    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover listeners to interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, [data-cursor-hover]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', onCursorEnter);
        el.addEventListener('mouseleave', onCursorLeave);
      });
    };

    // Add listeners immediately and after DOM updates
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Remove event listeners
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      observer.disconnect();

      const interactiveElements = document.querySelectorAll('button, a, [data-cursor-hover]');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onCursorEnter);
        el.removeEventListener('mouseleave', onCursorLeave);
      });
    };
  }, [updateMousePosition, handleMouseEnter, handleMouseLeave, onCursorEnter, onCursorLeave]);

  return {
    cursorRef,
    isVisible,
    isHovering,
    onCursorEnter,
    onCursorLeave
  };
};

export default useCustomCursor;