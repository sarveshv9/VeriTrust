import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, User, BarChart2, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import WriteReview from '../components/WriteReview';
import vtLogo from '../assets/VT_logo.png';
import '../styles/Profile.css';

const Profile = () => {
    const { publicKey } = useParams();
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();

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
            const profileRes = await apiFetch(`/profile/${encodeURIComponent(decodedKey)}`);
            if (profileRes.ok) {
                setProfile(profileRes.data.data);
            } else {
                setError(profileRes.data.message || 'Profile not found');
                setLoading(false);
                return;
            }
            const reviewRes = await apiFetch(`/reviews/${encodeURIComponent(decodedKey)}?offset=${offset}&limit=${limit}`);
            if (reviewRes.ok) {
                setReviews(reviewRes.data.data || []);
                setTotalReviews(reviewRes.data.total || 0);
            }
        } catch {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, [decodedKey, offset]);

    useEffect(() => { fetchData(); }, [fetchData]);
    const handleReviewPosted = () => fetchData();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return <div className="prof-loading"><p>Loading profile...</p></div>;
    }

    if (error) {
        return (
            <div className="prof-error">
                <p className="prof-error-text">{error}</p>
                <Link to="/" className="prof-error-link">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* ── Sidebar ── */}
            <aside className="prof-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="prof-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <div className="prof-nav-section">
                    <div className="prof-nav-label">Navigation</div>
                    <Link to="/" className="prof-nav-item">
                        <Home className="nav-icon" size={18} /> Home
                    </Link>
                    <Link to="/freelancers" className="prof-nav-item">
                        <Search className="nav-icon" size={18} /> Freelancers
                    </Link>
                    <span className="prof-nav-item active">
                        <User className="nav-icon" size={18} /> Profile
                    </span>
                    {isOwnProfile && (
                        <Link to="/dashboard" className="prof-nav-item">
                            <BarChart2 className="nav-icon" size={18} /> Dashboard
                        </Link>
                    )}
                </div>

                {isLoggedIn && (
                    <div className="prof-sidebar-footer">
                        <button onClick={handleLogout} className="prof-logout-btn">
                            <LogOut className="nav-icon" size={18} /> Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* ── Main content ── */}
            <main className="prof-main">
                <div className="prof-topbar">
                    <h1 className="prof-page-title">Profile</h1>
                </div>

                {/* Hero card */}
                <div className="prof-hero-card glass-panel">
                    <div className="prof-identity">
                        <h2 className="prof-name">{profile.name}</h2>
                        <p className="prof-occupation">{profile.occupation}</p>
                    </div>

                    <div className="prof-stats">
                        <div className="prof-stat glass-panel">
                            <div className="prof-stat-value green">
                                {profile.averageRating || '—'}
                            </div>
                            <div className="prof-stat-label">Avg Rating</div>
                        </div>
                        <div className="prof-stat glass-panel">
                            <div className="prof-stat-value">{profile.reviewCount}</div>
                            <div className="prof-stat-label">Reviews</div>
                        </div>
                        <div className="prof-stat glass-panel">
                            <div className="prof-stat-value">{profile.location || '—'}</div>
                            <div className="prof-stat-label">Location</div>
                        </div>
                        <div className="prof-stat glass-panel">
                            <div className="prof-stat-value">{new Date(profile.registeredAt).toLocaleDateString()}</div>
                            <div className="prof-stat-label">Registered</div>
                        </div>
                    </div>

                    <div className="prof-block-footer">
                        Blockchain Verification · Block #{profile.blockIndex}
                    </div>
                </div>

                {/* Write Review */}
                {!isOwnProfile && (
                    <WriteReview subjectKey={decodedKey} onReviewPosted={handleReviewPosted} />
                )}

                {/* Reviews card */}
                <div className="prof-reviews-card glass-panel">
                    <div className="prof-reviews-head">
                        <h2 className="prof-reviews-title">Reviews ({totalReviews})</h2>
                    </div>

                    {reviews.length === 0 ? (
                        <p className="prof-empty">No reviews yet. Be the first to leave one!</p>
                    ) : (
                        reviews.map((review, i) => (
                            <div key={i} className="prof-review-item">
                                <div className="prof-review-top">
                                    <span className="prof-review-stars">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </span>
                                    <span className="prof-review-date">{new Date(review.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="prof-review-comment">"{review.comment}"</p>
                                <span className="prof-review-block">Block #{review.blockIndex}</span>
                            </div>
                        ))
                    )}

                    {totalReviews > limit && (
                        <div className="prof-pagination">
                            <button className="prof-page-btn" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
                                ← Previous
                            </button>
                            <span className="prof-page-info">
                                Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalReviews / limit)}
                            </span>
                            <button className="prof-page-btn" disabled={offset + limit >= totalReviews} onClick={() => setOffset(offset + limit)}>
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;
