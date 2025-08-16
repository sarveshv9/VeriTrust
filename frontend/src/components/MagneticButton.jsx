import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const MagneticButton = ({ 
  children, 
  className = '', 
  onClick, 
  magneticStrength = 0.3,
  scaleOnHover = 1.05,
  ...props 
}) => {
  const buttonRef = useRef(null);
  const magneticRef = useRef(null);

  useGSAP(() => {
    const button = buttonRef.current;
    const magnetic = magneticRef.current;
    
    if (!button || !magnetic) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;
      
      gsap.to(magnetic, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: scaleOnHover,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(magnetic, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magneticStrength, scaleOnHover]);

  return (
    <div ref={magneticRef} className="magnetic-wrapper">
      <button
        ref={buttonRef}
        className={`magnetic-button ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default MagneticButton;
