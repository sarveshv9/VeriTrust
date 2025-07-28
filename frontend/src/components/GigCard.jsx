import React, { useState } from 'react';
import { Star, Heart, ExternalLink, User, Shield, Award } from 'lucide-react';
import '../styles/GigCard.css';

const GigCard = ({ gig }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleCardClick = () => {
    console.log('Viewing gig:', gig.title);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star-icon ${index < Math.floor(rating) ? 'filled' : ''}`}
        size={14}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'}
      />
    ));
  };

  const getLevelBadge = (level) => {
    const levelMap = {
      'Top Rated': { class: 'top-rated', icon: Award },
      'Level 2': { class: 'pro', icon: Shield },
      'Level 1': { class: 'basic', icon: User },
    };
    
    const levelInfo = levelMap[level] || levelMap['Level 1'];
    const IconComponent = levelInfo.icon;
    
    return (
      <div className={`seller-level ${levelInfo.class}`}>
        <IconComponent size={12} />
        {level}
      </div>
    );
  };

  return (
      <div className="gig-card" onClick={handleCardClick}>
        <div className="gig-image">
          <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
            <img
              src={gig.image}
              alt={gig.title}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop';
              }}
            />
            {!imageLoaded && (
              <div className="image-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
          
          <div className="gig-badge">
            Featured
          </div>
          
          <button
            className={`heart-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
          >
            <Heart
              className="heart-icon"
              size={18}
              fill={isFavorited ? '#ef4444' : 'none'}
            />
          </button>
        </div>

        <div className="gig-content">
          <div className="seller-info">
            <div className="seller-avatar-container">
              <img
                src={gig.sellerAvatar}
                alt={gig.sellerName}
                className="seller-avatar"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';
                }}
              />
              <div className="online-indicator"></div>
            </div>
            <div className="seller-details">
              <div className="seller-name">{gig.sellerName}</div>
              {getLevelBadge(gig.sellerLevel)}
            </div>
          </div>

          <h3 className="gig-title">{gig.title}</h3>

          <div className="gig-rating">
            <div className="stars">
              {renderStars(gig.rating)}
            </div>
            <span className="rating-value">{gig.rating}</span>
            <span className="reviews-count">({gig.reviews} reviews)</span>
          </div>

          <div className="gig-footer">
            <div className="price-container">
              <span className="starting-from">Starting at</span>
              <span className="gig-price">${gig.price}</span>
            </div>
            <button className="quick-view-btn">
              <ExternalLink size={14} />
              View Details
            </button>
          </div>
        </div>
      </div>
  );
};

export default GigCard;
