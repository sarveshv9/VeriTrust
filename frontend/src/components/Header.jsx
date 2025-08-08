import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Header.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Header = ({ onSubmitReview }) => {
  const navContainerRef = useRef(null);
  const [navPortal, setNavPortal] = React.useState(null);

  useEffect(() => {
    const portalContainer = document.getElementById('nav-portal');
    setNavPortal(portalContainer);
  }, []);

  useGSAP(() => {
    if (!navPortal) return; 
    
    let currentScrollProgress = 0;
    
    gsap.delayedCall(0.1, () => {
      ScrollTrigger.refresh();
      
      const navTween = gsap.timeline({
        scrollTrigger: {
          trigger: '.header',
          start: 'bottom top+=80',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            currentScrollProgress = self.progress;
          },
          onRefresh: () => {
            if (currentScrollProgress === 0) {
              gsap.set('.nav-container', { scale: 1 });
            }
          }
        }
      });
      
      navTween.fromTo('.nav-container', 
        { 
          scale: 1, 
          transformOrigin: 'center center',
          top: '24px'
        }, 
        {
          scale: 0.8, 
          top: '12px',
          ease: 'power2.out',
          transformOrigin: 'center center'
        }
      );
    });

    const handleMouseEnter = () => {
      gsap.to('.nav-container', {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      if (currentScrollProgress > 0) {
        gsap.to('.nav-container', {
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const navContainer = navContainerRef.current;
    if (navContainer) {
      navContainer.addEventListener('mouseenter', handleMouseEnter);
      navContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (navContainer) {
        navContainer.removeEventListener('mouseenter', handleMouseEnter);
        navContainer.removeEventListener('mouseleave', handleMouseLeave);
      }

      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === '.header') {
          trigger.kill();
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const NavigationComponent = () => (
    <div className="nav-container" ref={navContainerRef}>
      <nav className="nav">
        <a 
          href="#home" 
          data-section="hero"
          className="nav-link" 
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection('header'); 
          }}
        >
          Home
        </a>
        <a 
          href="#how-it-works" 
          data-section="htw"
          className="nav-link" 
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection('how-it-works'); 
          }}
        >
          How it Works
        </a>
        <a 
          href="#footer" 
          data-section="support"
          className="nav-link" 
          onClick={(e) => { 
            e.preventDefault(); 
            scrollToSection('footer'); 
          }}
        >
          Support
        </a>
      </nav>
    </div>
  );

  return (
    <>
      <header className="header" id='header'>
        <div className="container header-content">
          <div className="logo">
            <h1>VeriTrust</h1>
          </div>
          <div className="nav-placeholder"></div>
          <div className="header-actions">
            <button className="submit-review-btn" onClick={onSubmitReview}>
              Write a Review
            </button>
          </div>
        </div>
      </header>
      {navPortal && createPortal(<NavigationComponent />, navPortal)}
    </>
  );
};

export default Header;