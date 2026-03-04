import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const Dashboard = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Fetch profile on mount
    useEffect(() => {
        if (!user?.publicKey) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { ok, data } = await apiFetch(`/profile/${encodeURIComponent(user.publicKey)}`);

                if (ok) {
                    setProfile(data.data);
                    // Pre-fill the form with existing data
                    setName(data.data.name || '');
                    setOccupation(data.data.occupation || '');
                    setLocation(data.data.location || '');
                } else if (data.message === 'Profile not found') {
                    // No profile yet — user will create one
                    setProfile(null);
                } else {
                    setError(data.message || 'Failed to load profile');
                }

                // Fetch reviews for this profile
                const reviewRes = await apiFetch(`/reviews/${encodeURIComponent(user.publicKey)}`);
                if (reviewRes.ok) {
                    setReviews(reviewRes.data.data || []);
                }
            } catch (err) {
                setError('Connection error. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const isUpdate = !!profile;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const { ok, data } = await apiFetch('/profile', {
                method,
                body: JSON.stringify({ name, occupation, location, contact }),
            });

            if (ok) {
                setSuccess(isUpdate ? 'Profile updated successfully!' : 'Profile created successfully!');
                // Re-fetch profile to get updated data
                const profileRes = await apiFetch(`/profile/${encodeURIComponent(user.publicKey)}`);
                if (profileRes.ok) {
                    setProfile(profileRes.data.data);
                }
            } else {
                setError(data.message || 'Failed to save profile');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isLoggedIn) return null;

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <div>
                    <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', border: '1px solid green' }}>{success}</div>}

            {/* Profile Form */}
            <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                <h2>{profile ? 'Edit Profile' : 'Create Profile'}</h2>
                <form onSubmit={handleSubmitProfile}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="name">Name *</label><br />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="occupation">Occupation *</label><br />
                        <input
                            id="occupation"
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="location">Location</label><br />
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="contact">Contact Info</label><br />
                        <input
                            id="contact"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                            placeholder="Email, phone, etc."
                        />
                    </div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                    </button>
                </form>
            </section>

            {/* Profile Info */}
            {profile && (
                <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                    <h2>Your Profile</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Occupation:</strong> {profile.occupation}</p>
                    <p><strong>Location:</strong> {profile.location || 'Not set'}</p>
                    <p><strong>Average Rating:</strong> {profile.averageRating || 'No reviews yet'}</p>
                    <p><strong>Review Count:</strong> {profile.reviewCount}</p>
                    <p><strong>Registered:</strong> {new Date(profile.registeredAt).toLocaleDateString()}</p>
                    <p><strong>Block Index:</strong> {profile.blockIndex}</p>
                    <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                        <strong>Your Public Key:</strong> {user.publicKey?.substring(0, 80)}...
                    </p>
                </section>
            )}

            {/* Reviews Received */}
            <section style={{ padding: '1rem', border: '1px solid #ccc' }}>
                <h2>Reviews Received ({reviews.length})</h2>
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
            </section>
        </div>
    );
};

export default Dashboard;
