import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import WriteReview from '../components/WriteReview';

const Profile = () => {
    const { publicKey } = useParams();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const limit = 10;

    const decodedKey = decodeURIComponent(publicKey);
    const isOwnProfile = user?.publicKey === decodedKey;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch profile
            const profileRes = await apiFetch(`/profile/${encodeURIComponent(decodedKey)}`);

            if (profileRes.ok) {
                setProfile(profileRes.data.data);
            } else {
                setError(profileRes.data.message || 'Profile not found');
                setLoading(false);
                return;
            }

            // Fetch reviews
            const reviewRes = await apiFetch(`/reviews/${encodeURIComponent(decodedKey)}?offset=${offset}&limit=${limit}`);
            if (reviewRes.ok) {
                setReviews(reviewRes.data.data || []);
                setTotalReviews(reviewRes.data.total || 0);
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, [decodedKey, offset]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReviewPosted = () => {
        // Refresh both profile (for updated rating) and reviews
        fetchData();
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/">← Home</Link>
                {isOwnProfile && <Link to="/dashboard" style={{ marginLeft: '1rem' }}>Dashboard</Link>}
            </div>

            {/* Profile Info */}
            <section style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
                <h1>{profile.name}</h1>
                <p><strong>Occupation:</strong> {profile.occupation}</p>
                <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                <p><strong>Average Rating:</strong> {profile.averageRating ? `${profile.averageRating}/5` : 'No reviews yet'}</p>
                <p><strong>Reviews:</strong> {profile.reviewCount}</p>
                <p><strong>Registered:</strong> {new Date(profile.registeredAt).toLocaleDateString()}</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    <strong>Block:</strong> #{profile.blockIndex}
                </p>
            </section>

            {/* Write Review (only if viewing someone else's profile and logged in) */}
            {!isOwnProfile && (
                <WriteReview subjectKey={decodedKey} onReviewPosted={handleReviewPosted} />
            )}

            {/* Reviews List */}
            <section style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
                <h2>Reviews ({totalReviews})</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                            <p><strong>Rating:</strong> {'⭐'.repeat(review.rating)} ({review.rating}/5)</p>
                            <p>{review.comment}</p>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                                {new Date(review.timestamp).toLocaleDateString()} | Block #{review.blockIndex}
                            </p>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {totalReviews > limit && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button
                            disabled={offset === 0}
                            onClick={() => setOffset(Math.max(0, offset - limit))}
                        >
                            ← Previous
                        </button>
                        <span>Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalReviews / limit)}</span>
                        <button
                            disabled={offset + limit >= totalReviews}
                            onClick={() => setOffset(offset + limit)}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Profile;
