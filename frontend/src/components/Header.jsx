import React from 'react';
import { Bell, MessageCircle, Heart, User } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import '../styles/Header.css';
import '../styles/App.css'

const Header = ({ onSubmitReview }) => {
  const { elementRef } = useGSAP();

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  return (
     <header className="header" ref={elementRef}>
      <div className="container header-content">
        <div className="logo">
          <h1>VeriTrust</h1>
        </div>
          <div className="nav-container">
            <nav className="nav">
              <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              <a href="#gigs-section" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('gigs-section'); }}>Explore</a>
              <a href="#how-it-works" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How it Works</a>
              <a href="#footer" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }}>Support</a>
            </nav>
          </div>
        <div className="header-actions">
          <button className="submit-review-btn" onClick={onSubmitReview}>Write a Review</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
