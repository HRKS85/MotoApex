import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to load product detail', err));
  }, [id]);

  if (!product) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading specifications...</div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div style={{ maxWidth: '1150px', margin: '40px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
      {/* Slider View */}
      <div>
        <div style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #232733', backgroundColor: '#000' }}>
          <img 
            src={images[activeImageIndex]} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />

          {images.length > 1 && (
            <>
              <button 
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ◀
              </button>
              <button 
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ▶
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Selector */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="thumb"
              onClick={() => setActiveImageIndex(idx)}
              style={{
                width: '85px',
                height: '65px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: activeImageIndex === idx ? '2px solid #ff2a2a' : '1px solid #232733',
                opacity: activeImageIndex === idx ? 1 : 0.6
              }}
            />
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <span style={{ background: '#232733', color: '#ff2a2a', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          {product.category}
        </span>
        <h1 style={{ fontSize: '36px', margin: '12px 0', lineHeight: 1.2, fontFamily: 'Teko, sans-serif' }}>{product.name}</h1>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' }}>
          <span style={{ fontSize: '30px', fontWeight: 'bold', color: '#ff2a2a' }}>₹{product.price.toLocaleString()}</span>
          <span style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '16px' }}>₹{product.originalPrice?.toLocaleString()}</span>
          <span style={{ color: '#4ade80', fontSize: '13px' }}>({product.discountPercent}% OFF)</span>
        </div>

        <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '15px' }}>{product.description}</p>

        <div style={{ background: '#15171e', border: '1px solid #232733', borderRadius: '8px', padding: '16px', margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px', color: '#fff' }}>Specifications</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div><span style={{ color: '#6b7280' }}>Material:</span> {product.specifications?.material}</div>
            <div><span style={{ color: '#6b7280' }}>Safety:</span> {product.specifications?.safetyCert}</div>
            <div><span style={{ color: '#6b7280' }}>Color:</span> {product.specifications?.color}</div>
            <div><span style={{ color: '#6b7280' }}>In Stock:</span> {product.stock} units</div>
          </div>
        </div>

        <Link 
          to={`/checkout/${product._id}`} 
          className="btn-primary" 
          style={{ display: 'block', textAlign: 'center', padding: '16px', fontSize: '14px', textDecoration: 'none' }}
        >
          BUY NOW • DISPATCH TODAY
        </Link>
      </div>
    </div>
  );
}