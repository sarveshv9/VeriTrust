import React from 'react';
import '../styles/CTASection.css';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const CTASection = ({ onWriteReview, onBrowseGigs }) => {
  useGSAP(() => {
    let smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: 1,
      effects: true,
    });
  }, []);

  return (
    <div className="smooth-wrapper">
      <div className="smooth-content">
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to Transform Your Professional Reputation?</h2>
              <p>Join thousands of freelancers building tamper-proof, AI-verified reputations on blockchain.</p>
              <p>Share your experience with the community!</p>
              
              <div className="cta-buttons">
                <button onClick={onWriteReview} className="cta-button primary">
                  Write a Review
                </button>
                <button onClick={onBrowseGigs} className="cta-button secondary">
                  Browse Gigs
                </button>
              </div>
              
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Reviews Submitted</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Average Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Positive Feedback</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CTASection;
