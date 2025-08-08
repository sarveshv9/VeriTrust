import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

export const useGSAPScrollZoom = (options = {}) => {
  const {
    maxScale = 1.3,
    minScale = 1.0,
    start = "top top",
    end = "bottom bottom",
    scrub = true,
    transformOrigin = "center center"
  } = options;
  
  const elementRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Create ScrollTrigger for zoom effect
    triggerRef.current = ScrollTrigger.create({
      trigger: "body",
      start: start,
      end: end,
      scrub: scrub,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = minScale + (progress * (maxScale - minScale));
        
        gsap.set(elementRef.current, {
          scale: scale,
          transformOrigin: transformOrigin,
          force3D: true // Better performance
        });
      }
    });

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [maxScale, minScale, start, end, scrub, transformOrigin]);

  return elementRef;
};
