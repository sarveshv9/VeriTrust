import React from 'react';
import '../styles/CTASection.css';

// --- Optimization: Data-driven UI ---
// Define stat data as a constant array *outside* the component.
// This prevents the array from being recreated on every render.
// It's also far more readable and maintainable; to add a new stat,
// you just add an object to this array.
const statsData = [
  { number: '10,000+', label: 'Reviews Submitted' },
  { number: '4.8', label: 'Average Rating' },
  { number: '95%', label: 'Positive Feedback' },
];

// --- Optimization: Memoization ---
// We wrap the component in `React.memo`. Since this is a largely
// static component, this prevents it from re-rendering if the parent
// component re-renders for other reasons, as long as the
// `onWriteReview` and `onBrowseGigs` props don't change.
const CTASection = React.memo(({ onWriteReview, onBrowseGigs }) => {
  return (
    // --- Optimization: Accessibility ---
    // By adding an `id` to the heading and `aria-labelledby` to the
    // section, we create a strong accessible name for this
    // region, which is great for screen reader navigation.
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-container">
        <div className="cta-content">
          <h2 id="cta-heading">
            Ready to Transform Your Professional Reputation?
          </h2>
          <p>
            Join thousands of freelancers building tamper-proof, AI-verified
            reputations on blockchain.
          </p>
          <p>Share your experience with the community!</p>

          <div className="cta-buttons">
            <button
              onClick={onWriteReview}
              className="cta-button primary"
              aria-label="Write a review for the community"
            >
              Write a Review
            </button>
            <button
              onClick={onBrowseGigs}
              className="cta-button secondary"
              aria-label="Browse available gigs"
            >
              Browse Gigs
            </button>
          </div>

          {/* --- Optimization: Readability & Maintainability --- */}
          {/*
            Instead of hard-coding three separate blocks, we now map
            over the `statsData` array. This is cleaner, DRY (Don't
            Repeat Yourself), and much easier to manage.
            A `key` prop is added for React's reconciliation algorithm.
          */}
          <div className="stats">
            {statsData.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// --- Optimization: Best Practices ---
// Add a `displayName` for better debugging. This is especially
// helpful when using `React.memo` as it prevents the component
// from showing up as `Anonymous` in React DevTools.
CTASection.displayName = 'CTASection';

// --- Optimization: Error Handling ---
// Provide default empty functions for the onClick props.
// This is a crucial best practice that prevents the component
// from crashing with a "prop is not a function" error if the
// parent component forgets to pass them.
CTASection.defaultProps = {
  onWriteReview: () => {},
  onBrowseGigs: () => {},
};

export default CTASection;