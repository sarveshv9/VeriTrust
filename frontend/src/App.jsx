import React from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';
// import useBackgroundScroll from './hooks/useBackgroundScroll'; // Removed this line
import { useGSAPScrollZoom } from './hooks/useGSAPScrollZoom';

import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CustomCursor from './components/elements/CustomCursor';

import './styles/App.css';

const App = () => {
  useSmoothScroll();
  // useBackgroundScroll(0.2); // Removed this line to disable parallax
  
  const zoomRef = useGSAPScrollZoom({
    maxScale: 1.25,
    minScale: 1,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  });

  return (
    <>
      <div id="nav-portal"></div>     
      <div className="smooth-wrapper">
        <div className="smooth-content">
          {/* New container for Header and Hero */}
          <div className="hero-background-container">
            <Header />
            <Hero />
          </div>
          <HowItWorks />
          <CTASection />
          <Footer />
        </div>
      </div>
      <CustomCursor />
    </>
  );
};

export default App;