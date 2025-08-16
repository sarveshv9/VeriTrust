import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ScrollSection = ({ 
  children, 
  className = '', 
  pin = false, 
  pinSpacing = true,
  start = "top top",
  end = "bottom top",
  scrub = false,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  ...props 
}) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: start,
      end: end,
      pin: pin,
      pinSpacing: pinSpacing,
      scrub: scrub,
      onEnter: onEnter,
      onLeave: onLeave,
      onEnterBack: onEnterBack,
      onLeaveBack: onLeaveBack,
      markers: false
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [pin, pinSpacing, start, end, scrub, onEnter, onLeave, onEnterBack, onLeaveBack]);

  return (
    <section ref={sectionRef} className={`scroll-section ${className}`} {...props}>
      {children}
    </section>
  );
};

export default ScrollSection;

