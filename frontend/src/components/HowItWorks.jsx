import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => (
  <section className="how-it-works" id='how-it-works'>
    <div className="container">
      <h2>How It Works</h2>
      <div className="steps">      
      <div className="steps">
        {/* Step 1 */}
        <div className="step">
          <div className="step-icon">🔗</div>
          <h3>Connect Web3 Wallet</h3>
          <p>Link your decentralized identity (MetaMask) to own your reputation data forever.</p>
        </div>

        {/* Step 2 */}
        <div className="step">
          <div className="step-icon">🤖</div>
          <h3>AI-Verified Matching</h3>
          <p>Our AI analyzes skills, past work, and reputation to find the perfect freelancer match.</p>
        </div>

        {/* Step 3 */}
        <div className="step">
          <div className="step-icon">⛓️</div>
          <h3>Blockchain Transactions</h3>
          <p>Secure, transparent payments via smart contracts with immutable work records.</p>
        </div>

        {/* Step 4 */}
        <div className="step">
          <div className="step-icon">🛡️</div>
          <h3>AI-Analyzed Reviews</h3>
          <p>Submit Proof-of-Work reviews that are AI-validated for authenticity and stored permanently on blockchain.</p>
        </div>
       </div> 
      </div>
    </div>
  </section>
);

export default HowItWorks;
