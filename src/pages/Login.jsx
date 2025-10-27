import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

export default function Login({ onLogin, adminCredentials, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === adminCredentials.username && password === adminCredentials.password) {
        onLogin();
        } else {
        setError('Invalid username or password!');
        setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="login-container">
        <div className="login-box">
            <button onClick={onClose} className="close-button">
            <X size={24} />
            </button>
            
            <div className="login-header">
            <Lock size={48} color="#0479AF" />
            <h2 className="login-title">Admin Login</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Username</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
                />
            </div>
            
            {error && (
                <div className="error-message">
                {error}
                </div>
            )}
            
            <button type="submit" className="login-button">
                Login
            </button>
            </form>
        </div>
        </div>
    );
}