import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, ShieldCheck, Home, User, BarChart2, LogOut, Code, Database, Monitor, Cpu, Smartphone, GitBranch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import vtLogo from '../assets/VT_logo.png';
import '../styles/Freelancers.css';

// Mock gig thumbnails (Since real ones don't exist in backend yet)
const gigThumbnails = [
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #f59e0b, #ec4899)',
    'linear-gradient(135deg, #8b5cf6, #2dd4bf)',
    'linear-gradient(135deg, #ef4444, #f97316)',
    'linear-gradient(135deg, #14b8a6, #6366f1)',
    'linear-gradient(135deg, #06b6d4, #8b5cf6)',
];

const categories = [
    { name: "Web Development", icon: <Monitor size={18} /> },
    { name: "Smart Contracts", icon: <Code size={18} /> },
    { name: "Mobile Apps", icon: <Smartphone size={18} /> },
    { name: "Databases", icon: <Database size={18} /> },
    { name: "AI & ML", icon: <Cpu size={18} /> },
];

const getThumbnail = (index) => gigThumbnails[index % gigThumbnails.length];

const Freelancers = () => {
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('');

    const fetchServices = useCallback(async (query = '', category = '') => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (query) params.set('search', query);
            if (category) params.set('category', category);
            const url = `/services${params.toString() ? '?' + params.toString() : ''}`;
            const res = await apiFetch(url);
            if (res.ok) {
                setServices(res.data.data || []);
            } else {
                setError(res.data.message || 'Failed to fetch services.');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchServices(searchQuery, activeCategory);
    };

    const handleCategoryClick = (categoryName) => {
        if (activeCategory === categoryName) {
            setActiveCategory('');
            fetchServices(searchQuery, '');
        } else {
            setActiveCategory(categoryName);
            fetchServices(searchQuery, categoryName);
        }
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

                <Link to="/" className="free-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="free-nav-section">
                    <div className="free-nav-label">Navigation</div>
                    <span className="free-nav-item active">
                        <Search className="nav-icon" size={18} /> Services
                    </span>
                    {user?.publicKey && (
                        <>
                            <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="free-nav-item">
                                <User className="nav-icon" size={18} /> Profile
                            </Link>
                            <Link to="/dashboard" className="free-nav-item">
                                <BarChart2 className="nav-icon" size={18} /> Dashboard
                            </Link>
                            <Link to="/explorer" className="free-nav-item">
                                <GitBranch className="nav-icon" size={18} /> Explorer
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
                {/* ── Header Area ── */}
                <div className="free-hero-section glass-panel">
                    <h1 className="free-hero-title">Programming & Tech</h1>
                    <p className="free-hero-subtitle">You bring the vision, we'll build the code.</p>
                    <form className="fiverr-search-form" onSubmit={handleSearch}>
                        <div className="fiverr-search-wrapper">
                            <input
                                type="text"
                                className="fiverr-search-input"
                                placeholder="What service are you looking for today?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="fiverr-search-btn btn-primary">
                                <Search size={20} /> Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Categories ── */}
                <div className="free-categories-scroll">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            className={`free-category-chip ${activeCategory === cat.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            {cat.icon}
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* ── Content Area ── */}
                <div className="free-results-header">
                    <h2>Explore Services</h2>
                    <span className="free-results-count">{services.length} services available</span>
                </div>

                {loading ? (
                    <div className="free-loading"><p>Scanning the blockchain...</p></div>
                ) : error ? (
                    <div className="free-error glass-panel">
                        <p>{error}</p>
                        <button className="btn-secondary" onClick={() => fetchServices()}>Try Again</button>
                    </div>
                ) : services.length === 0 ? (
                    <div className="free-empty glass-panel">
                        <h3>No services found</h3>
                        <p>Freelancers haven't posted services yet, or try adjusting your search.</p>
                    </div>
                ) : (
                    <div className="gig-grid">
                        {services.map((service, index) => (
                            <Link
                                to={`/gig/${encodeURIComponent(service.publicKey)}/${service.serviceId}`}
                                key={service.serviceId || index}
                                className="gig-card glass-panel"
                            >
                                {/* Thumbnail */}
                                <div
                                    className="gig-thumbnail"
                                    style={{ background: getThumbnail(index) }}
                                >
                                    <div className="gig-thumbnail-overlay">
                                        <Code size={48} />
                                    </div>
                                    <span className="gig-category-badge">{service.category}</span>
                                </div>

                                <div className="gig-content">
                                    {/* Seller Info */}
                                    <div className="gig-seller">
                                        <div className="gig-avatar">
                                            {service.sellerName?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="gig-seller-info">
                                            <span className="gig-seller-name">
                                                {service.sellerName}
                                                <ShieldCheck className="verified-icon" size={14} title="On-chain verified" />
                                            </span>
                                            <span className="gig-seller-level">{service.sellerOccupation}</span>
                                        </div>
                                    </div>

                                    {/* Real service title from blockchain */}
                                    <h3 className="gig-title">{service.title}</h3>

                                    {/* Rating */}
                                    <div className="gig-rating-container">
                                        <Star size={14} className="star-filled" />
                                        <span className="gig-rating-score">
                                            {service.averageRating ? service.averageRating : '5.0'}
                                        </span>
                                        <span className="gig-rating-count">({service.reviewCount || 0})</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="gig-footer">
                                    <div className="gig-heart">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </div>
                                    <div className="gig-price">
                                        <span className="gig-price-label">STARTING AT</span>
                                        <span className="gig-price-value">${service.price}</span>
                                    </div>
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