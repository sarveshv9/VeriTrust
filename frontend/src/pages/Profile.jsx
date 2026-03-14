import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, User, BarChart2, Search, LogOut, Plus, Code, X, GitBranch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import WriteReview from '../components/WriteReview';
import vtLogo from '../assets/VT_logo.png';
import '../styles/Profile.css';

const gigThumbnails = [
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #f59e0b, #ec4899)',
    'linear-gradient(135deg, #8b5cf6, #2dd4bf)',
    'linear-gradient(135deg, #ef4444, #f97316)',
    'linear-gradient(135deg, #14b8a6, #6366f1)',
    'linear-gradient(135deg, #06b6d4, #8b5cf6)',
];

const SERVICE_CATEGORIES = [
    "Web Development",
    "Smart Contracts",
    "Mobile Apps",
    "Databases",
    "AI & ML",
    "DevOps",
    "UI/UX Design",
    "Other",
];

const Profile = () => {
    const { publicKey } = useParams();
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New service form state
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceForm, setServiceForm] = useState({ title: '', description: '', category: SERVICE_CATEGORIES[0], price: '' });
    const [serviceError, setServiceError] = useState('');
    const [serviceSuccess, setServiceSuccess] = useState('');
    const [submittingService, setSubmittingService] = useState(false);

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
            const serviceRes = await apiFetch(`/services/${encodeURIComponent(decodedKey)}`);
            if (serviceRes.ok) {
                setServices(serviceRes.data.data || []);
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

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        setServiceError('');
        setServiceSuccess('');
        setSubmittingService(true);
        try {
            const res = await apiFetch('/service', {
                method: 'POST',
                body: JSON.stringify({
                    title: serviceForm.title,
                    description: serviceForm.description,
                    category: serviceForm.category,
                    price: parseFloat(serviceForm.price),
                }),
            });
            if (res.ok) {
                setServiceSuccess('Service added to the blockchain!');
                setServiceForm({ title: '', description: '', category: SERVICE_CATEGORIES[0], price: '' });
                setShowServiceForm(false);
                fetchData();
            } else {
                setServiceError(res.data.message || 'Failed to add service.');
            }
        } catch {
            setServiceError('Connection error. Is the backend running?');
        } finally {
            setSubmittingService(false);
        }
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

                <Link to="/" className="prof-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="prof-nav-section">
                    <div className="prof-nav-label">Navigation</div>
                    <Link to="/freelancers" className="prof-nav-item">
                        <Search className="nav-icon" size={18} /> Services
                    </Link>
                    <span className="prof-nav-item active">
                        <User className="nav-icon" size={18} /> Profile
                    </span>
                    <Link to="/dashboard" className="prof-nav-item">
                        <BarChart2 className="nav-icon" size={18} /> Dashboard
                    </Link>
                    <Link to="/explorer" className="prof-nav-item">
                        <GitBranch className="nav-icon" size={18} /> Explorer
                    </Link>
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
                            <div className="prof-stat-value">{services.length}</div>
                            <div className="prof-stat-label">Services</div>
                        </div>
                        <div className="prof-stat glass-panel">
                            <div className="prof-stat-value">{profile.location || '—'}</div>
                            <div className="prof-stat-label">Location</div>
                        </div>
                    </div>

                    <div className="prof-block-footer">
                        Blockchain Verification · Block #{profile.blockIndex}
                    </div>
                </div>

                {/* ── Services Section ── */}
                <div className="prof-services-section glass-panel">
                    <div className="prof-services-head">
                        <h2 className="prof-services-title">Services ({services.length})</h2>
                        {isOwnProfile && (
                            <button
                                className="prof-add-service-btn btn-primary"
                                onClick={() => setShowServiceForm(!showServiceForm)}
                            >
                                {showServiceForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Service</>}
                            </button>
                        )}
                    </div>

                    {/* Add Service Form */}
                    {isOwnProfile && showServiceForm && (
                        <form className="prof-service-form glass-panel" onSubmit={handleServiceSubmit}>
                            <h3 className="prof-service-form-title">New Service</h3>
                            {serviceError && <p className="prof-service-error">{serviceError}</p>}
                            <div className="prof-form-row">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={serviceForm.title}
                                    onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. I will build your React web app"
                                    required
                                    className="prof-form-input"
                                />
                            </div>
                            <div className="prof-form-row">
                                <label>Description</label>
                                <textarea
                                    value={serviceForm.description}
                                    onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Describe what you offer..."
                                    rows={3}
                                    className="prof-form-input"
                                />
                            </div>
                            <div className="prof-form-row-split">
                                <div className="prof-form-row">
                                    <label>Category *</label>
                                    <select
                                        value={serviceForm.category}
                                        onChange={e => setServiceForm(f => ({ ...f, category: e.target.value }))}
                                        className="prof-form-input"
                                    >
                                        {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="prof-form-row">
                                    <label>Starting Price ($) *</label>
                                    <input
                                        type="number"
                                        value={serviceForm.price}
                                        onChange={e => setServiceForm(f => ({ ...f, price: e.target.value }))}
                                        placeholder="e.g. 50"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="prof-form-input"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" disabled={submittingService}>
                                {submittingService ? 'Adding to blockchain...' : 'Add Service'}
                            </button>
                        </form>
                    )}
                    {serviceSuccess && <p className="prof-service-success">{serviceSuccess}</p>}

                    {/* Services Grid */}
                    {services.length === 0 ? (
                        <p className="prof-empty">
                            {isOwnProfile ? 'You have no services yet. Add one above!' : 'This freelancer has no services yet.'}
                        </p>
                    ) : (
                        <div className="prof-services-grid">
                            {services.map((service, i) => (
                                <div key={service.serviceId} className="prof-service-card glass-panel">
                                    <div
                                        className="prof-service-thumbnail"
                                        style={{ background: gigThumbnails[i % gigThumbnails.length] }}
                                    >
                                        <Code size={40} opacity={0.3} color="white" />
                                    </div>
                                    <div className="prof-service-content">
                                        <span className="prof-service-category">{service.category}</span>
                                        <h4 className="prof-service-title">{service.title}</h4>
                                        {service.description && (
                                            <p className="prof-service-desc">{service.description}</p>
                                        )}
                                    </div>
                                    <div className="prof-service-footer">
                                        <span className="prof-service-block">Block #{service.blockIndex}</span>
                                        <span className="prof-service-price">
                                            <span className="prof-service-price-label">FROM</span>
                                            <span className="prof-service-price-val">${service.price}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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