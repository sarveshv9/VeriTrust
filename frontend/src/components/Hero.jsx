import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import '../styles/Hero.css';
import SparkleButton from './elements/SparkleButton';

const Hero = React.memo(({ onSearchGig }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const timelineRef = useRef(null);

  // Memoize the submit handler to prevent unnecessary re-renders
  const handleSubmit = useCallback(() => {
    if (onSearchGig) {
      onSearchGig('get-started');
    }
  }, [onSearchGig]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kill any existing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create main timeline
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out" }
      });

      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 40
      });

      // Animate elements in sequence
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0
      }, "-=0.6") // Start 0.6s before previous animation ends
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.2");

      // Add title underline animation
      if (titleRef.current) {
        const underline = titleRef.current.querySelector('::after');
        if (underline) {
          gsap.to(underline, {
            scaleX: 1,
            duration: 2,
            delay: 1.5,
            ease: "power2.inOut"
          });
        }
      }

      timelineRef.current = tl;

      // Optional: Add mouse parallax effect
      const handleMouseMove = (e) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(titleRef.current, {
          x: x * 20,
          y: y * 10,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(subtitleRef.current, {
          x: x * 10,
          y: y * 5,
          duration: 0.4,
          ease: "power2.out"
        });
      };

      const hero = heroRef.current;
      if (hero) {
        hero.addEventListener('mousemove', handleMouseMove);
        
        // Cleanup function
        return () => {
          hero.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, heroRef);

    // Cleanup on unmount
    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []); // Empty dependency array - runs once on mount

  return (
    <section ref={heroRef} className="hero" role="banner">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Reputation You Own. Trust You Earn.
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          Empowering trust in the future of work.
        </p>

        <div ref={buttonRef} className="submit-form">
          <SparkleButton 
            text="Submit Now" 
            onClick={handleSubmit}
            ariaLabel="Submit your information to get started"
          />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;