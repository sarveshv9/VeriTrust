import React, { useEffect, useRef } from 'react';
import '../styles/HowItWorks.css'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react"
import ScrollReveal from '../hooks/useScrollReveal';

gsap.registerPlugin(useGSAP, ScrollTrigger)

const HowItWorks = () => {

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
