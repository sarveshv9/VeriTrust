import React from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';

import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

import './styles/App.css';

const App = () => {
  useSmoothScroll();

  return (
    <>
      <div id="nav-portal"></div>     
      <div className="smooth-wrapper">
        <div className="smooth-content">
          <Header />
          <Hero />
          <HowItWorks />
          <CTASection  />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;