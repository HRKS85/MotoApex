import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate authenticated user session on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0e12', color: '#ff2a2a', fontSize: '24px', fontFamily: 'Teko, sans-serif' }}>
        STARTING UP MOTOGEAR HUB...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <BrowserRouter>
        <div className="app-container">
          {/* Header Navigation */}
          <nav className="navbar">
            <Link to="/" className="brand-logo">
              🏍️ MOTOGEAR <span>HUB</span>
            </Link>

            <div className="nav-links">
              <Link to="/" className="nav-item">Store Catalog</Link>

              {user ? (
                <>
                  <div className="user-badge">
                    <span>{user.name}</span>
                    <span className="user-role-tag">{user.role}</span>
                  </div>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Admin Console
                    </Link>
                  )}

                  <button onClick={logout} className="btn-outline">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-item">Sign In</Link>
                  <Link to="/register" className="btn-primary">Get Started</Link>
                </>
              )}
            </div>
          </nav>

          {/* Core Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route 
                path="/checkout/:id" 
                element={user ? <Checkout /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin" 
                element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="footer">
            <p>© {new Date().getFullYear()} <span className="footer-highlight">MotoGear Hub</span>. Built for high-speed track days and cross-country adventures.</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}