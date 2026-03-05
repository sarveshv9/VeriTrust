import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const WriteReview = ({ subjectKey, onReviewPosted }) => {
    const { isLoggedIn } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isLoggedIn) {
        return (
            <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
                <p><a href="/login">Log in</a> to write a review.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const { ok, data } = await apiFetch('/review', {
                method: 'POST',
                body: JSON.stringify({
                    subjectKey,
                    rating: Number(rating),
                    comment: comment.slice(0, 1000),
                }),
            });

            if (ok) {
                setSuccess('Review posted successfully!');
                setComment('');
                setRating(5);
                if (onReviewPosted) onReviewPosted();
            } else {
                setError(data.message || 'Failed to post review');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
            <h3>Write a Review</h3>

            {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '0.5rem' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor="rating">Rating: </label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4)</option>
                        <option value={3}>⭐⭐⭐ (3)</option>
                        <option value={2}>⭐⭐ (2)</option>
                        <option value={1}>⭐ (1)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor="comment">Comment:</label><br />
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                        required
                        rows={4}
                        style={{ width: '100%' }}
                        placeholder="Write your review..."
                    />
                    <small>{comment.length}/1000 characters</small>
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Review'}
                </button>
            </form>
        </div>
    );
};

export default WriteReview;
