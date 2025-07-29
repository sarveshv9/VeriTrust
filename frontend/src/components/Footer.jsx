import React from 'react';
import '../styles/Footer.css';
import '../styles/App.css'


const Footer = () => (
  <footer className="footer" id='footer'>
    <div className="footer-container">
      <div className="footer-content">
        {/* Company Info Section */}
        <div className="footer-section company-info">
          <h3 className="footer-logo">VeriTrust</h3>
          <p className="footer-description">
            Connect with top freelancers worldwide. Quality services, secure payments, and exceptional results.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <span>📧</span>
            </a>
            <a href="#" className="social-link">
              <span>💬</span>
            </a>
            <a href="#" className="social-link">
              <span>📱</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#services">Browse Services</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#live-chat">Live Chat</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-section">
          <h4>Get in Touch</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>support@veritrust.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💬</span>
              <span>Live Chat Available 24/7</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📚</span>
              <span>Visit our Help Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 VeriTrust. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
