import React from 'react';
import '../styles/CTASection.css';
import '../styles/App.css'


const CTASection = ({ onWriteReview, onBrowseGigs }) => (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Transform Your Professional Reputation?</h2>
        <p className="cta-text">
          Join thousands of freelancers building tamper-proof, AI-verified reputations on blockchain.<br />
          Share your experience with the community!
        </p>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={onWriteReview}>
            Write a Review
          </button>
          <button className="cta-secondary" onClick={onBrowseGigs}>
            Browse Gigs
          </button>
        </div>
        <div className="cta-stats">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Reviews Submitted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Positive Feedback</div>
          </div>
        </div>
      </div>
    </section>
);

export default CTASection;
