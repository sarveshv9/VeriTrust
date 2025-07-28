import React, { useState, useMemo } from 'react';
import GigCard from './GigCard';
import { Search, Filter, Grid, List, TrendingUp } from 'lucide-react';
import '../styles/GigsSection.css';

const GigsSection = ({ searchTerm = '' }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [sampleGigs] = useState([
    {
      id: 1,
      title: "I will create a stunning modern website design with responsive layout",
      sellerName: "designpro",
      sellerLevel: "Level 2",
      sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 127,
      price: 150,
      category: "design"
    },
    {
      id: 2,
      title: "I will develop a mobile app for your business with modern UI/UX",
      sellerName: "appdeveloper",
      sellerLevel: "Top Rated",
      sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
      rating: 5.0,
      reviews: 89,
      price: 500,
      category: "development"
    },
    {
      id: 3,
      title: "I will create a professional logo design that represents your brand",
      sellerName: "logocreator",
      sellerLevel: "Level 1",
      sellerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 203,
      price: 25,
      category: "design"
    },
    {
      id: 4,
      title: "I will write compelling content for your website and blog",
      sellerName: "contentwriter",
      sellerLevel: "Top Rated",
      sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 156,
      price: 75,
      category: "writing"
    },
    {
      id: 5,
      title: "I will create professional video content for your marketing campaigns",
      sellerName: "videoproducer",
      sellerLevel: "Level 2",
      sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 94,
      price: 200,
      category: "video"
    },
    {
      id: 6,
      title: "I will provide digital marketing strategy and social media management",
      sellerName: "marketingexpert",
      sellerLevel: "Top Rated",
      sellerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 178,
      price: 120,
      category: "marketing"
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', count: sampleGigs.length },
    { id: 'design', name: 'Design', count: sampleGigs.filter(g => g.category === 'design').length },
    { id: 'development', name: 'Development', count: sampleGigs.filter(g => g.category === 'development').length },
    { id: 'writing', name: 'Writing', count: sampleGigs.filter(g => g.category === 'writing').length },
    { id: 'video', name: 'Video', count: sampleGigs.filter(g => g.category === 'video').length },
    { id: 'marketing', name: 'Marketing', count: sampleGigs.filter(g => g.category === 'marketing').length },
  ];

  const filteredAndSortedGigs = useMemo(() => {
    let filtered = sampleGigs.filter(gig => {
      const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || gig.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return filtered.sort((a, b) => b.reviews - a.reviews);
      default:
        return filtered;
    }
  }, [sampleGigs, searchTerm, categoryFilter, sortBy]);

  return (
    <section className="gigs-section" id='gigs-section'>
      <div className="container">
        <div className="section-header">
          <div className="section-title-container">
            <h2 className="section-title">
              <TrendingUp className="title-icon" size={32} />
              {searchTerm ? `Results for "${searchTerm}"` : 'Popular Services'}
            </h2>
            <p className="section-subtitle">
              Discover amazing services from talented freelancers
            </p>
          </div>

          <div className="section-controls">
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>

            <div className="sort-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${categoryFilter === category.id ? 'active' : ''}`}
                onClick={() => setCategoryFilter(category.id)}
              >
                {category.name}
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            {filteredAndSortedGigs.length} service{filteredAndSortedGigs.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className={`gigs-container ${viewMode}`}>
          {filteredAndSortedGigs.length > 0 ? (
            filteredAndSortedGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <Search size={48} />
              </div>
              <h3>No services found</h3>
              <p>Try adjusting your search terms or filters to find what you're looking for.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setCategoryFilter('all');
                  setSortBy('popular');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GigsSection;
