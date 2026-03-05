import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, User, BarChart2, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import vtLogo from '../assets/VT_logo.png';
import BlockchainVisualizer from '../components/BlockchainVisualizer';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copyText, setCopyText] = useState('Copy');

    const [name, setName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => { if (!isLoggedIn) navigate('/login'); }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (!user?.publicKey) return;
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { ok, data } = await apiFetch(`/profile/${encodeURIComponent(user.publicKey)}`);
                if (ok) {
                    setProfile(data.data);
                    setName(data.data.name || '');
                    setOccupation(data.data.occupation || '');
                    setLocation(data.data.location || '');
                    setContact(data.data.contact || '');
                } else if (data.message === 'Profile not found') {
                    setProfile(null);
                } else {
                    setError(data.message || 'Failed to load profile');
                }
                const reviewRes = await apiFetch(`/reviews/${encodeURIComponent(user.publicKey)}`);
                if (reviewRes.ok) setReviews(reviewRes.data.data || []);
            } catch {
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
        try {
            const { ok, data } = await apiFetch('/profile', {
                method: isUpdate ? 'PUT' : 'POST',
                body: JSON.stringify({ name, occupation, location, contact }),
            });
            if (ok) {
                setSuccess(isUpdate ? 'Profile updated!' : 'Profile created!');
                const profileRes = await apiFetch(`/profile/${encodeURIComponent(user.publicKey)}`);
                if (profileRes.ok) setProfile(profileRes.data.data);
                setRefreshTrigger(prev => prev + 1);
            } else {
                setError(data.message || 'Failed to save profile');
            }
        } catch {
            setError('Connection error.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const copyKey = () => {
        if (user?.publicKey) {
            navigator.clipboard.writeText(user.publicKey);
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        }
    };

    const truncateKey = (key) => `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;

    if (!isLoggedIn) return null;

    if (loading) {
        return <div className="dash-loading"><p>Loading dashboard...</p></div>;
    }

    return (
        <div className="dashboard-page">
            {/* ── Sidebar ── */}
            <aside className="dash-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="dash-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <Link to="/" className="dash-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="dash-nav-section">
                    <div className="dash-nav-label">Navigation</div>
                    <Link to="/freelancers" className="dash-nav-item">
                        <Search className="nav-icon" size={18} /> Freelancers
                    </Link>
                    {profile && (
                        <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="dash-nav-item">
                            <User className="nav-icon" size={18} /> Profile
                        </Link>
                    )}
                    <Link to="/dashboard" className="dash-nav-item active">
                        <BarChart2 className="nav-icon" size={18} /> Dashboard
                    </Link>

                </div>

                <div className="dash-sidebar-footer">
                    <button onClick={handleLogout} className="dash-logout-btn">
                        <LogOut className="nav-icon" size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className="dash-main">
                {/* Top bar */}
                <div className="dash-topbar">
                    <h1 className="dash-page-title">Dashboard</h1>
                    {user?.publicKey && (
                        <div className="dash-wallet-pill">
                            <span className="dash-wallet-dot"></span>
                            <span>{truncateKey(user.publicKey)}</span>
                            <button onClick={copyKey} className="dash-wallet-copy">{copyText}</button>
                        </div>
                    )}
                </div>

                {error && <div className="dash-alert dash-alert-error">{error}</div>}
                {success && <div className="dash-alert dash-alert-success">{success}</div>}

                {/* Stats row */}
                {profile && (
                    <div className="dash-stats-row">
                        <div className="dash-stat-card glass-panel">
                            <div className="dash-stat-label">Average Rating</div>
                            <div className="dash-stat-value green">
                                {profile.averageRating ? profile.averageRating : '—'}
                            </div>
                            <div className="dash-stat-sub">out of 5.0</div>
                        </div>
                        <div className="dash-stat-card glass-panel">
                            <div className="dash-stat-label">Total Reviews</div>
                            <div className="dash-stat-value">{profile.reviewCount}</div>
                            <div className="dash-stat-sub">received</div>
                        </div>
                        <div className="dash-stat-card glass-panel">
                            <div className="dash-stat-label">Block Index</div>
                            <div className="dash-stat-value">#{profile.blockIndex}</div>
                            <div className="dash-stat-sub">on chain</div>
                        </div>
                        <div className="dash-stat-card glass-panel">
                            <div className="dash-stat-label">Status</div>
                            <div className="dash-stat-value green">Active</div>
                            <div className="dash-stat-sub">verified</div>
                        </div>
                    </div>
                )}

                {/* Two-column grid */}
                <div className="dash-grid">
                    {/* Left: Edit form */}
                    <div className="dash-card glass-panel">
                        <div className="dash-card-head">
                            <h3 className="dash-card-title">{profile ? 'Edit Profile' : 'Create Profile'}</h3>
                        </div>
                        <form onSubmit={handleSubmitProfile} className="dash-form">
                            <div className="dash-field">
                                <label htmlFor="name">Full Name *</label>
                                <input id="name" type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                            </div>
                            <div className="dash-field">
                                <label htmlFor="occupation">Occupation *</label>
                                <input id="occupation" type="text" className="form-input" value={occupation} onChange={e => setOccupation(e.target.value)} required placeholder="Freelance Designer" />
                            </div>
                            <div className="dash-field">
                                <label htmlFor="location">Location</label>
                                <input id="location" type="text" className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                            </div>
                            <div className="dash-field">
                                <label htmlFor="contact">Contact</label>
                                <input id="contact" type="text" className="form-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="Email or website" />
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                                {submitting ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                            </button>
                        </form>
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {profile ? (
                            <div className="dash-card glass-panel">
                                <div className="dash-card-head">
                                    <h3 className="dash-card-title">Account Details</h3>
                                </div>
                                <div className="dash-info-list">
                                    <div className="dash-info-row">
                                        <span className="dash-info-label">Name</span>
                                        <span className="dash-info-value">{profile.name}</span>
                                    </div>
                                    <div className="dash-info-row">
                                        <span className="dash-info-label">Occupation</span>
                                        <span className="dash-info-value">{profile.occupation}</span>
                                    </div>
                                    <div className="dash-info-row">
                                        <span className="dash-info-label">Location</span>
                                        <span className="dash-info-value">{profile.location || '—'}</span>
                                    </div>
                                    <div className="dash-info-row">
                                        <span className="dash-info-label">Registered</span>
                                        <span className="dash-info-value">{new Date(profile.registeredAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="dash-info-row">
                                        <span className="dash-info-label">Public Key</span>
                                        <span className="dash-info-value mono">{truncateKey(user.publicKey)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="dash-card glass-panel">
                                <div className="dash-card-head">
                                    <h3 className="dash-card-title">Welcome to VeriTrust</h3>
                                </div>
                                <p className="dash-welcome">
                                    You haven't created your profile yet. Fill out the form to register on the blockchain and start building your trusted reputation.
                                </p>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="dash-card glass-panel">
                            <div className="dash-card-head">
                                <h3 className="dash-card-title">Recent Reviews</h3>
                            </div>
                            {reviews.length === 0 ? (
                                <p className="dash-empty">No reviews received yet.</p>
                            ) : (
                                <>
                                    {reviews.slice(0, 4).map((review, i) => (
                                        <div key={i} className="dash-review-item">
                                            <div className="dash-review-top">
                                                <span className="dash-review-stars">
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </span>
                                                <span className="dash-review-date">{new Date(review.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="dash-review-comment">"{review.comment}"</p>
                                            <span className="dash-review-block">Block #{review.blockIndex}</span>
                                        </div>
                                    ))}
                                    {reviews.length > 4 && (
                                        <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="dash-view-all">
                                            View all {reviews.length} reviews →
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <BlockchainVisualizer refreshTrigger={refreshTrigger} />
            </main>
        </div>
    );
};

export default Dashboard;