import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email: forgotEmail });
      setForgotMsg(`Code: ${res.data.resetCode || 'Token generated!'}`);
      setForgotStep(2);
    } catch (err) {
      setForgotMsg(err.response?.data?.message || 'Email not found');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, {
        email: forgotEmail,
        resetCode,
        newPassword
      });
      alert('Password updated! You can now log in.');
      setShowForgot(false);
      setForgotStep(1);
    } catch (err) {
      setForgotMsg(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '80px auto', padding: '32px', background: '#15171e', borderRadius: '12px', border: '1px solid #232733' }}>
      <h2 style={{ fontSize: '32px', margin: '0 0 10px', color: '#ff2a2a', fontFamily: 'Teko, sans-serif' }}>RIDER LOGIN</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>Sign in to manage your garage, orders, and wishlist.</p>
      
      {error && <div style={{ color: '#ff6b6b', background: '#3b1212', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={() => { setShowForgot(true); setForgotMsg(''); }} 
            style={{ background: 'none', border: 'none', color: '#ff2a2a', cursor: 'pointer', fontSize: '13px' }}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '12px', fontWeight: 'bold' }}>
          IGNITE & LOGIN
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
        Don't have an account? <Link to="/register" style={{ color: '#ff2a2a', textDecoration: 'none' }}>Sign Up</Link>
      </p>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#15171e', border: '1px solid #232733', padding: '30px', borderRadius: '12px', maxWidth: '380px', width: '90%' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 10px', color: '#ff2a2a', fontFamily: 'Teko, sans-serif' }}>RESET PASSWORD</h3>
            {forgotMsg && <p style={{ color: '#facc15', fontSize: '13px', marginBottom: '10px' }}>{forgotMsg}</p>}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestToken} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="email" placeholder="Enter Registered Email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Code</button>
                  <button type="button" onClick={() => setShowForgot(false)} className="btn-outline">Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="6-digit Code" required value={resetCode} onChange={e => setResetCode(e.target.value)} />
                <input type="password" placeholder="New Password (min 6 chars)" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: '#22c55e' }}>Set Password</button>
                  <button type="button" onClick={() => setShowForgot(false)} className="btn-outline">Close</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}