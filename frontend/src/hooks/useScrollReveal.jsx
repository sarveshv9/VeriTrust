import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../styles/HowItWorks.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.6, // Increased from 0.1 for better visibility
  baseRotation = 0,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom 750px",
  wordAnimationEnd = "bottom 750px"
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wait for smooth scroll to be ready
    const waitForSmoothScroll = () => {
      const scroller = scrollContainerRef?.current || 
                      document.querySelector('.smooth-wrapper') || 
                      window;
      
      if (scroller && scroller !== window) {
        console.log('ScrollReveal: Smooth scroll ready, initializing with scroller:', scroller);
        initializeAnimations(scroller);
      } else if (scroller === window) {
        console.log('ScrollReveal: Using window as scroller');
        initializeAnimations(scroller);
      } else {
        // If smooth scroll isn't ready yet, wait a bit and try again
        setTimeout(waitForSmoothScroll, 100);
      }
    };

    const initializeAnimations = (scroller) => {
      // Ensure initial visibility
      gsap.set(el, {
        opacity: 1,
        visibility: 'visible'
      });

      // Ensure words start with better visibility
      const wordElements = el.querySelectorAll('.word');
      console.log('ScrollReveal: Found word elements:', wordElements.length);
      
      gsap.set(wordElements, {
        opacity: baseOpacity,
        willChange: 'opacity',
        visibility: 'visible'
      });

      // Rotation animation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=100px', // Adjusted for better positioning
            end: rotationEnd,
            scrub: true,
            markers: true, // Keep debug markers for now
          },
        },
      );

      // Word opacity animation
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=150px', // Adjusted for better positioning
            end: wordAnimationEnd,
            scrub: true,
            markers: true, // Keep debug markers for now
          },
        },
      );

      // Blur animation
      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=150px', // Adjusted for better positioning
              end: wordAnimationEnd,
              scrub: true,
              markers: true, // Keep debug markers for now
            },
          },
        );
      }

      // Refresh ScrollTrigger to ensure proper initialization
      ScrollTrigger.refresh();
      console.log('ScrollReveal: Animation setup complete');
    };

    // Start the initialization process
    waitForSmoothScroll();

    return () => {
      // Clean up only the triggers created by this component
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;

