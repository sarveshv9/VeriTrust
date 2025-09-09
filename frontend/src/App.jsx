import React from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';
import useBackgroundScroll from './hooks/useBackgroundScroll';
import { useGSAPScrollZoom } from './hooks/useGSAPScrollZoom';

import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

import './styles/App.css';

const App = () => {
  useSmoothScroll();
  useBackgroundScroll(0.5);
  
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
          <Header />
          <Hero />
          <HowItWorks />
          <CTASection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;