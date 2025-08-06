import React, { useState } from 'react';
import { gsap } from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import './styles/App.css';

// Register plugins
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useGSAP(() => {
    // Create ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });

    // Refresh ScrollTrigger after ScrollSmoother is created
    ScrollTrigger.refresh();

    return () => {
      // Cleanup
      smoother?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSearchGig = (term) => {
    setSearchTerm(term);
    const gigsSection = document.getElementById('gigs');
    if (gigsSection) {
      gigsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWriteReview = () => {
    console.log('Write review clicked');
  };

  const handleBrowseGigs = () => {
    const gigsSection = document.getElementById('gigs');
    if (gigsSection) {
      gigsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Nav container outside smooth wrapper for proper sticky positioning */}
      <div id="nav-portal"></div>
      
      <div className="smooth-wrapper">
        <div className="smooth-content">
          <Header onSubmitReview={handleWriteReview} />
          <Hero onSearchGig={handleSearchGig} />
          <HowItWorks />
          <CTASection onWriteReview={handleWriteReview} onBrowseGigs={handleBrowseGigs} />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;