import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Home, User, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import vtLogo from '../assets/VT_logo.png';
import '../styles/Freelancers.css';

const Freelancers = () => {
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch matching profiles
    const fetchProfiles = useCallback(async (query = '') => {
        setLoading(true);
        setError('');
        try {
            const url = query ? `/profiles?search=${encodeURIComponent(query)}` : '/profiles';
            const res = await apiFetch(url);
            if (res.ok) {
                setProfiles(res.data.data || []);
            } else {
                setError(res.data.message || 'Failed to fetch profiles.');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    // Handle search input
    const handleSearch = (e) => {
        e.preventDefault();
        fetchProfiles(searchQuery);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="freelancers-page">
            {/* ── Sidebar ── */}
            <aside className="free-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="free-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <div className="free-nav-section">
                    <div className="free-nav-label">Navigation</div>
                    <Link to="/" className="free-nav-item">
                        <Home className="nav-icon" size={18} /> Home
                    </Link>
                    <span className="free-nav-item active">
                        <Search className="nav-icon" size={18} /> Freelancers
                    </span>
                    {user?.publicKey && (
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

            {/* ── Main content ── */}
            <main className="free-main">
                <div className="free-topbar">
                    <h1 className="free-page-title">Find Trusted Freelancers</h1>
                </div>

                <div className="free-search-card glass-panel">
                    <p className="free-subtitle">
                        Discover professionals with verified identities and immutable on-chain reputation.
                    </p>
                    <form className="free-search-form" onSubmit={handleSearch}>
                        <div className="free-search-input-wrapper">
                            <Search className="free-search-icon" size={20} />
                            <input
                                type="text"
                                className="free-search-input"
                                placeholder="Search by name or occupation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary free-search-btn">
                            Search
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="free-loading"><p>Scanning the blockchain...</p></div>
                ) : error ? (
                    <div className="free-error glass-panel">
                        <p>{error}</p>
                        <button className="btn-secondary" onClick={() => fetchProfiles()}>Try Again</button>
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="free-empty glass-panel">
                        <h3>No matching freelancers found</h3>
                        <p>Try adjusting your search terms or checking back later.</p>
                    </div>
                ) : (
                    <div className="free-grid">
                        {profiles.map((profile) => (
                            <Link to={`/profile/${encodeURIComponent(profile.publicKey)}`} key={profile.publicKey} className="free-card glass-panel">
                                <div className="fc-header">
                                    <div className="fc-avatar">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="fc-identity">
                                        <h3 className="fc-name">
                                            {profile.name}
                                            <ShieldCheck className="verified-icon" size={16} title="On-chain verified" />
                                        </h3>
                                        <p className="fc-occupation">{profile.occupation}</p>
                                    </div>
                                </div>
                                <div className="fc-details">
                                    {profile.location && (
                                        <div className="fc-detail-item">
                                            <MapPin size={14} />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="fc-stats">
                                    <div className="fc-stat">
                                        <span className="fc-stat-label">Rating</span>
                                        <span className={`fc-stat-value ${profile.averageRating ? 'has-rating' : ''}`}>
                                            <Star size={14} className={profile.averageRating ? 'star-filled' : 'star-empty'} />
                                            {profile.averageRating ? profile.averageRating : 'New'}
                                        </span>
                                    </div>
                                    <div className="fc-stat">
                                        <span className="fc-stat-label">Reviews</span>
                                        <span className="fc-stat-value">{profile.reviewCount}</span>
                                    </div>
                                </div>
                                <div className="fc-footer">
                                    <span className="fc-block-info">Block #{profile.blockIndex}</span>
                                    <span className="fc-view-btn">View Profile →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Freelancers;
