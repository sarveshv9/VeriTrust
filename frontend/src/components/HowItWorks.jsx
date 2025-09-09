import React, { useEffect, useRef } from 'react';
import '../styles/HowItWorks.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

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

  // Helper function to split text into words with spans - optimized
  const splitTextIntoWords = (text) => {
    return text.split(' ').map((word, index) => (
      <span 
        key={index} 
        className="word-span" 
        style={{ 
          display: 'inline-block', 
          marginRight: '0.25em',
          willChange: 'transform, opacity' // GPU acceleration hint
        }}
      >
        {word}
      </span>
    ));
  };

  useEffect(() => {
    if (!containerRef.current || !h2Ref.current) return;

    // CRITICAL: Kill only HowItWorks-related ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars?.id?.includes('step-') || 
          trigger.vars?.id === 'title-scale' || 
          trigger.vars?.id === 'pinned-text') {
        trigger.kill();
      }
    });
    
    // Small delay to ensure cleanup is complete
    const timeoutId = setTimeout(() => {
      // Get the smooth scroller reference
      const scroller = document.querySelector('.smooth-wrapper') || window;

      // Pre-cache all elements to avoid repeated queries
      const pinnedText = document.querySelector('.pinned-text');
      const titleWords = document.querySelectorAll('.title-word');
      const stepContainers = containerRef.current?.querySelectorAll('.step-container') || [];
      const stepIcons = document.querySelectorAll('.step-icon');
      const stepNumbers = document.querySelectorAll('.step-number');
      const descriptionWords = document.querySelectorAll('.step-description .word-span');

      // OPTIMIZATION: Use scoped GPU-accelerated properties
      const setGPUOptimizedStyles = (elements, scope = '.how-it-works') => {
        elements.forEach(el => {
          if (el && el.closest(scope)) {
            el.style.willChange = 'transform, opacity';
            el.style.backfaceVisibility = 'hidden';
            el.style.perspective = '1000px';
          }
        });
      };

      // Apply GPU optimizations only to HowItWorks elements
      setGPUOptimizedStyles([pinnedText, ...titleWords, ...stepContainers, ...stepIcons, ...stepNumbers, ...descriptionWords], '.how-it-works');

      // Set initial states using transform3d for GPU acceleration
      gsap.set(pinnedText, {
        scale: 0.5,
        opacity: 0,
        force3D: true
      });

      // Split the main title into words and animate them in - OPTIMIZED
      const mainTitle = h2Ref.current;
      if (mainTitle) {
        const titleText = mainTitle.textContent;
        const titleWords = titleText.split(' ').map((word, index) => 
          `<span class="title-word" style="display: inline-block; margin-right: 0.25em; will-change: transform, opacity; backface-visibility: hidden;">${word}</span>`
        ).join('');
        mainTitle.innerHTML = titleWords;

        // Re-cache title words after DOM update
        const newTitleWords = mainTitle.querySelectorAll('.title-word');

        // Set initial state for title words with GPU acceleration
        gsap.set(newTitleWords, {
          y: 30,
          opacity: 0,
          rotationX: 45,
          force3D: true
        });

        // Animate title words in on page load - OPTIMIZED
        gsap.to(newTitleWords, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3,
          stagger: 0.1,
          force3D: true
        });
      }

      // Removed initial hidden state for stepContainers as per instructions

      // Set initial states for step elements with GPU acceleration
      gsap.set(descriptionWords, {
        y: 20,
        opacity: 0,
        force3D: true
      });

      // Set initial state for step titles - simple approach
      const stepTitleWords = document.querySelectorAll('.step-title .word-span');
      gsap.set(stepTitleWords, {
        opacity: 0,
        force3D: true
      });

      gsap.set(stepIcons, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        force3D: true
      });

      gsap.set(stepNumbers, {
        scale: 0,
        opacity: 0,
        rotation: 90,
        force3D: true
      });

      // ANIMATION 1: Scale up title - OPTIMIZED with reduced scrub sensitivity
      ScrollTrigger.create({
        trigger: ".pin-container",
        scroller: scroller,
        start: "top 80%",
        end: "center center",
        scrub: 0.5, // Reduced from 1 for smoother performance
        animation: gsap.to(pinnedText, {
          scale: 1.2,
          opacity: 1,
          ease: "none",
          force3D: true
        }),
        id: "title-scale",
        invalidateOnRefresh: true
      });

      // ANIMATION 2: Pin title and fade out - OPTIMIZED
      ScrollTrigger.create({
        trigger: ".pin-container",
        scroller: scroller,
        start: "center-=70 center",
        end: "center center",
        scrub: 0.3, // Reduced scrub for smoother performance
        pin: ".pin-container",
        pinSpacing: false,
        anticipatePin: 1,
        id: "pinned-text",
        invalidateOnRefresh: true
      });

      // ANIMATION 4: Step content animations - simplified
      stepContainers.forEach((step, index) => {
        const isLast = index === stepContainers.length - 1;
        
        // Get text elements for this specific step (more efficient)
        const stepDescriptionWords = step.querySelectorAll('.step-description .word-span');
        const stepTitleWordsForStep = step.querySelectorAll('.step-title .word-span');
        const stepIcon = step.querySelector('.step-icon');
        const stepNumber = step.querySelector('.step-number');
        const stepTitle = step.querySelector('.step-title');

        // Set initial state for stepTitle as hidden with y:20 and opacity:0
        gsap.set(stepTitle, {
          y: 20,
          opacity: 0,
          force3D: true
        });
        
        // Create optimized timeline with reduced complexity
        const stepTimeline = gsap.timeline();
        
        // Removed .fromTo block that animates main container fade in as per instructions
        
        // Icon animation - simplified
        stepTimeline
          .to(stepIcon, {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.3, // Faster
            ease: "back.out(1.4)", // Less aggressive easing
            force3D: true
          }, "-=0.2")
          .to(stepTitle, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            force3D: true
          }, "-=0.1")
          .to(stepDescriptionWords, {
            y: 0,
            opacity: 1,
            duration: 0.4, // Faster
            stagger: 0.02, // Reduced stagger
            ease: "power2.out",
            force3D: true
          }, "-=0.1")
          // Hold phase - shorter
          .to({}, { duration: 0.2 })
          // Fade out phase - simplified and faster
          .to(stepTitle, {
            y: -10,
            opacity: 0,
            duration: 0.25,
            ease: "power2.inOut",
            force3D: true
          })
          .to(stepDescriptionWords, {
            y: -10, // Less movement
            opacity: 0,
            duration: 0.3, // Faster
            stagger: 0.015, // Reduced stagger
            ease: "power2.inOut",
            force3D: true
          })
          .to([stepIcon, stepNumber], {
            scale: 0,
            opacity: 0,
            rotation: 30, // Less rotation
            duration: 0.25, // Faster
            ease: "power2.inOut",
            force3D: true
          }, "-=0.25")
          .to(step, {
            autoAlpha: 0,
            y: -20, // Less movement
            scale: 0.99, // Less scaling
            duration: 0.3, // Faster
            ease: "power2.inOut",
            force3D: true
          }, "-=0.15");

        // Optimized ScrollTrigger with better performance settings
        ScrollTrigger.create({
          trigger: step,
          scroller: scroller,
          start: "center center",
          end: isLast ? "center+=900 center" : "center+=800 center", // Updated distances for longer pin duration
          scrub: 0.3, // Much lower scrub value for smoother performance
          pin: true,
          pinSpacing: false,
          animation: stepTimeline,
          id: `step-${index + 1}`,
          invalidateOnRefresh: true,
          fastScrollEnd: true, // GSAP optimization
          onStart: () => {
            // Minimal DOM manipulation - set styles once
            gsap.set(step, {
              position: "relative",
              display: "flex",
              force3D: true
            });
          },
          onRefresh: () => {
            // Reset force3D on refresh to prevent issues
            gsap.set([step, stepIcon, stepNumber, ...stepDescriptionWords], {
              force3D: true
            });
          }
        });
      });

      // CRITICAL: Refresh only this component's ScrollTriggers
      ScrollTrigger.refresh();
      
    }, 100); // Slightly longer delay for better cleanup

    return () => {
      clearTimeout(timeoutId);
      // Cleanup only HowItWorks-related triggers
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.id?.includes('step-') || 
            trigger.vars?.id === 'title-scale' || 
            trigger.vars?.id === 'pinned-text') {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="how-it-works" id="how-it-works" ref={containerRef}>
      {/* Pin container with GPU optimization hint */}
      <div className="pin-container" style={{ willChange: 'transform' }}>
        <div 
          className="pinned-text" 
          ref={h2Ref}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        >
          How VeriTrust Works
        </div>
      </div>

      {/* Steps container with performance hints */}
      <div className="steps-container" style={{ willChange: 'transform' }}>
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="step-container" 
            data-step={index + 1}
            style={{ 
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="step-content">
              <div className="step-left">
                <div 
                  className="step-icon"
                  style={{ 
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {step.icon}
                </div>
                <h3 className="step-title">
                  {step.title}
                </h3>
              </div>
              <div className="step-right">
                <div className="step-description">
                  {splitTextIntoWords(step.description)}
                </div>
              </div>
            </div>
            <div 
              className="step-number"
              style={{ 
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden'
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {/* Spacer to prevent next section overlap */}
      <div className="section-spacer"></div>
    </section>
  );
};

export default HowItWorks;