import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import '../styles/Login.css';
import bgImage from '../assets/BG.png';
import vtLogo from '../assets/VT_logo.png';

const Login = () => {
    const [privateKey, setPrivateKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, setSessionKey } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                // Try to extract just the private key part if it's from our export format
                if (content.includes('Private Key:\n')) {
                    const extractedKey = content.split('Private Key:\n')[1].trim();
                    setPrivateKey(extractedKey);
                } else {
                    setPrivateKey(content.trim());
                }
            };
            reader.readAsText(file);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!privateKey.trim()) {
            setError('Please provide a private key.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { ok, data } = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ private_key: privateKey }),
            });

            if (ok) {
                const token = data.token || data.jwt;
                if (token) {
                    login(token, data.user || {});
                    setSessionKey(privateKey); // store key in memory for signing
                    navigate('/dashboard');
                } else {
                    setError('Login successful, but no token received.');
                }
            } else {
                setError(data.message || 'Login failed. Invalid private key.');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container hero-background-container">
            <div className="auth-wrapper glass-panel">
                <div className="auth-side-image" style={{ backgroundImage: `url(${bgImage})` }}>
                    <div className="auth-image-overlay">
                        <div className="auth-top">
                            <div className="auth-logo">
                                <img src={vtLogo} alt="VeriTrust Logo" className="auth-logo-icon" />
                                <span>VeriTrust</span>
                            </div>
                            <a href="/" className="back-link">Back to website &rarr;</a>
                        </div>
                        <div className="auth-quote">
                            <h3>Secure Your Future,</h3>
                            <p>Trust the Process</p>
                        </div>
                        <div className="auth-indicators">
                            <span className="indicator"></span>
                            <span className="indicator active"></span>
                            <span className="indicator"></span>
                        </div>
                    </div>
                </div>
                <div className="auth-side-form">
                    <div className="auth-form-content">
                        <h2>Provider Login</h2>
                        <p className="subtitle">New service provider? <a href="/register">List your services</a></p>
                        <p className="subtitle" style={{ marginTop: '-8px', opacity: 0.7, fontSize: '0.8rem' }}>👥 Just browsing or leaving a review? No sign-in needed — <a href="/freelancers">explore freelancers</a></p>

                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <textarea
                                    id="privateKey"
                                    className="key-textarea"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="Enter your Private Key here..."
                                    required
                                />
                            </div>

                            <div className="file-upload-wrapper">
                                <div className="divider"><span>OR</span></div>
                                <label className="file-upload-label">
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={handleFileChange}
                                        className="file-input"
                                    />
                                    <span>📁 Upload Keys File</span>
                                </label>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" disabled={loading} className="btn-primary login-submit">
                                {loading ? 'Authenticating...' : 'Log in Securely'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
