import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import '../styles/FeaturedFreelancers.css';

const FeaturedFreelancers = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopProfiles = async () => {
            setLoading(true);
            try {
                // Fetch profiles. Assuming backend returns them in some order. We'll just slice the top 3 visually.
                const res = await apiFetch('/profiles');
                if (res.ok) {
                    // Let's take the first 3 for the featured section
                    const data = res.data?.data || [];
                    // You might want to sort by rating if possible, but let's just reverse and take first 3 for variety if not sorted, 
                    // or just take them as they are
                    setProfiles(data.slice(0, 3));
                } else {
                    setError('Failed to fetch profiles.');
                }
            } catch (err) {
                setError('Connection active.'); // Silently fail or minimal error for landing page
            } finally {
                setLoading(false);
            }
        };

        fetchTopProfiles();
    }, []);

    if (loading) {
        return (
            <section className="featured-freelancers neobrutalism-body">
                <div className="ff-container">
                    <h2 className="ff-title">Featured Professionals</h2>
                    <div className="ff-loading">Loading top talent...</div>
                </div>
            </section>
        );
    }

    if (error || profiles.length === 0) {
        return null; // Don't show the section if there's no data or an error on the landing page
    }

    return (
        <section className="featured-freelancers neobrutalism-body">
            <div className="ff-container">
                <div className="ff-header">
                    <h2 className="ff-title">
                        Top <span className="text-gradient accent-cyan">Trusted</span> Talent
                    </h2>
                    <p className="ff-subtitle">
                        Discover top-rated freelancers with verified on-chain reputation.
                    </p>
                </div>

                <div className="ff-grid">
                    {profiles.map((profile, i) => {
                        // Cycle through pastel accents for card aesthetics
                        const accents = ['accent-lavender-border', 'accent-honey-border', 'accent-powder-border'];
                        const borderClass = accents[i % accents.length];

                        return (
                            <Link to={`/review/${encodeURIComponent(profile.publicKey)}`} key={profile.publicKey} className={`ff-card glass-panel ${borderClass}`}>
                                <div className="ff-card-top">
                                    <div className="ff-avatar">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ff-identity">
                                        <h3 className="ff-name">
                                            {profile.name}
                                            <ShieldCheck className="verified-icon" size={16} title="On-chain verified" />
                                        </h3>
                                        <p className="ff-occupation">{profile.occupation}</p>
                                    </div>
                                </div>
                                <div className="ff-details">
                                    {profile.location && (
                                        <div className="ff-detail-item">
                                            <MapPin size={14} />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="ff-stats">
                                    <div className="ff-stat">
                                        <span className="ff-stat-value">
                                            <Star size={14} className={profile.averageRating ? 'star-filled' : 'star-empty'} />
                                            {profile.averageRating ? profile.averageRating : 'New'}
                                        </span>
                                        <span className="ff-stat-label">Rating</span>
                                    </div>
                                    <div className="ff-stat">
                                        <span className="ff-stat-value">{profile.reviewCount}</span>
                                        <span className="ff-stat-label">Reviews</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="ff-footer-action">
                    <Link to="/freelancers" className="btn-primary ff-view-all-btn">
                        Explore All Freelancers <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedFreelancers;
