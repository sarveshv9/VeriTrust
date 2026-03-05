import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Link2, Clock, Hash, Database } from 'lucide-react';
import '../styles/BlockchainVisualizer.css';

const BlockchainVisualizer = () => {
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChain = async () => {
            try {
                const { ok, data } = await apiFetch('/chain');
                if (ok && data.data) {
                    setChain(data.data);
                } else {
                    setError('Failed to load blockchain data.');
                }
            } catch (err) {
                setError('Connection error fetching blockchain.');
            } finally {
                setLoading(false);
            }
        };

        fetchChain();
    }, []);

    const truncateHash = (hash) => {
        if (!hash) return '';
        if (hash === '0') return '0x000...000';
        return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="blockchain-visualizer">
                <div className="loading-state">Loading Blockchain Data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blockchain-visualizer">
                <div className="empty-state">{error}</div>
            </div>
        );
    }

    if (!chain || chain.length === 0) {
        return null;
    }

    return (
        <div className="blockchain-visualizer">
            <div className="blockchain-header">
                <h3>Blockchain Ledger</h3>
                <p>Live visualization of the immutable Gig Reputation Chain. Every block secures your profile and reviews.</p>
            </div>

            <div className="blockchain-scroll-container">
                {chain.map((block, index) => (
                    <div key={block.hash || index} className="block-card-wrapper">
                        <div className={`block-card ${block.index === 0 ? 'genesis' : ''}`}>
                            <div className="block-header">
                                <span className="block-index">Block #{block.index}</span>
                                <span className={`block-badge ${block.index === 0 ? 'genesis' : ''}`}>
                                    {block.index === 0 ? 'Genesis' : 'Valid'}
                                </span>
                            </div>

                            <div className="block-detail">
                                <span className="block-detail-label"><Clock size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Timestamp</span>
                                <span className="block-detail-value time">{formatDate(block.timestamp)}</span>
                            </div>

                            <div className="block-detail">
                                <span className="block-detail-label"><Hash size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Block Hash</span>
                                <span className="block-detail-value hash" title={block.hash}>
                                    {truncateHash(block.hash)}
                                </span>
                            </div>

                            <div className="block-detail">
                                <span className="block-detail-label"><Link2 size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Previous Hash</span>
                                <span className="block-detail-value" title={block.previousHash}>
                                    {truncateHash(block.previousHash)}
                                </span>
                            </div>

                            <div className="block-transactions">
                                <span style={{ display: 'flex', alignItems: 'center' }}><Database size={12} style={{ marginRight: '4px' }} /> Transactions</span>
                                <span className="tx-count">{block.transactions ? block.transactions.length : 0}</span>
                            </div>
                        </div>

                        {index < chain.length - 1 && (
                            <Link2 className="chain-link" size={24} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainVisualizer;
