import React, { useEffect, useRef } from 'react';
import '../styles/HowItWorks.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import ScrollReveal from '../hooks/useScrollReveal';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef(null);

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

  useGSAP(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current;
    
    if (!section || !steps) return;

    // Section title animation with 3D effect
    gsap.fromTo('.section-title', 
      { 
        opacity: 0, 
        y: 50, 
        rotationX: -15,
        transformPerspective: 1000
      },
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0,
        duration: 1.2, 
        ease: "power4.out",
        scrollTrigger: {
          trigger: '.section-title',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Steps stagger animation with 3D transforms
    gsap.fromTo('.step-container', 
      { 
        opacity: 0, 
        x: -100, 
        scale: 0.8,
        rotationY: -20,
        transformPerspective: 1000
      },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        rotationY: 0,
        duration: 1.2, 
        stagger: 0.3, 
        ease: "power4.out",
        scrollTrigger: {
          trigger: '.steps-container',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Floating icons animation with 3D rotation
    gsap.to('.step-icon', {
      y: -10,
      rotationY: 360,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });

    // Step numbers reveal animation
    gsap.fromTo('.step-number', 
      { opacity: 0, scale: 0, rotation: -180 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.steps-container',
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section className="how-it-works" id='how-it-works' >

      <div className="section-title">
        <h2>How VeriTrust Works</h2>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            <div className="step-content">
              <div className="step-left">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
              </div>
              <div className="step-right">
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  blurStrength={10}
                  className='step-description'>{step.description}</ScrollReveal>
              </div>
            </div>
            <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
