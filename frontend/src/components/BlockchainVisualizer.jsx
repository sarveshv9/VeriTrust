import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../utils/api';
import { Star, User, Link2, Shield, GitBranch } from 'lucide-react';
import '../styles/BlockchainVisualizer.css';

/* ─── Helpers ─────────────────────────────────────────── */
const truncateKey = (key) => {
    if (!key) return '???';
    return `${key.substring(0, 6)}…${key.substring(key.length - 4)}`;
};
const truncateHash = (hash) => {
    if (!hash || hash === '0') return '0x000…000';
    return `${hash.substring(0, 6)}…${hash.substring(hash.length - 4)}`;
};
const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
};
const starBar = (rating) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

/* ─── BlockchainVisualizer ────────────────────────────── */
const BlockchainVisualizer = ({ refreshTrigger = 0 }) => {
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState({});   // freelancerKey → bool

    useEffect(() => {
        const fetchChain = async () => {
            try {
                const { ok, data } = await apiFetch('/chain');
                if (ok && data.data) {
                    setChain(data.data);
                } else {
                    setError('Failed to load blockchain data.');
                }
            } catch {
                setError('Connection error fetching blockchain.');
            } finally {
                setLoading(false);
            }
        };
        fetchChain();
    }, [refreshTrigger]);

    /* ─── Build tree data from raw chain ─────────────── */
    const { freelancers, reviewsMap, genesisBlock, nameMap } = useMemo(() => {
        if (!chain.length) return { freelancers: [], reviewsMap: {}, genesisBlock: null, nameMap: {} };

        const genesis = chain[0];
        const nameMap = {};      // publicKey → name
        const freelancers = [];  // { publicKey, name, occupation, block, ... }
        const reviewsMap = {};   // publicKey → [{ rating, comment, reviewer, block, hash, ts }]
        const seenKeys = new Set();

        for (const block of chain) {
            for (const tx of block.transactions) {
                if (tx.type === 'REGISTER_PROFILE' || tx.type === 'UPDATE_PROFILE') {
                    nameMap[tx.publicKey] = tx.name || truncateKey(tx.publicKey);
                    if (!seenKeys.has(tx.publicKey)) {
                        seenKeys.add(tx.publicKey);
                        freelancers.push({
                            publicKey: tx.publicKey,
                            name: tx.name || truncateKey(tx.publicKey),
                            occupation: tx.occupation || '',
                            blockIndex: block.index,
                            blockHash: block.hash,
                            timestamp: block.timestamp,
                        });
                    } else {
                        const fl = freelancers.find(f => f.publicKey === tx.publicKey);
                        if (fl) {
                            if (tx.name) fl.name = tx.name;
                            if (tx.occupation) fl.occupation = tx.occupation;
                            fl.blockIndex = block.index;
                            fl.blockHash = block.hash;
                            fl.timestamp = block.timestamp;
                        }
                    }
                }
                if (tx.type === 'POST_REVIEW') {
                    if (!reviewsMap[tx.subjectKey]) reviewsMap[tx.subjectKey] = [];
                    reviewsMap[tx.subjectKey].push({
                        rating: tx.rating,
                        comment: tx.comment,
                        reviewerKey: tx.reviewerKey,
                        blockIndex: block.index,
                        blockHash: block.hash,
                        timestamp: block.timestamp,
                    });
                }
            }
        }

        return { freelancers, reviewsMap, genesisBlock: genesis, nameMap };
    }, [chain]);

    const toggleExpand = (key) =>
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    /* ─── Render ──────────────────────────────────────── */
    if (loading) {
        return (
            <div className="blockchain-visualizer">
                <div className="bv-empty bv-loading">Scanning the chain…</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="blockchain-visualizer">
                <div className="bv-empty bv-error">{error}</div>
            </div>
        );
    }
    if (!chain.length) return null;

    const totalReviews = Object.values(reviewsMap).reduce((s, r) => s + r.length, 0);

    return (
        <div className="blockchain-visualizer">

            {/* ── Header ── */}
            <div className="bv-header">
                <div className="bv-header-left">
                    <GitBranch size={18} />
                    <div>
                        <h3>Review Chain</h3>
                        <p>{chain.length} blocks · {freelancers.length} profiles · {totalReviews} reviews</p>
                    </div>
                </div>
                <div className="bv-header-badge">
                    <Shield size={12} /> Immutable
                </div>
            </div>

            {/* ── Tree ── */}
            <div className="bv-tree">

                {/* Genesis root */}
                <div className="bv-root-node">
                    <div className="bv-node bv-node-genesis">
                        <span className="bv-node-label">GENESIS</span>
                        <span className="bv-node-meta">Block #0 · {formatDate(genesisBlock?.timestamp)}</span>
                        <span className="bv-node-hash">{truncateHash(genesisBlock?.hash)}</span>
                    </div>
                    <div className="bv-trunk-line" />
                </div>

                {/* Freelancer level */}
                {freelancers.length === 0 ? (
                    <div className="bv-empty">No profiles on chain yet.</div>
                ) : (
                    <div className="bv-freelancer-row">
                        {freelancers.map((fl, fi) => {
                            const reviews = reviewsMap[fl.publicKey] || [];
                            const avg = reviews.length
                                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                                : null;
                            const isOpen = expanded[fl.publicKey];
                            const isLast = fi === freelancers.length - 1;

                            return (
                                <div key={fl.publicKey} className={`bv-freelancer-col ${isLast ? 'last' : ''}`}>
                                    {/* Horizontal branch connector */}
                                    <div className="bv-branch-line" />

                                    {/* Freelancer card */}
                                    <div
                                        className={`bv-node bv-node-profile ${isOpen ? 'open' : ''}`}
                                        onClick={() => reviews.length && toggleExpand(fl.publicKey)}
                                        style={{ cursor: reviews.length ? 'pointer' : 'default' }}
                                        title={fl.publicKey}
                                    >
                                        <div className="bv-node-icon"><User size={14} /></div>
                                        <span className="bv-node-label">{fl.name}</span>
                                        <span className="bv-node-meta">{fl.occupation || 'Freelancer'}</span>
                                        <div className="bv-node-footer">
                                            <span className="bv-block-tag">Block #{fl.blockIndex}</span>
                                            {avg && (
                                                <span className="bv-rating-tag">★ {avg}</span>
                                            )}
                                            {reviews.length > 0 && (
                                                <span className="bv-review-count-tag">
                                                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                        {reviews.length > 0 && (
                                            <span className="bv-expand-hint">
                                                {isOpen ? '▲ collapse' : '▼ expand reviews'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Review sub-tree */}
                                    {isOpen && reviews.length > 0 && (
                                        <div className="bv-reviews-subtree">
                                            <div className="bv-sub-trunk" />
                                            <div className="bv-review-row">
                                                {reviews.map((rev, ri) => (
                                                    <div key={ri} className="bv-review-col">
                                                        <div className="bv-sub-branch-line" />
                                                        <div className="bv-node bv-node-review">
                                                            <div className="bv-stars">{starBar(rev.rating)}</div>
                                                            <span className="bv-node-label bv-review-comment">
                                                                "{rev.comment.length > 60
                                                                    ? rev.comment.substring(0, 60) + '…'
                                                                    : rev.comment}"
                                                            </span>
                                                            <span className="bv-node-meta">
                                                                By {nameMap[rev.reviewerKey] || truncateKey(rev.reviewerKey)}
                                                            </span>
                                                            <div className="bv-node-footer">
                                                                <span className="bv-block-tag">Block #{rev.blockIndex}</span>
                                                                <span className="bv-date-tag">{formatDate(rev.timestamp)}</span>
                                                            </div>
                                                            <span className="bv-hash-small">{truncateHash(rev.blockHash)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockchainVisualizer;
