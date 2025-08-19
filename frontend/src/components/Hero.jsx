import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';
import SparkleButton from '../assets/SparkleButton.jsx'

const Hero = ({ onSearchGig }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
      return () => heroSection.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleSubmit = () => {
    if (onSearchGig) {
      onSearchGig('get-started');
    }
  };

  return (
    <section id="hero-section" className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className={`hero-title ${isLoaded ? 'loaded' : ''}`}>
          Reputation You Own. Trust You Earn.
        </h1>

        <p className="hero-subtitle">
          Empowering trust in the future of work.
        </p>

        <div className="submit-form">
          <SparkleButton text="Submit Now" onClick={handleSubmit} />
        </div>
      </div>
    </section>
  );
};

export default Hero;