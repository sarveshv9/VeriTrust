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
          willChange: 'transform, opacity'
        }}
      >
        {word}
      </span>
    ));
  };

  useEffect(() => {
    if (!containerRef.current || !h2Ref.current) return;

    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars?.id?.includes('step-') || 
          trigger.vars?.id === 'title-scale' || 
          trigger.vars?.id === 'pinned-text') {
        trigger.kill();
      }
    });
    
    const timeoutId = setTimeout(() => {
      const scroller = document.querySelector('.smooth-wrapper') || window;

      const pinnedText = document.querySelector('.pinned-text');
      const titleWords = document.querySelectorAll('.title-word');
      const stepContainers = containerRef.current?.querySelectorAll('.step-container') || [];
      const stepIcons = document.querySelectorAll('.step-icon');
      const stepNumbers = document.querySelectorAll('.step-number');
      const descriptionWords = document.querySelectorAll('.step-description .word-span');

      const setGPUOptimizedStyles = (elements, scope = '.how-it-works') => {
        elements.forEach(el => {
          if (el && el.closest(scope)) {
            el.style.willChange = 'transform, opacity';
            el.style.backfaceVisibility = 'hidden';
            el.style.perspective = '1000px';
          }
        });
      };

      setGPUOptimizedStyles([pinnedText, ...titleWords, ...stepContainers, ...stepIcons, ...stepNumbers, ...descriptionWords], '.how-it-works');

      // Note: The 'marker' property is for ScrollTrigger, not gsap.set(), so it was removed from here.
      gsap.set(pinnedText, {
        scale: 0.5,
        opacity: 0,
        force3D: true
      });

      const mainTitle = h2Ref.current;
      if (mainTitle) {
        const titleText = mainTitle.textContent;
        const titleWords = titleText.split(' ').map((word, index) => 
          `<span class="title-word" style="display: inline-block; margin-right: 0.25em; will-change: transform, opacity; backface-visibility: hidden;">${word}</span>`
        ).join('');
        mainTitle.innerHTML = titleWords;

        const newTitleWords = mainTitle.querySelectorAll('.title-word');

        gsap.set(newTitleWords, {
          y: 30,
          opacity: 0,
          rotationX: 45,
          force3D: true
        });

        gsap.to(newTitleWords, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3,
          stagger: 0.1,
          force3D: true,
        });
      }

      gsap.set(descriptionWords, { y: 20, opacity: 0, force3D: true });
      const stepTitleWords = document.querySelectorAll('.step-title .word-span');
      gsap.set(stepTitleWords, { opacity: 0, force3D: true });
      gsap.set(stepIcons, { scale: 0, rotation: -180, opacity: 0, force3D: true });
      gsap.set(stepNumbers, { scale: 0, opacity: 0, rotation: 90, force3D: true });

      ScrollTrigger.create({
        trigger: ".pin-container",
        scroller: scroller,
        start: "top 80%",
        end: "center center",
        scrub: 0.5,
        animation: gsap.to(pinnedText, {
          scale: 1.2,
          opacity: 1,
          ease: "none",
          force3D: true
        }),
        id: "title-scale",
        invalidateOnRefresh: true,
        markers: false // <-- Added marker here
      });

      ScrollTrigger.create({
        trigger: ".pin-container",
        scroller: scroller,
        start: "center center",
        end: "center center",
        scrub: 0.3,
        pin: ".pin-container",
        pinSpacing: false,
        anticipatePin: 1,
        id: "pinned-text",
        invalidateOnRefresh: true,
        markers: false // <-- Added marker here
      });

      stepContainers.forEach((step, index) => {
        const isLast = index === stepContainers.length - 1;
        
        const stepDescriptionWords = step.querySelectorAll('.step-description .word-span');
        const stepTitle = step.querySelector('.step-title');
        const stepIcon = step.querySelector('.step-icon');
        const stepNumber = step.querySelector('.step-number');

        gsap.set(stepTitle, { y: 20, opacity: 0, force3D: true });
        
        const stepTimeline = gsap.timeline();
        
        stepTimeline
          .to(stepIcon, { scale: 1, rotation: 0, opacity: 1, duration: 0.3, ease: "back.out(1.4)", force3D: true }, "-=0.2")
          .to(stepTitle, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", force3D: true }, "-=0.1")
          .to(stepDescriptionWords, { y: 0, opacity: 1, duration: 0.4, stagger: 0.02, ease: "power2.out", force3D: true }, "-=0.1")
          .to({}, { duration: 0.2 })
          .to(stepTitle, { y: -10, opacity: 0, duration: 0.25, ease: "power2.inOut", force3D: true })
          .to(stepDescriptionWords, { y: -10, opacity: 0, duration: 0.3, stagger: 0.015, ease: "power2.inOut", force3D: true })
          .to([stepIcon, stepNumber], { scale: 0, opacity: 0, rotation: 30, duration: 0.25, ease: "power2.inOut", force3D: true }, "-=0.25")
          .to(step, { autoAlpha: 0, y: -20, scale: 0.99, duration: 0.3, ease: "power2.inOut", force3D: true }, "-=0.15");

        ScrollTrigger.create({
          trigger: step,
          scroller: scroller,
          start: "center center",
          end: isLast ? "center+=900 center" : "center+=800 center",
          scrub: 0.3,
          pin: true,
          pinSpacing: false,
          animation: stepTimeline,
          id: `step-${index + 1}`,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          markers: false, // <-- Added marker here
          onStart: () => {
            gsap.set(step, { position: "relative", display: "flex", force3D: true });
          },
          onRefresh: () => {
            gsap.set([step, stepIcon, stepNumber, ...stepDescriptionWords], { force3D: true });
          }
        });
      });

      ScrollTrigger.refresh();
      
    }, 100);

    return () => {
      clearTimeout(timeoutId);
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
      <div className="section-spacer"></div>
    </section>
  );
};

export default HowItWorks;