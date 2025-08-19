import React, { useEffect, useRef } from 'react';
import '../styles/HowItWorks.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollReveal from '../hooks/useScrollReveal';

// Register plugins outside component
gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef(null);
  const h2Ref = useRef(null);

  const steps = [
    {
      icon: '🦊',
      title: 'Connect Your Web3 Wallet',
      description: 'Link your decentralized identity (MetaMask) securely to permanently own and control your freelancer reputation on Ethereum.'
    },
    {
      icon: '🤖',
      title: 'AI-Verified Freelancer Matching',
      description: 'Our AI evaluates on-chain feedback, skill hashes, and sentiment scores to match you with the most trustworthy freelancers.'
    },
    {
      icon: '⛓️',
      title: 'Secure Ethereum Transactions',
      description: 'Engage in transparent, immutable payment settlements using smart contracts that store hashed feedback and PoW proofs.'
    },
    {
      icon: '⛏️',
      title: 'Proof-of-Work Feedback Validation',
      description: 'Submit tamper-proof freelancer reviews validated by computational PoW and AI analysis, recorded securely on blockchain forever.'
    }
  ];

  useEffect(() => {
    if (!containerRef.current || !h2Ref.current) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Get the smooth scroller reference
    const scroller = document.querySelector('.smooth-wrapper') || window;

    // Set initial states
    gsap.set(".pinned-text", {
      scale: 0.5,
      opacity: 1
    });

    // Hide all steps initially and set starting position
    gsap.set(".step-container", {
      autoAlpha: 0,
      y: 50,
      scale: 0.9
    });

    // ANIMATION 1: Scale up title as it approaches the middle
    gsap.to(".pinned-text", {
      scale: 1.2,
      scrollTrigger: {
        trigger: ".pin-container",
        scroller: scroller,
        start: "top 80%",
        end: "center center",
        scrub: 1,
      }
    });

    // ANIMATION 2: Pin title, hold, then fade out
    const pinnedTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-container",
        scroller: scroller,
        start: "center center",
        end: "center+=70 center",
        scrub: 1,
        pin: ".pin-container",
        pinSpacing: false,
        anticipatePin: 1,
      }
    });

    pinnedTimeline
      .to(".pinned-text", {
        opacity: 0,
        duration: 0.5,
      });

    // ANIMATION 3: Smooth sequential step animations
    const stepContainers = containerRef.current?.querySelectorAll('.step-container') || [];

    stepContainers.forEach((step, index) => {
      const isLast = index === stepContainers.length - 1;
      
      // Each step gets its own scroll section with smoother transitions
      const stepTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          scroller: scroller,
          start: "center center",
          end: isLast ? "center+=600 center" : "center+=400 center", // Longer duration for smoother animation
          scrub: 0.5, // Add slight smoothing to scrub
          pin: true,
          pinSpacing: false,
          id: `step-${index + 1}`,
          // Use relative positioning and rely on CSS flex centering instead of fixed positioning
          onStart: () => {
            gsap.set(step, {
              position: "relative",
              top: "auto",
              left: "auto",
              transform: "none",
              width: "100%",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            });
          }
        }
      });

      // Smoother animation sequence
      stepTimeline
        // Fade in phase - using autoAlpha for flicker-free fade and smoother easing
        .fromTo(step, 
          { 
            autoAlpha: 0, 
            y: 60, 
            scale: 0.95,
            rotationX: 10 // Subtle 3D effect
          }, 
          { 
            autoAlpha: 1, 
            y: 0, 
            scale: 1,
            rotationX: 0,
            duration: 0.4, // Longer fade in
            ease: "power2.out"
          }
        )
        // Hold phase - smooth and stable
        .to(step, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.3, // Always 0.3 duration for hold
          ease: "none"
        });

      // Smooth fade out for all steps with longer duration and smoother easing
      stepTimeline.to(step, {
        autoAlpha: 0,
        y: -30, // Less dramatic movement
        scale: 0.98, // Subtle scale change
        rotationX: -5, // Subtle 3D exit
        duration: 0.8,
        ease: "power2.inOut"
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="how-it-works" id="how-it-works" ref={containerRef}>

      {/* Pin container */}
      <div className="pin-container">
        <div className="pinned-text" ref={h2Ref}>How VeriTrust Works</div>
      </div>

      {/* Steps container - increased height for sequential animations */}
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-container" data-step={index + 1}>
            <div className="step-content">
              <div className="step-left">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
              </div>
              <div className="step-right">
                <div className="step-description">
                  {step.description}
                </div>
              </div>
            </div>
            <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Spacer to prevent next section overlap */}
      <div className="section-spacer"></div>
    </section>
  );
};

export default HowItWorks;