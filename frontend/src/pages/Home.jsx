import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [dealOnly, setDealOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    let url = `${API_BASE}/api/products?`;
    if (category) url += `category=${category}&`;
    if (dealOnly) url += `deal=true&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    if (search) url += `search=${search}&`;

    try {
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, dealOnly, maxPrice, search]);

  const toggleWishlist = async (id) => {
    if (!user) return alert('Please login to save to wishlist');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_BASE}/api/auth/wishlist/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      alert('Error updating wishlist');
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: '320px',
        backgroundImage: 'linear-gradient(rgba(13,14,18,0.75), rgba(13,14,18,0.95)), url("https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 40px'
      }}>
        <span style={{ color: '#ff2a2a', letterSpacing: '2px', fontWeight: 'bold', fontSize: '13px' }}>PRO RACING & TOURING</span>
        <h1 style={{ fontSize: '50px', margin: '4px 0 8px', color: '#fff', fontFamily: 'Teko, sans-serif' }}>GEAR UP FOR THE UNTAMED RIDE</h1>
        <p style={{ maxWidth: '580px', color: '#9ca3af', fontSize: '15px' }}>
          Explore certified helmets, race leather jackets, and Kevlar-reinforced gloves built for maximum performance.
        </p>
      </div>

      <div style={{ maxWidth: '1280px', margin: 'auto', padding: '30px 20px' }}>
        {/* Category Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', background: '#15171e', border: '1px solid #232733', padding: '12px', borderRadius: '8px' }}>
          {['All Gears', 'Helmets', 'Jackets', 'Gloves'].map(cat => {
            const actualCat = cat === 'All Gears' ? '' : cat;
            const isSelected = category === actualCat;
            return (
              <button 
                key={cat}
                onClick={() => setCategory(actualCat)}
                style={{
                  padding: '8px 20px',
                  background: isSelected ? '#ff2a2a' : '#1f232e',
                  color: isSelected ? '#fff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Price Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '24px 0', alignItems: 'center' }}>
          <input 
            placeholder="Search gear..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ width: '250px' }} 
          />
          <input 
            placeholder="Max Price (₹)" 
            type="number" 
            value={maxPrice} 
            onChange={e => setMaxPrice(e.target.value)} 
            style={{ width: '150px' }} 
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#f3f4f6', fontSize: '14px' }}>
            <input type="checkbox" checked={dealOnly} onChange={e => setDealOnly(e.target.checked)} />
            ⚡ Flash Deals Only
          </label>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map(p => {
            const displayImg = (p.images && p.images[0]) || p.imageUrl;
            return (
              <div 
                key={p._id} 
                style={{
                  background: '#15171e',
                  border: '1px solid #232733',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <button 
                  onClick={() => toggleWishlist(p._id)}
                  style={{ position: 'absolute', top: 22, right: 22, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', padding: '6px 8px', cursor: 'pointer', zIndex: 2 }}
                >
                  {wishlist.includes(p._id) ? '❤️' : '🤍'}
                </button>

                <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                  <img src={displayImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {p.isDealOfTheDay && (
                  <span style={{ position: 'absolute', top: 22, left: 22, background: '#ff2a2a', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                    TRACK DEAL
                  </span>
                )}

                <h3 style={{ fontSize: '18px', margin: '14px 0 6px', color: '#fff' }}>{p.name}</h3>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 14px' }}>{p.category} • {p.specifications?.safetyCert || 'Certified'}</p>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff2a2a' }}>₹{p.price.toLocaleString()}</span>
                    <span style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '14px' }}>₹{p.originalPrice?.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                    <Link 
                      to={`/product/${p._id}`} 
                      style={{ textAlign: 'center', background: '#232733', color: '#fff', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}
                    >
                      Specs
                    </Link>
                    <Link 
                      to={`/checkout/${p._id}`} 
                      style={{ textAlign: 'center', background: '#ff2a2a', color: '#fff', padding: '10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}