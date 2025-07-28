import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const useGSAP = (options = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  const defaults = {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0,
    ease: 'power2.out',
    autoStart: true,
    ...options
  };

  useEffect(() => {
    if (!elementRef.current) return;

    // Set initial hidden state
    gsap.set(elementRef.current, {
      opacity: 0,
      y: defaults.y,
      visibility: 'hidden'
    });

    if (defaults.autoStart) {
      animateIn();
    }

    return () => {
      animationRef.current?.kill();
    };
  }, []);

  const animateIn = (customOptions = {}) => {
    if (!elementRef.current) return;

    animationRef.current?.kill();

    const mergedOptions = { ...defaults, ...customOptions };

    animationRef.current = gsap.to(elementRef.current, {
      y: 0,
      opacity: 1,
      visibility: 'visible',
      duration: mergedOptions.duration,
      delay: mergedOptions.delay,
      ease: mergedOptions.ease,
      onStart: mergedOptions.onStart,
      onComplete: mergedOptions.onComplete
    });
  };

  const animateOut = (customOptions = {}) => {
    if (!elementRef.current) return;

    const mergedOptions = { ...defaults, ...customOptions };

    return gsap.to(elementRef.current, {
      y: mergedOptions.y,
      opacity: 0,
      duration: mergedOptions.duration,
      ease: mergedOptions.ease
    });
  };

  return { elementRef, animateIn, animateOut };
};