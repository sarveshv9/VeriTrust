import React from 'react';
import { Search } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { useSearch } from '../hooks/useSearch';
import '../styles/Hero.css';
import '../styles/App.css'


const Hero = ({ onSearchGig }) => {
  const { elementRef } = useGSAP({
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.3
  });

  const { searchTerm, setSearchTerm, isSearching, handleSearch } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
      onSearchGig(searchTerm);
    }
  };

  return (
    <section className="hero" ref={elementRef} id='home'>
      <div className="hero-bg" />
      <div className="hero-content">
        <h1 className="hero-title">
          Find the perfect freelance services for your business
        </h1>
        <p className="hero-subtitle">
          Millions of people use VeriTrust to turn their ideas into reality.
        </p>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="What service are you looking for?"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search Gigs'}
            </button>
          </div>
        </form>
        <div className="popular-tags">
          <span>Popular:</span>
          {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map((tag) => (
            <button
              key={tag}
              className="tag"
              onClick={() => {
                setSearchTerm(tag);
                onSearchGig(tag);
              }}
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
