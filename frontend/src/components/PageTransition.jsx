import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const PageTransition = ({ 
  children, 
  isVisible = true,
  transitionType = 'fade',
  duration = 1,
  delay = 0,
  ...props 
}) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isVisible) {
      // Page enter animation
      const tl = gsap.timeline({ delay });
      
      switch (transitionType) {
        case 'fade':
          tl.fromTo(container, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration, ease: "power4.out" }
          );
          break;
          
        case 'slide-up':
          tl.fromTo(container,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration, ease: "power4.out" }
          );
          break;
          
        case 'slide-left':
          tl.fromTo(container,
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration, ease: "power4.out" }
          );
          break;
          
        case 'scale':
          tl.fromTo(container,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration, ease: "power4.out" }
          );
          break;
          
        case 'wipe':
          tl.fromTo(container,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration, ease: "power4.out" }
          );
          break;
          
        default:
          tl.fromTo(container,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration, ease: "power4.out" }
          );
      }
    } else {
      // Page exit animation
      const tl = gsap.timeline();
      
      switch (transitionType) {
        case 'fade':
          tl.to(container, { opacity: 0, y: -50, duration, ease: "power4.in" });
          break;
          
        case 'slide-up':
          tl.to(container, { opacity: 0, y: -100, duration, ease: "power4.in" });
          break;
          
        case 'slide-left':
          tl.to(container, { opacity: 0, x: -100, duration, ease: "power4.in" });
          break;
          
        case 'scale':
          tl.to(container, { opacity: 0, scale: 1.2, duration, ease: "power4.in" });
          break;
          
        case 'wipe':
          tl.to(container, { clipPath: "inset(0 0% 0 100%)", duration, ease: "power4.in" });
          break;
          
        default:
          tl.to(container, { opacity: 0, y: -50, duration, ease: "power4.in" });
      }
    }
  }, [isVisible, transitionType, duration, delay]);

  return (
    <div ref={containerRef} className="page-transition" {...props}>
      {children}
    </div>
  );
};

export default PageTransition;
