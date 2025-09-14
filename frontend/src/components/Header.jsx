import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Header.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/VT_logo.png';

gsap.registerPlugin(ScrollTrigger);

const Header = ({ onSubmitReview }) => {
  const navContainerRef = useRef(null);
  const navLinksRef = useRef(null);
  const dotsRef = useRef(null);
  const navRef = useRef(null);
  const [navPortal, setNavPortal] = useState(null);

  useEffect(() => {
    let portalContainer = document.getElementById('nav-portal');
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = 'nav-portal';
      document.body.appendChild(portalContainer);
    }
    setNavPortal(portalContainer);
  }, []);

  // Matrix effect characters - numbers only
  const matrixChars = '0123456789';

  // Matrix hover effect function with fade in/out and left-to-right animation
  const applyMatrixEffect = (element) => {
    const originalText = element.textContent;
    const letters = originalText.split('');
    
    // Clear existing spans if any
    element.innerHTML = letters.map((char, index) => 
      char === ' ' ? ' ' : `<span data-original="${char}" class="matrix-letter" style="display: inline-block; transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: scale(1); color: #f1f5f9; opacity: 1;">${char}</span>`
    ).join('');

    const letterSpans = element.querySelectorAll('.matrix-letter');

    const handleMouseEnter = () => {
      // First, fade out all letters instantly
      letterSpans.forEach((span) => {
        span.style.transition = 'none';
        span.style.opacity = '0';
        span.style.transform = 'scale(0.8) translateY(5px)';
      });

      // Then create a wave effect from left to right with fade in
      letterSpans.forEach((span, index) => {
        setTimeout(() => {
          span.style.transition = 'all 0.4s ease-out';
          span.style.opacity = '1';
          span.style.transform = 'scale(1.2) translateY(-2px)';
          span.style.textShadow = '0 0 8px rgba(241, 245, 249, 0.8)';
        }, index * 40); // Left-to-right wave progression
      });

      // Then start the matrix glitch effect from left to right
      letterSpans.forEach((span, index) => {
        const originalChar = span.getAttribute('data-original');
        if (originalChar !== ' ') {
          let glitchCount = 0;
          const maxGlitches = Math.random() * 6 + 4;
          let currentInterval;
          
          // Staggered start for each letter (left to right)
          setTimeout(() => {
            currentInterval = setInterval(() => {
              if (glitchCount < maxGlitches) {
                // Use only numbers during glitch
                const randomChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                span.textContent = randomChar;
                
                // Keep color consistent throughout animation
                const scales = [0.8, 1.3, 0.9, 1.1];
                const shadows = [
                  '0 0 5px rgba(241, 245, 249, 0.9)',
                  '0 0 10px rgba(241, 245, 249, 0.7), 0 0 20px rgba(241, 245, 249, 0.3)',
                  '0 0 15px rgba(241, 245, 249, 0.5)',
                  '0 0 8px rgba(241, 245, 249, 0.8)'
                ];
                
                const scaleIndex = glitchCount % 4;
                span.style.color = '#f1f5f9'; // Keep consistent color
                span.style.transform = `scale(${scales[scaleIndex]}) translateY(-${Math.random() * 3}px) rotate(${(Math.random() - 0.5) * 10}deg)`;
                span.style.textShadow = shadows[scaleIndex];
                span.style.filter = `blur(${Math.random() * 0.5}px) brightness(${0.8 + Math.random() * 0.4})`;
                
                glitchCount++;
              } else {
                // Smooth return to original
                span.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                span.textContent = originalChar;
                span.style.color = '#f1f5f9'; // Consistent color
                span.style.transform = 'scale(1) translateY(0px) rotate(0deg)';
                span.style.textShadow = '0 0 3px rgba(241, 245, 249, 0.4)';
                span.style.filter = 'none';
                span.style.opacity = '1';
                
                clearInterval(currentInterval);
                
                // Reset transition after animation
                setTimeout(() => {
                  span.style.transition = 'all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 300);
              }
            }, 40 + Math.random() * 40);
          }, index * 40); // Left-to-right progression
        }
      });
    };

    const handleMouseLeave = () => {
      // Smooth fade out and return animation (left to right)
      letterSpans.forEach((span, index) => {
        setTimeout(() => {
          span.style.transition = 'all 0.3s ease-out';
          span.style.opacity = '0';
          span.style.transform = 'scale(0.8) translateY(5px)';
        }, index * 20);
      });

      // Then fade back in to normal state
      setTimeout(() => {
        letterSpans.forEach((span, index) => {
          setTimeout(() => {
            span.style.transition = 'all 0.2s ease-out';
            span.style.opacity = '1';
            span.style.transform = 'scale(1) translateY(0px) rotate(0deg)';
            span.style.textShadow = 'none';
            span.style.filter = 'none';
            span.style.color = '#f1f5f9';
          }, index * 15);
        });
      }, letterSpans.length * 20 + 100);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Store the cleanup function
    element._matrixCleanup = () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  useGSAP(() => {
    if (!navPortal || !navContainerRef.current) {
      console.log('Missing portal or nav container');
      return; 
    }
    
    let currentScrollProgress = 0;
    let isHovered = false;
    
    const navContainer = navContainerRef.current;
    const navLinks = navLinksRef.current;
    const dots = dotsRef.current;
    const nav = navRef.current;
    
    gsap.set([navContainer, nav, navLinks, dots], {
      clearProps: "all"
    });
    
    gsap.set(navContainer, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(nav, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(navLinks, {
      scale: 1,
      opacity: 1,
      y: 0,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(dots, {
      scale: 1,
      opacity: 0,
      y: 10,
      pointerEvents: 'none',
      transformOrigin: "center center",
      force3D: true
    });
    
    const navLinkElements = navLinks.querySelectorAll('.nav-link');
    gsap.set(navLinkElements, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });

    // Apply matrix effect to each nav link
    navLinkElements.forEach(link => {
      applyMatrixEffect(link);
    });
    
    gsap.delayedCall(0.1, () => {
      ScrollTrigger.refresh();
      
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: '.header',
        start: 'bottom top+=100',
        end: 'bottom top+=20',
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          currentScrollProgress = self.progress;
          
          if (!isHovered && self.progress > 0) {
            const scaleValue = gsap.utils.interpolate(1, 0.7, self.progress);
            
            const scaleTl = gsap.timeline();
            
            scaleTl
              .to(navContainer, {
                scale: scaleValue,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(nav, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(navLinks, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(navLinkElements, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(dots, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0);

            if (self.progress > 0.3) {
              const linkOpacity = gsap.utils.interpolate(1, 0, (self.progress - 0.3) / 0.4);
              const linkY = gsap.utils.interpolate(0, -15, (self.progress - 0.3) / 0.4);
              
              scaleTl.to(navLinks, {
                opacity: linkOpacity,
                y: linkY,
                duration: 0.1,
                ease: 'none'
              }, 0);
            }

            if (self.progress > 0.6) {
              const dotOpacity = gsap.utils.interpolate(0, 1, (self.progress - 0.6) / 0.4);
              const dotY = gsap.utils.interpolate(10, 0, (self.progress - 0.6) / 0.4);
              
              scaleTl.to(dots, {
                opacity: dotOpacity,
                y: dotY,
                duration: 0.1,
                ease: 'none'
              }, 0);
              
              gsap.set(dots, { pointerEvents: 'auto' });
            } else {
              scaleTl.to(dots, {
                opacity: 0,
                y: 10,
                duration: 0.1,
                ease: 'none'
              }, 0);
              gsap.set(dots, { pointerEvents: 'none' });
            }
          }
        },
        onRefresh: () => {
          gsap.set(navContainer, { scale: 1, transformOrigin: "center center" });
          gsap.set(nav, { scale: 1, transformOrigin: "center center" });
          gsap.set(navLinks, { scale: 1, opacity: 1, y: 0, transformOrigin: "center center" });
          gsap.set(navLinkElements, { scale: 1, transformOrigin: "center center" });
          gsap.set(dots, { scale: 1, opacity: 0, y: 10, pointerEvents: 'none', transformOrigin: "center center" });
        }
      });

      const handleMouseEnter = () => {
        isHovered = true;
        if (currentScrollProgress > 0) {
          const expandTl = gsap.timeline();
          
          expandTl
            .to(navContainer, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to([nav, navLinks], {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(navLinkElements, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(dots, {
              scale: 1,
              opacity: 0, 
              y: 10, 
              pointerEvents: 'none', 
              duration: 0.2
            }, 0)
            .to(navLinks, { 
              opacity: 1, 
              y: 0, 
              duration: 0.3 
            }, 0.1);
        }
      };

      const handleMouseLeave = () => {
        isHovered = false;
        if (currentScrollProgress > 0) {
          const scaleValue = gsap.utils.interpolate(1, 0.7, currentScrollProgress);
          
          const compactTl = gsap.timeline();
          
          compactTl
            .to(navContainer, {
              scale: scaleValue,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to([nav, navLinks], {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(navLinkElements, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(dots, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0);

          if (currentScrollProgress > 0.3) {
            const linkOpacity = gsap.utils.interpolate(1, 0, (currentScrollProgress - 0.3) / 0.4);
            const linkY = gsap.utils.interpolate(0, -15, (currentScrollProgress - 0.3) / 0.4);
            compactTl.to(navLinks, { 
              opacity: linkOpacity, 
              y: linkY, 
              duration: 0.2 
            }, 0);
          }

          if (currentScrollProgress > 0.6) {
            const dotOpacity = gsap.utils.interpolate(0, 1, (currentScrollProgress - 0.6) / 0.4);
            const dotY = gsap.utils.interpolate(10, 0, (currentScrollProgress - 0.6) / 0.4);
            compactTl.to(dots, { 
              opacity: dotOpacity, 
              y: dotY, 
              pointerEvents: 'auto', 
              duration: 0.3 
            }, 0.1);
          } else {
            compactTl.to(dots, { 
              opacity: 0, 
              y: 10, 
              pointerEvents: 'none', 
              duration: 0.3 
            }, 0.1);
          }
        }
      };

      navContainer.addEventListener('mouseenter', handleMouseEnter);
      navContainer.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        navLinkElements.forEach(link => {
          if (link._matrixCleanup) {
            link._matrixCleanup();
          }
        });
        
        navContainer.removeEventListener('mouseenter', handleMouseEnter);
        navContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollTriggerInstance.kill();
      };
    });
  }, [navPortal]);

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
    <div className="nav-container gsap-nav" ref={navContainerRef} style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      transformOrigin: 'center center',
      zIndex: 1000,
      opacity: 1,
      animation: 'none'
    }}>
      <nav className="nav" ref={navRef}>
        <div className="nav-links" ref={navLinksRef}>
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
        </div>

        <div className="nav-dots" ref={dotsRef}>
          <div className="dot"></div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <header className="header" id='header'>
        <div className="container header-content">
          <div className="logo">
            <img src={logo} alt="VeriTrust logo" className="logo-img" />
            <h1>VeriTrust</h1>
          </div>
          <div className="nav-placeholder"></div>
          <div className="header-actions">
          </div>
        </div>
      </header>
      {navPortal && createPortal(<NavigationComponent />, navPortal)}
    </>
  );
};

export default Header;