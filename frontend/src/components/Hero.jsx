import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import '../styles/Hero.css';
import SparkleButton from './elements/SparkleButton';

const Hero = React.memo(({ onSearchGig }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const scrollIndicatorRef = useRef(null); // Create a ref for the new element
  const timelineRef = useRef(null);

  const handleSubmit = useCallback(() => {
    if (onSearchGig) {
      onSearchGig('get-started');
    }
  }, [onSearchGig]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out" }
      });

      // Add the new ref to the initial state setup
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current, scrollIndicatorRef.current], {
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
      }, "-=0.6")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.2")
      // Add the scroll indicator to the main animation timeline
      .to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4");

      // Add a separate, repeating "bounce" animation to the scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 10, // Moves it down 10px
        duration: 1.5,
        repeat: -1, // Repeats infinitely
        yoyo: true, // Animates back and forth
        ease: "power1.inOut",
        delay: tl.duration() // Starts after the main intro animation is complete
      });

      // ... (rest of your useEffect remains the same)
      
    }, heroRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" role="banner">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Reputation You Own.
          <br />
          Trust You Earn.
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          EMPOWERING TRUST IN THE FUTURE OF WORK.
        </p>

        <div ref={buttonRef} className="submit-form">
          <SparkleButton 
            text="Submit Now" 
            onClick={handleSubmit}
            ariaLabel="Submit your information to get started"
          />
        </div>

        {/* --- ADD THIS NEW ELEMENT --- */}
        <div ref={scrollIndicatorRef} className="scroll-indicator">
          <span>Scroll Down</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;