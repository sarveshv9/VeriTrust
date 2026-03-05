import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShieldCheck, User, Home, BarChart2, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import vtLogo from '../assets/VT_logo.png';
import '../styles/WriteReviewPage.css';

const StarRating = ({ rating, onRate }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= (hovered || rating) ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onRate(star)}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                    <Star size={28} fill={star <= (hovered || rating) ? 'currentColor' : 'none'} />
                </button>
            ))}
            <span className="star-label">{rating ? `${rating} / 5` : 'Select rating'}</span>
        </div>
    );
};

const WriteReviewPage = () => {
    const { publicKey } = useParams();
    const decodedKey = decodeURIComponent(publicKey);
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState('');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Auto-clear success banner after 2.5s
    useEffect(() => {
        if (!successMsg) return;
        const t = setTimeout(() => setSuccessMsg(''), 2500);
        return () => clearTimeout(t);
    }, [successMsg]);

    // Fetch the freelancer's profile info
    const fetchProfile = useCallback(async () => {
        setLoadingProfile(true);
        try {
            const { ok, data } = await apiFetch(`/profile/${encodeURIComponent(decodedKey)}`);
            if (ok) {
                setProfile(data.data || data);
            } else {
                setProfileError(data.message || 'Could not load profile.');
            }
        } catch {
            setProfileError('Connection error.');
        } finally {
            setLoadingProfile(false);
        }
    }, [decodedKey]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            setSubmitError('Please select a star rating.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');

        try {
            const { ok, data } = await apiFetch('/review', {
                method: 'POST',
                body: JSON.stringify({
                    subjectKey: decodedKey,
                    rating: Number(rating),
                    comment: comment.slice(0, 1000),
                }),
            });

            if (ok) {
                setSuccessMsg(`Review for ${profile?.name} posted!`);
                setComment('');
                setRating(0);
            } else {
                setSubmitError(data.message || 'Failed to post review.');
            }
        } catch {
            setSubmitError('Connection error. Is the backend running?');
        } finally {
            setSubmitting(false);
        }
    };

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    return (
        <div className="wrp-page">
            {/* ── Sidebar ── */}
            <aside className="wrp-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="wrp-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <Link to="/" className="wrp-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="wrp-nav-section">
                    <div className="wrp-nav-label">Navigation</div>
                    <Link to="/freelancers" className="wrp-nav-item">
                        <Search className="nav-icon" size={18} /> Freelancers
                    </Link>
                    {user?.publicKey && (
                        <>
                            <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="wrp-nav-item">
                                <User className="nav-icon" size={18} /> Profile
                            </Link>
                            <Link to="/dashboard" className="wrp-nav-item">
                                <BarChart2 className="nav-icon" size={18} /> Dashboard
                            </Link>
                        </>
                    )}
                </div>

                {isLoggedIn && (
                    <div className="wrp-sidebar-footer">
                        <button onClick={handleLogout} className="wrp-logout-btn">
                            <LogOut className="nav-icon" size={18} /> Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* ── Main ── */}
            <main className="wrp-main">
                <div className="wrp-topbar">
                    <button className="wrp-back-btn" onClick={() => navigate('/freelancers')}>
                        <ArrowLeft size={16} />
                        Back to Freelancers
                    </button>
                </div>

                {loadingProfile ? (
                    <div className="wrp-loading">Loading freelancer info...</div>
                ) : profileError ? (
                    <div className="wrp-error">{profileError}</div>
                ) : (
                    <div className="wrp-content">
                        {/* Freelancer Identity Card */}
                        <div className="wrp-identity-card glass-panel">
                            <div className="wrp-avatar">
                                {profile?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="wrp-identity-info">
                                <h1 className="wrp-name">
                                    {profile?.name}
                                    <ShieldCheck size={18} className="wrp-verified" title="On-chain verified" />
                                </h1>
                                <p className="wrp-occupation">{profile?.occupation}</p>
                                <div className="wrp-stats">
                                    <span className="wrp-stat">
                                        <Star size={14} fill="currentColor" className="wrp-star-icon" />
                                        {profile?.averageRating ? `${profile.averageRating} avg` : 'No ratings yet'}
                                    </span>
                                    <span className="wrp-stat-divider">·</span>
                                    <span className="wrp-stat">{profile?.reviewCount || 0} reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Review Form */}
                        {!isLoggedIn ? (
                            <div className="wrp-auth-prompt glass-panel">
                                <p>You need to be logged in to leave a review.</p>
                                <Link to="/login" className="btn-primary">Log in</Link>
                            </div>
                        ) : (
                            <form className="wrp-form glass-panel" onSubmit={handleSubmit}>
                                <h2 className="wrp-form-title">Write a Review</h2>
                                <p className="wrp-form-subtitle">
                                    Share your experience working with <strong>{profile?.name}</strong>.
                                    Reviews are stored immutably on the blockchain.
                                </p>

                                {successMsg && (
                                    <div className="wrp-success-banner">
                                        <span>✓ {successMsg}</span>
                                    </div>
                                )}

                                <div className="wrp-field">
                                    <label className="wrp-label">Your Rating</label>
                                    <StarRating rating={rating} onRate={setRating} />
                                    {rating > 0 && (
                                        <span className="wrp-rating-desc">{ratingLabels[rating]}</span>
                                    )}
                                </div>

                                <div className="wrp-field">
                                    <label htmlFor="review-comment" className="wrp-label">Your Review</label>
                                    <textarea
                                        id="review-comment"
                                        className="wrp-textarea"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={`Describe your experience with ${profile?.name}...`}
                                        maxLength={1000}
                                        required
                                        rows={6}
                                    />
                                    <span className="wrp-char-count">{comment.length} / 1000</span>
                                </div>

                                {submitError && (
                                    <div className="wrp-error-msg">{submitError}</div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary wrp-submit-btn"
                                    disabled={submitting || !rating}
                                >
                                    {submitting ? 'Posting to blockchain...' : 'Post Review'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default WriteReviewPage;