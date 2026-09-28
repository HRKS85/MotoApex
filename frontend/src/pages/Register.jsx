import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', pincode: '', role: 'user' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/register`, formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(item => item.msg));
      } else {
        setErrors([err.response?.data?.message || 'Registration failed']);
      }
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '50px auto', padding: '32px', background: '#15171e', borderRadius: '12px', border: '1px solid #232733' }}>
      <h2 style={{ fontSize: '32px', margin: '0 0 10px', color: '#ff2a2a', fontFamily: 'Teko, sans-serif' }}>CREATE RIDER PROFILE</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>Register to purchase and unlock track day offers.</p>

      {errors.length > 0 && (
        <div style={{ color: '#ff6b6b', background: '#3b1212', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
          {errors.map((err, i) => <p key={i} style={{ margin: '2px 0' }}>• {err}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          placeholder="Full Name" 
          required 
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          autoComplete="name"
        />
        <input 
          placeholder="Email Address" 
          type="email" 
          required 
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
          autoComplete="email"
        />
        <input 
          placeholder="Password (min 6 characters)" 
          type="password" 
          required 
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })} 
          autoComplete="new-password"
        />
        <input 
          placeholder="Phone (10 digits)" 
          required 
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })} 
          autoComplete="tel"
        />
        <input 
          placeholder="Pincode (6 digits)" 
          required 
          value={formData.pincode}
          onChange={e => setFormData({ ...formData, pincode: e.target.value })} 
          autoComplete="postal-code"
        />
        
        <label style={{ fontSize: '13px', color: '#9ca3af' }}>Select Role:</label>
        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
          <option value="user">User Account</option>
          <option value="admin">Admin Account</option>
        </select>

        <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px', fontWeight: 'bold' }}>
          JOIN THE SQUAD
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
        Already registered? <Link to="/login" style={{ color: '#ff2a2a', textDecoration: 'none' }}>Log In</Link>
      </p>
    </div>
  );
}