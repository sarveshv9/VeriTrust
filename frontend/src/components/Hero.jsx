import React from 'react';
import { Search } from 'lucide-react';
import '../styles/Hero.css';

const Hero = ({ onSearchGig }) => {
  const handleTagClick = (tag) => {
    if (onSearchGig) {
      onSearchGig(tag);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.querySelector('.search-input');
    if (searchInput.value.trim() && onSearchGig) {
      onSearchGig(searchInput.value.trim());
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1 className="hero-title">
          Find the perfect freelance services for your business
        </h1>
        <p className="hero-subtitle">
          Millions of people use VeriTrust to turn their ideas into reality.
        </p>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="What service are you looking for?"
              name="search"
            />
            <button className="search-btn" type="submit">
              Search
            </button>
          </div>
        </form>
        <div className="popular-tags">
          <span>Popular:</span>
          {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map((tag) => (
            <button
              key={tag}
              className="tag"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;