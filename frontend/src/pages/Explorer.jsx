import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, GitBranch, Home, Search, BarChart2, User, ChevronDown, ChevronUp, Cpu, Lock, Unlock, LogOut } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import vtLogo from '../assets/VT_logo.png';
import '../styles/Explorer.css';

const truncateHash = (h) => h ? `${h.slice(0, 10)}…${h.slice(-8)}` : '—';
const truncateKey = (k) => k ? `${k.slice(0, 12)}…${k.slice(-8)}` : '—';

const TX_LABELS = {
    GENESIS: { label: 'Genesis', color: '#a78bfa' },
    REGISTER_PROFILE: { label: 'Register Profile', color: '#38bdf8' },
    UPDATE_PROFILE: { label: 'Update Profile', color: '#34d399' },
    ADD_SERVICE: { label: 'Add Service', color: '#fbbf24' },
    POST_REVIEW: { label: 'Post Review', color: '#f87171' },
    REVIEW_RESPONSE: { label: 'Review Response', color: '#fb923c' },
};

// ─── TransactionRow ──────────────────────────────────────────────────────────
const TransactionRow = ({ tx }) => {
    const meta = TX_LABELS[tx.type] || { label: tx.type, color: '#94a3b8' };

    return (
        <div className="exp-tx-row">
            <span className="exp-tx-type" style={{ borderColor: meta.color, color: meta.color }}>
                {meta.label}
            </span>

            {tx.type === 'POST_REVIEW' && (
                <div className="exp-tx-body">
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Rating</span>
                        <span>
                            {tx.rating !== undefined
                                ? '★'.repeat(tx.rating) + '☆'.repeat(5 - tx.rating)
                                : 'No rating'}
                        </span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Reviewer</span>
                        <span>{tx.reviewerName || 'Anonymous'}</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Comment</span>
                        <span className="exp-tx-comment">"{tx.comment?.slice(0, 120)}{tx.comment?.length > 120 ? '…' : ''}"</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Verified</span>
                        {tx.verified ? (
                            <span className="exp-sig-badge exp-sig-ok">
                                <Lock size={11} /> Cryptographically Signed
                            </span>
                        ) : (
                            <span className="exp-sig-badge exp-sig-anon">
                                <Unlock size={11} /> Anonymous
                            </span>
                        )}
                    </div>
                    {tx.reviewerKey && (
                        <div className="exp-tx-detail">
                            <span className="exp-detail-label">Reviewer Key</span>
                            <span className="exp-tx-hash">{truncateKey(tx.reviewerKey)}</span>
                        </div>
                    )}
                </div>
            )}

            {(tx.type === 'REGISTER_PROFILE' || tx.type === 'UPDATE_PROFILE') && (
                <div className="exp-tx-body">
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Name</span>
                        <span>{tx.name}</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Occupation</span>
                        <span>{tx.occupation}</span>
                    </div>
                    {tx.location && (
                        <div className="exp-tx-detail">
                            <span className="exp-detail-label">Location</span>
                            <span>{tx.location}</span>
                        </div>
                    )}
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Signed</span>
                        {tx.signed ? (
                            <span className="exp-sig-badge exp-sig-ok"><Lock size={11} /> Yes</span>
                        ) : (
                            <span className="exp-sig-badge exp-sig-anon"><Unlock size={11} /> No</span>
                        )}
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Public Key</span>
                        <span className="exp-tx-hash">{truncateKey(tx.publicKey)}</span>
                    </div>
                </div>
            )}

            {tx.type === 'ADD_SERVICE' && (
                <div className="exp-tx-body">
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Title</span>
                        <span>{tx.title}</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Category</span>
                        <span>{tx.category}</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Price</span>
                        <span>${tx.price}</span>
                    </div>
                    <div className="exp-tx-detail">
                        <span className="exp-detail-label">Signed</span>
                        {tx.signed ? (
                            <span className="exp-sig-badge exp-sig-ok"><Lock size={11} /> Yes</span>
                        ) : (
                            <span className="exp-sig-badge exp-sig-anon"><Unlock size={11} /> No</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── BlockCard ───────────────────────────────────────────────────────────────
const BlockCard = ({ block, isGenesis }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`exp-block-card ${isGenesis ? 'exp-genesis' : ''}`}>
            {/* Chain connector */}
            {!isGenesis && <div className="exp-chain-line" />}

            <div className={`exp-block-header ${expanded ? 'active' : ''}`} onClick={() => setExpanded(e => !e)}>
                <div className="exp-block-index">
                    <span className="exp-block-num">#{block.index}</span>
                    {isGenesis && <span className="exp-genesis-badge">GENESIS</span>}
                </div>

                <div className="exp-block-hashes">
                    <div className="exp-hash-row">
                        <span className="exp-hash-label">Hash</span>
                        <span className="exp-hash-val exp-hash-current">{truncateHash(block.hash)}</span>
                    </div>
                    <div className="exp-hash-row">
                        <span className="exp-hash-label">Prev</span>
                        <span className="exp-hash-val">{truncateHash(block.previousHash)}</span>
                    </div>
                </div>

                <div className="exp-block-meta">
                    <div className="exp-pow-badge">
                        <Cpu size={12} />
                        {block.nonce !== undefined
                            ? <><strong>PoW</strong> nonce: {block.nonce}</>
                            : <span className="exp-legacy">Legacy block</span>}
                    </div>
                    <div className="exp-block-time">
                        {new Date(block.timestamp).toLocaleString()}
                    </div>
                    <div className="exp-tx-count">
                        {block.transactions.length} tx{block.transactions.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <button className="exp-expand-btn">
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {expanded && (
                <div className="exp-block-body">
                    {block.transactions && block.transactions.length > 0 ? (
                        block.transactions.map((tx, i) => (
                            <TransactionRow key={i} tx={tx} />
                        ))
                    ) : (
                        <div className="exp-empty-tx">No transactions in this block</div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Explorer ────────────────────────────────────────────────────────────────
const Explorer = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [isValidChain, setIsValidChain] = useState(null);

    const [copyText, setCopyText] = useState('Copy');
    const copyKey = () => {
        if (user?.publicKey) {
            navigator.clipboard.writeText(user.publicKey);
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        }
    };

    const fetchChain = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { ok, data } = await apiFetch('/chain');
            if (ok && data.data) {
                setChain(data.data);
                // Validate chain locally
                const chainData = data.data;
                let valid = true;
                for (let i = 1; i < chainData.length; i++) {
                    if (chainData[i].previousHash !== chainData[i - 1].hash) {
                        valid = false;
                        break;
                    }
                }
                setIsValidChain(valid);
            } else {
                setError('Failed to load blockchain data.');
            }
        } catch {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchChain(); }, [fetchChain]);

    const handleLogout = () => { logout(); navigate('/'); };

    // Filter blocks by search term
    const filteredChain = search.trim()
        ? chain.filter(block => {
            const s = search.toLowerCase();
            return (
                block.hash?.toLowerCase().includes(s) ||
                block.previousHash?.toLowerCase().includes(s) ||
                block.transactions.some(tx =>
                    JSON.stringify(tx).toLowerCase().includes(s)
                )
            );
        })
        : chain;

    const totalTx = chain.reduce((sum, b) => sum + b.transactions.length, 0);
    const powBlocks = chain.filter(b => b.nonce !== undefined).length;

    return (
        <div className="exp-page">
            {/* ── Sidebar ── */}
            <aside className="exp-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                <Link to="/" className="exp-sidebar-brand">
                    <img src={vtLogo} alt="VeriTrust" />
                    <span>VeriTrust</span>
                </Link>

                <Link to="/" className="exp-back-home-btn">
                    <Home size={16} /> Back to Home
                </Link>

                <div className="exp-nav-section">
                    <div className="exp-nav-label">Navigation</div>
                    <Link to="/freelancers" className="exp-nav-item">
                        <Search className="nav-icon" size={18} /> Services
                    </Link>
                    {isLoggedIn && user?.publicKey && (
                        <>
                            <Link to={`/profile/${encodeURIComponent(user.publicKey)}`} className="exp-nav-item">
                                <User className="nav-icon" size={18} /> Profile
                            </Link>
                            <Link to="/dashboard" className="exp-nav-item">
                                <BarChart2 className="nav-icon" size={18} /> Dashboard
                            </Link>
                        </>
                    )}
                    <span className="exp-nav-item active">
                        <GitBranch className="nav-icon" size={18} /> Explorer
                    </span>
                </div>

                {isLoggedIn && (
                    <div className="exp-sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid var(--neo-border-color)' }}>
                        <button onClick={handleLogout} className="dash-logout-btn">
                            <LogOut className="nav-icon" size={18} /> Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* ── Main content ── */}
            <main className="exp-main">
                {/* Header */}
                <div className="exp-topbar">
                    <h1 className="exp-page-title">Explorer</h1>
                    <div className="exp-topbar-right">
                        {isValidChain !== null && (
                            <div className={`exp-status-pill ${isValidChain ? 'valid' : 'invalid'}`}>
                                <span className="exp-status-dot"></span>
                                <span>{isValidChain ? 'Chain Valid' : 'Chain Broken'}</span>
                            </div>
                        )}
                        {user?.publicKey && (
                            <div className="dash-wallet-pill" style={{ margin: 0 }}>
                                <span className="dash-wallet-dot"></span>
                                <span>{truncateKey(user.publicKey)}</span>
                                <button onClick={copyKey} className="dash-wallet-copy">{copyText}</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                {!loading && !error && (
                    <div className="exp-stats-row">
                        <div className="exp-stat glass-panel">
                            <span className="exp-stat-val">{chain.length}</span>
                            <span className="exp-stat-lbl">Blocks</span>
                        </div>
                        <div className="exp-stat glass-panel">
                            <span className="exp-stat-val">{totalTx}</span>
                            <span className="exp-stat-lbl">Txs</span>
                        </div>
                        <div className="exp-stat glass-panel">
                            <span className="exp-stat-val">{powBlocks}</span>
                            <span className="exp-stat-lbl">PoW</span>
                        </div>
                        <div className="exp-stat glass-panel">
                            <span className="exp-stat-val">2</span>
                            <span className="exp-stat-lbl">TARGET</span>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="exp-search-row">
                    <Search size={18} className="exp-search-icon" />
                    <input
                        className="exp-search-input"
                        placeholder="Search by hash, public key, or transaction..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <span className="exp-search-result-count">
                            {filteredChain.length} block{filteredChain.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Chain */}
                {loading && <div className="exp-loading">⛏ Scanning the chain…</div>}
                {error && <div className="exp-error">{error}</div>}

                {!loading && !error && (
                    <div className="exp-chain">
                        {filteredChain.length === 0 ? (
                            <div className="exp-empty">No blocks found</div>
                        ) : (
                            [...filteredChain].reverse().map((block) => (
                                <BlockCard
                                    key={block.hash}
                                    block={block}
                                    isGenesis={block.index === 0}
                                />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Explorer;
