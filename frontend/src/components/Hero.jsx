import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import '../styles/Hero.css';
import SparkleButton from './elements/SparkleButton'; // Using original static import

// --- Optimization: Memoization ---
// React.memo prevents re-renders if props (onSearchGig) haven't changed.
// This is effective because we use useCallback on the handleSubmit function
// that wraps onSearchGig.
const Hero = React.memo(({ onSearchGig }) => {
  // --- Optimization: Ref Usage ---
  // Refs are used to directly target DOM nodes for GSAP, which is
  // highly performant as it bypasses React's virtual DOM diffing.
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null); // Renamed from buttonRef for semantic clarity
  const scrollIndicatorRef = useRef(null);

  // --- Optimization: useCallback ---
  // Memoizes the handleSubmit function. It will only be recreated if
  // the `onSearchGig` prop function itself changes, ensuring
  // referential-equality for React.memo.
  const handleSubmit = useCallback(() => {
    if (onSearchGig) {
      onSearchGig('get-started');
    }
  }, [onSearchGig]);

  // --- Optimization: Semantic Form Handling ---
  // This wrapper allows the form to be "submitted" via the Enter key,
  // which is a key accessibility win.
  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault(); // Prevent default form submission (page reload)
      handleSubmit();
    },
    [handleSubmit]
  );

  // --- Optimization: GSAP Animation ---
  useEffect(() => {
    // --- Best Practice: gsap.context() ---
    // This is the modern, correct way to use GSAP in React.
    // 1. It scopes all GSAP animations created within it.
    // 2. The returned `ctx.revert()` in the cleanup function
    //    safely tears down *only* these animations, preventing
    //    memory leaks and conflicts on unmount.
    const ctx = gsap.context(() => {
      // Set initial states (opacity: 0, y: 40) for all animated elements
      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          formRef.current,
          scrollIndicatorRef.current,
        ],
        {
          opacity: 0,
          y: 40,
        }
      );

      // Create the main intro timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Animate elements in a staggered sequence for a smooth effect
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3, // Small delay to ensure readiness
        },
        'start' // Label the start
      )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
          },
          'start+=0.4' // Stagger start relative to the label
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          'start+=0.8'
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          'start+=1.0'
        );

      // Create a separate, looping animation for the scroll indicator
      // This runs independently after the main timeline completes
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1, // Repeat infinitely
        yoyo: true, // Animate back and forth
        ease: 'power1.inOut',
        delay: tl.duration(), // Start after the timeline is done
      });
    }, heroRef); // Scope the context to the heroRef

    // Cleanup function
    return () => ctx.revert();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    // --- Optimization: Accessibility & Semantics ---
    // `aria-labelledby` links this section to its main title,
    // providing context for screen reader users.
    <section
      ref={heroRef}
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title" id="hero-title">
          Reputation You Own.
          <br />
          Trust You Earn.
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          EMPOWERING TRUST IN THE FUTURE OF WORK.
        </p>

        {/* --- Optimization: Semantics & Accessibility --- */}
        {/* Converted the <div> to a <form> element. This is more
            semantic and allows users to "submit" with the Enter key.
            `onSubmit` handler prevents default page reload. */}
        <form
          ref={formRef}
          className="submit-form"
          onSubmit={handleFormSubmit}
        >
          <SparkleButton
            text="Submit Now"
            onClick={handleSubmit} // Still passing onClick for the button's internal handler
            ariaLabel="Submit your information to get started"
            // The button's default type is "submit" inside a form
          />
        </form>

        <div ref={scrollIndicatorRef} className="scroll-indicator">
          <span>Scroll Down</span>
          {/* --- Optimization: Accessibility --- */}
          {/* Added `aria-hidden="true"` and `focusable="false"` to the
              decorative SVG so screen readers ignore it. */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
      strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
});

// --- Optimization: Best Practices ---
// Add `displayName` for better debugging in React DevTools,
// especially since we're using React.memo.
Hero.displayName = 'Hero';

export default Hero;