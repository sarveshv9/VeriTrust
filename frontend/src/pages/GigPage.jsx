import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Star, ArrowLeft, ShieldCheck, Home, User, BarChart2,
    Search, LogOut, Clock, Tag, MapPin, Send, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import vtLogo from '../assets/VT_logo.png';
import '../styles/GigPage.css';
import '../styles/GigPageFiverr.css';
import '../styles/Freelancers.css';

/* ── Star rating display ─────────────────────── */
const StarDisplay = ({ rating, size = 16 }) => (
    <div className="gp-star-display">
        {[1, 2, 3, 4, 5].map(s => (
            <Star
                key={s}
                size={size}
                className={s <= Math.round(rating) ? 'gp-star-on' : 'gp-star-off'}
                fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
            />
        ))}
    </div>
);

/* ── Interactive star picker ──────────────────── */
const StarPicker = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return (
        <div className="gp-star-picker">
            {[1, 2, 3, 4, 5].map(s => (
                <button
                    key={s}
                    type="button"
                    className={`gp-star-pick-btn ${s <= (hovered || value) ? 'on' : ''}`}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(s)}
                    aria-label={`Rate ${s} stars`}
                >
                    <Star size={28} fill={s <= (hovered || value) ? 'currentColor' : 'none'} />
                </button>
            ))}
            {(hovered || value) > 0 && (
                <span className="gp-star-label">{labels[hovered || value]}</span>
            )}
        </div>
    );
};

/* ── Rating bar (distribution) ────────────────── */
const RatingBar = ({ count, total, stars }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="gp-rating-bar-row">
            <span className="gp-rating-bar-label">{stars} star</span>
            <div className="gp-rating-bar-track">
                <div className="gp-rating-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="gp-rating-bar-pct">{pct}%</span>
        </div>
    );
};

/* ── Gradient thumbnails ──────────────────────── */
const gradients = [
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #2dd4bf 100%)',
    'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
];

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
const GigPage = () => {
    const { publicKey, serviceId } = useParams();
    const decodedKey = decodeURIComponent(publicKey);
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    /* ── State ─────────────────────────────── */
    const [service, setService] = useState(null);
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loadingPage, setLoadingPage] = useState(true);
    const [pageError, setPageError] = useState('');
    const [offset, setOffset] = useState(0);
    const LIMIT = 10;

    /* ── Review form state ──────────────────── */
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    /* ── Reply state ────────────────────────── */
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [replyError, setReplyError] = useState('');

    /* ── Fetch page data ────────────────────── */
    const fetchData = useCallback(async () => {
        setLoadingPage(true);
        setPageError('');
        try {
            // Fetch profile
            const profileRes = await apiFetch(`/profile/${encodeURIComponent(decodedKey)}`);
            if (!profileRes.ok) { setPageError('Freelancer profile not found.'); setLoadingPage(false); return; }
            setProfile(profileRes.data.data);

            // Fetch services and find this one
            const servicesRes = await apiFetch(`/services/${encodeURIComponent(decodedKey)}`);
            if (servicesRes.ok) {
                const svc = (servicesRes.data.data || []).find(s => s.serviceId === serviceId);
                setService(svc || null);
            }

            // Fetch reviews
            const reviewRes = await apiFetch(`/reviews/${encodeURIComponent(decodedKey)}?offset=${offset}&limit=${LIMIT}`);
            if (reviewRes.ok) {
                setReviews(reviewRes.data.data || []);
                setTotalReviews(reviewRes.data.total || 0);
            }
        } catch {
            setPageError('Connection error. Is the backend running?');
        } finally {
            setLoadingPage(false);
        }
    }, [decodedKey, serviceId, offset]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Auto-dismiss success banner ────────── */
    useEffect(() => {
        if (!submitSuccess) return;
        const t = setTimeout(() => setSubmitSuccess(false), 3500);
        return () => clearTimeout(t);
    }, [submitSuccess]);

    /* ── Submit review ──────────────────────── */
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!rating) { setSubmitError('Please select a star rating.'); return; }
        setSubmitting(true); setSubmitError('');
        try {
            const { ok, data } = await apiFetch('/review', {
                method: 'POST',
                body: JSON.stringify({
                    subjectKey: decodedKey,
                    rating: Number(rating),
                    comment: comment.trim().slice(0, 1000),
                    reviewerName: reviewerName.trim() || 'Anonymous',
                }),
            });
            if (ok) {
                setSubmitSuccess(true);
                setComment(''); setRating(0); setReviewerName('');
                fetchData(); // refresh reviews
            } else {
                setSubmitError(data.message || 'Failed to post review.');
            }
        } catch { setSubmitError('Connection error.'); }
        finally { setSubmitting(false); }
    };

    /* ── Submit reply ───────────────────────── */
    const handleReplySubmit = async (e, reviewHash) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        setReplyError('');
        try {
            const { ok, data } = await apiFetch('/review/response', {
                method: 'POST',
                body: JSON.stringify({ reviewHash, response: replyText.trim() })
            });
            if (ok) {
                setReplyingTo(null);
                setReplyText('');
                fetchData(); // refresh reviews to show response
            } else {
                setReplyError(data.message || 'Failed to post response.');
            }
        } catch { setReplyError('Connection error.'); }
        finally { setSubmittingReply(false); }
    };

    /* ── Rating distribution ────────────────── */
    const ratingDist = [5, 4, 3, 2, 1].map(s => ({
        stars: s,
        count: reviews.filter(r => r.rating === s).length,
    }));

    const handleLogout = () => { logout(); navigate('/'); };

    /* ── Render ─────────────────────────────── */
    if (loadingPage) {
        return (
            <div className="gp-fullpage-center">
                <div className="gp-spinner" />
                <p>Loading gig...</p>
            </div>
        );
    }

    if (pageError || !profile) {
        return (
            <div className="gp-fullpage-center">
                <p className="gp-error-text">{pageError || 'Gig not found.'}</p>
                <Link to="/freelancers" className="gp-back-link">← Back to Services</Link>
            </div>
        );
    }

    const gradientBg = gradients[Math.abs(decodedKey.charCodeAt(10) || 0) % gradients.length];
    const avgRating = profile.averageRating
        ? parseFloat(profile.averageRating).toFixed(1)
        : null;

    return (
        <div className="gp-page">

            {/* ══════════════════════════════════
                SIDEBAR
            ══════════════════════════════════ */}
            <aside className="free-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="free-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <Link to="/" className="free-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="free-nav-section">
                    <div className="free-nav-label">Navigation</div>
                    <span className="free-nav-item active">
                        <Search className="nav-icon" size={18} /> Services
                    </span>
                    {isLoggedIn && user?.publicKey && (
                        <>
                            <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="free-nav-item">
                                <User className="nav-icon" size={18} /> Profile
                            </Link>
                            <Link to="/dashboard" className="free-nav-item">
                                <BarChart2 className="nav-icon" size={18} /> Dashboard
                            </Link>
                        </>
                    )}
                </div>

                {isLoggedIn && (
                    <div className="free-sidebar-footer">
                        <button onClick={handleLogout} className="free-logout-btn">
                            <LogOut className="nav-icon" size={18} /> Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* ══════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════ */}
            <main className="gp-main">

                {/* Back button */}
                <button className="gp-back-btn" onClick={() => navigate('/freelancers')}>
                    <ArrowLeft size={16} /> Back to Services
                </button>

                {/* ── TWO-COLUMN LAYOUT ── */}
                <div className="gp-layout">

                    {/* LEFT COL — gig details */}
                    <div className="gp-left">

                        {/* ── Breadcrumb */}
                        <div className="gp-breadcrumb">
                            <Link to="/freelancers">Services</Link>
                            <span>›</span>
                            <span>{service?.category || profile.occupation}</span>
                            <span>›</span>
                            <span>{profile.name}</span>
                        </div>

                        {/* ── Gig title */}
                        <h1 className="gp-title">
                            {service?.title || `Services by ${profile.name}`}
                        </h1>

                        {/* ── Seller strip */}
                        <div className="gp-seller-strip">
                            <div className="gp-seller-avatar">
                                {profile.name?.charAt(0).toUpperCase()}
                            </div>
                            <Link
                                to={`/profile/${encodeURIComponent(decodedKey)}`}
                                className="gp-seller-name"
                            >
                                {profile.name}
                                <ShieldCheck size={14} className="gp-verified" title="Blockchain verified" />
                            </Link>
                            {avgRating && (
                                <div className="gp-seller-rating">
                                    <StarDisplay rating={parseFloat(avgRating)} size={13} />
                                    <span className="gp-seller-rating-val">{avgRating}</span>
                                    <span className="gp-seller-rating-count">({totalReviews})</span>
                                </div>
                            )}
                        </div>

                        {/* ── Gig thumbnail */}
                        <div className="gp-thumbnail" style={{ background: gradientBg }}>
                            <div className="gp-thumbnail-inner">
                                <span className="gp-thumbnail-initial">
                                    {profile.name?.charAt(0).toUpperCase()}
                                </span>
                                {service?.category && (
                                    <span className="gp-cat-badge">{service.category}</span>
                                )}
                            </div>
                        </div>

                        {/* ── Description */}
                        {service?.description && (
                            <section className="gp-section">
                                <h2 className="gp-section-title">About This Service</h2>
                                <p className="gp-desc">{service.description}</p>
                            </section>
                        )}

                        {/* ── Seller info panel */}
                        <section className="gp-section">
                            <h2 className="gp-section-title">About the Seller</h2>
                            <div className="gp-seller-card">
                                <div className="gp-seller-card-left">
                                    <div className="gp-seller-card-avatar">
                                        {profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <Link
                                            to={`/profile/${encodeURIComponent(decodedKey)}`}
                                            className="gp-seller-card-name"
                                        >
                                            {profile.name}
                                        </Link>
                                        <p className="gp-seller-card-occ">{profile.occupation}</p>
                                        {avgRating && (
                                            <div className="gp-seller-card-rating">
                                                <StarDisplay rating={parseFloat(avgRating)} size={12} />
                                                <span>{avgRating} ({totalReviews} reviews)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="gp-seller-card-meta">
                                    {profile.location && (
                                        <span className="gp-meta-chip">
                                            <MapPin size={12} /> {profile.location}
                                        </span>
                                    )}
                                    <span className="gp-meta-chip">
                                        <ShieldCheck size={12} /> On-chain verified
                                    </span>
                                    <span className="gp-meta-chip">
                                        <Tag size={12} /> Block #{profile.blockIndex}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* ══════════════════════════════════
                             REVIEWS SECTION
                        ══════════════════════════════════ */}
                        <section className="gp-section" id="reviews">
                            <div className="gp-reviews-topbar">
                                <div className="gp-reviews-search">
                                    <input type="text" placeholder="Search reviews" className="gp-reviews-search-input" />
                                    <button className="gp-reviews-search-btn"><Search size={16} color="currentColor" /></button>
                                </div>
                                <div className="gp-reviews-sort">
                                    <span className="gp-sort-label">Sort By</span>
                                    <select className="gp-sort-select">
                                        <option>Most relevant</option>
                                        <option>Most recent</option>
                                    </select>
                                </div>
                            </div>

                            {/* Review list */}
                            {reviews.length === 0 ? (
                                <div className="gp-no-reviews">
                                    <Star size={32} className="gp-no-reviews-icon" />
                                    <p>No reviews yet — be the first!</p>
                                </div>
                            ) : (
                                <div className="gp-review-list">
                                    {reviews.map((review, i) => (
                                        <div key={i} className="gp-review-card">
                                            <div className="gp-review-header">
                                                <div className="gp-reviewer-avatar">
                                                    {(review.reviewerName || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="gp-reviewer-info">
                                                    <span className="gp-reviewer-name">
                                                        {review.reviewerName || 'Anonymous'}
                                                    </span>
                                                    <span className="gp-review-badge">✦ Repeat Client</span>
                                                </div>
                                            </div>

                                            <div className="gp-review-meta">
                                                <div className="gp-review-stars-fiverr">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} size={14} fill={idx < review.rating ? "var(--neo-accent-yellow)" : "none"} color={idx < review.rating ? "var(--neo-accent-yellow)" : "rgba(255, 255, 255, 0.2)"} />
                                                    ))}
                                                    <span className="gp-review-rating-num">{review.rating}</span>
                                                </div>
                                                <span className="gp-review-date-divider">-</span>
                                                <span className="gp-review-date">
                                                    {new Date(review.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <p className="gp-review-comment">{review.comment}</p>



                                            {review.response ? (
                                                <div className="gp-review-response-block">
                                                    <div className="gp-review-response-header">
                                                        <div className="gp-reviewer-avatar-small">
                                                            {profile?.name?.charAt(0).toUpperCase() || 'S'}
                                                        </div>
                                                        <div className="gp-response-info">
                                                            <span className="gp-response-title">Seller's Response</span>
                                                            <span className="gp-review-date-divider">-</span>
                                                            <span className="gp-review-date">
                                                                {review.responseTime ? new Date(review.responseTime).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                }) : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="gp-review-response-text">{review.response}</p>
                                                </div>
                                            ) : (isLoggedIn && user?.publicKey === decodedKey) ? (
                                                <div className="gp-review-response-form-area">
                                                    {replyingTo === review.blockHash ? (
                                                        <form className="gp-reply-form" onSubmit={(e) => handleReplySubmit(e, review.blockHash)}>
                                                            <textarea
                                                                className="gp-form-textarea gp-reply-textarea"
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                placeholder="Write your response..."
                                                                rows={3}
                                                                maxLength={1000}
                                                                required
                                                            />
                                                            <div className="gp-reply-actions">
                                                                <button type="button" className="gp-cancel-btn" onClick={() => { setReplyingTo(null); setReplyText(''); setReplyError(''); }}>Cancel</button>
                                                                <button type="submit" className="gp-submit-btn gp-reply-submit" disabled={submittingReply || !replyText.trim()}>
                                                                    {submittingReply ? 'Posting...' : 'Post Response'}
                                                                </button>
                                                            </div>
                                                            {replyError && replyingTo === review.blockHash && <div className="gp-form-error" style={{ marginTop: '10px' }}>{replyError}</div>}
                                                        </form>
                                                    ) : (
                                                        <button className="gp-review-response-btn" onClick={() => { setReplyingTo(review.blockHash); setReplyText(''); setReplyError(''); }}>
                                                            <div className="gp-reviewer-avatar-small">
                                                                {profile?.name?.charAt(0).toUpperCase() || 'S'}
                                                            </div>
                                                            <span>Add Response</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ) : null}

                                            <div className="gp-review-helpful">
                                                <span className="gp-helpful-label">Helpful?</span>
                                                <button className="gp-helpful-btn"><span>👍 Yes</span></button>
                                                <button className="gp-helpful-btn"><span>👎 No</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalReviews > LIMIT && (
                                <div className="gp-pagination">
                                    <button
                                        className="gp-page-btn"
                                        disabled={offset === 0}
                                        onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                                    >← Prev</button>
                                    <span className="gp-page-info">
                                        Page {Math.floor(offset / LIMIT) + 1} / {Math.ceil(totalReviews / LIMIT)}
                                    </span>
                                    <button
                                        className="gp-page-btn"
                                        disabled={offset + LIMIT >= totalReviews}
                                        onClick={() => setOffset(offset + LIMIT)}
                                    >Next →</button>
                                </div>
                            )}
                        </section>

                        {/* ══════════════════════════════════
                             WRITE REVIEW FORM (open to all)
                        ══════════════════════════════════ */}
                        <section className="gp-section gp-write-review-section" id="write-review">
                            <h2 className="gp-section-title">Leave a Review</h2>
                            <p className="gp-write-review-sub">
                                No sign-up required. Share your honest experience.
                            </p>

                            {submitSuccess && (
                                <div className="gp-success-banner">
                                    <CheckCircle size={18} />
                                    Review posted to the blockchain!
                                </div>
                            )}

                            <form className="gp-review-form" onSubmit={handleSubmitReview}>
                                <div className="gp-form-row">
                                    <label className="gp-form-label">
                                        Your Name <span className="gp-optional">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="gp-form-input"
                                        value={reviewerName}
                                        onChange={e => setReviewerName(e.target.value)}
                                        placeholder="e.g. Sarah K. — leave blank to post anonymously"
                                        maxLength={100}
                                    />
                                </div>

                                <div className="gp-form-row">
                                    <label className="gp-form-label">Your Rating *</label>
                                    <StarPicker value={rating} onChange={setRating} />
                                </div>

                                <div className="gp-form-row">
                                    <label className="gp-form-label">Your Review *</label>
                                    <textarea
                                        className="gp-form-textarea"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder={`How was your experience with ${profile.name}?`}
                                        rows={5}
                                        maxLength={1000}
                                        required
                                    />
                                    <span className="gp-char-count">{comment.length} / 1000</span>
                                </div>

                                {submitError && (
                                    <div className="gp-form-error">{submitError}</div>
                                )}

                                <button
                                    type="submit"
                                    className="gp-submit-btn"
                                    disabled={submitting || !rating}
                                >
                                    {submitting ? (
                                        'Posting to blockchain...'
                                    ) : (
                                        <><Send size={15} /> Post Review</>
                                    )}
                                </button>
                            </form>
                        </section>

                    </div>

                    {/* ══════════════════════════════════
                        RIGHT COL — sticky order card
                    ══════════════════════════════════ */}
                    <div className="gp-right">
                        <div className="gp-order-tabs">
                            <button className="gp-tab active">Basic</button>
                            <button className="gp-tab">Standard</button>
                            <button className="gp-tab">Premium</button>
                        </div>
                        <div className="gp-order-panel">
                            {service ? (
                                <>
                                    <div className="gp-order-price-row">
                                        <span className="gp-order-total">${service.price} ⓘ</span>
                                    </div>
                                    <div className="gp-order-save">
                                        Save up to 20% with <span className="text-green-500 font-bold">Subscribe to Save</span> ⓘ
                                    </div>

                                    <div className="gp-order-title-fiverr">
                                        <strong>Basic Package</strong> {service.description ? service.description.slice(0, 100) : 'Frontend development following client provide figma design 1-3 static page'}
                                    </div>

                                    <div className="gp-order-meta-fiverr">
                                        <span className="gp-order-meta-item">
                                            <Clock size={16} /> 4-day delivery
                                        </span>
                                        <span className="gp-order-meta-item">
                                            <Tag size={16} /> Unlimited Revisions
                                        </span>
                                    </div>

                                    <div className="gp-order-whats-included">
                                        <span>What's Included</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="gp-order-title">{profile.name}</h3>
                                    <p className="gp-order-desc">{profile.occupation}</p>
                                    <div className="gp-order-price-row">
                                        <span className="gp-order-total">Contact for pricing ⓘ</span>
                                    </div>
                                </>
                            )}

                            <button className="gp-order-request-btn">Request to order</button>

                            <button className="gp-order-contact-btn">
                                Contact me <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                            </button>

                            <div className="gp-order-consultation">
                                💼 Offers paid consultations
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default GigPage;
