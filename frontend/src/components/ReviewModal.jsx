import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import '../styles/ReviewModal.css';
import '../styles/App.css'


const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { elementRef } = useGSAP({ autoStart: isOpen });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit({ rating, review });
      onClose();
      setRating(0);
      setReview('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={elementRef}>
        <h2>Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label htmlFor="star-rating">Your Rating</label>
            <div className="star-rating" id="star-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={28}
                  className={`star-icon${i < rating ? ' filled' : ''}`}
                  onClick={() => setRating(i + 1)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
          <div className="review-section">
            <label htmlFor="review-text">Your Review</label>
            <textarea
              id="review-text"
              placeholder="Share your experience..."
              value={review}
              onChange={e => setReview(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={rating === 0}>
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
