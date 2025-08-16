import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroller = ({ 
  children, 
  className = '', 
  speed = 1,
  ...props 
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    const containerWidth = container.offsetWidth;
    const contentWidth = content.scrollWidth;
    const distance = contentWidth - containerWidth;

    const horizontalScroll = gsap.to(content, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${distance * speed}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    return () => {
      horizontalScroll.kill();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`horizontal-scroller ${className}`} {...props}>
      <div ref={contentRef} className="horizontal-content">
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroller;
