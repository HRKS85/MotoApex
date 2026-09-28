import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  const [shippingAddress, setShippingAddress] = useState({ 
    fullName: '', 
    phone: '', 
    street: '', 
    city: '', 
    state: '', 
    pincode: '' 
  });
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    axios.get(`${API_BASE}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`${API_BASE}/api/orders/checkout`, {
        items: [{ product: product._id, name: product.name, price: product.price, quantity: 1 }],
        totalAmount: product.price,
        shippingAddress,
        paymentMethod 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const methodText = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe';
      alert(`Order confirmed via ${methodText}! Your riding gear is being processed.`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please try again.');
    }
  };

  if (!product) return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading secure checkout...</div>;

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '28px', background: '#15171e', border: '1px solid #232733', borderRadius: '10px' }}>
      <h2 style={{ fontSize: '28px', margin: '0 0 10px', color: '#ff2a2a', fontFamily: 'Teko, sans-serif' }}>DELIVERY & PAYMENT</h2>
      <p style={{ color: '#fff', margin: '5px 0' }}>Item: <strong>{product.name}</strong></p>
      <p style={{ color: '#ff2a2a', fontSize: '20px', fontWeight: 'bold', margin: '5px 0 20px' }}>Amount: ₹{product.price.toLocaleString()}</p>

      <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* FIXED: Added missing inputs required by your schema */}
        <input placeholder="Full Name" required onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} />
        <input placeholder="Phone Number" required onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
        <input placeholder="Street / Door Number" required onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
        
        <input placeholder="City" required onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
        <input placeholder="State" required onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
        <input placeholder="6-digit Pincode" required onChange={e => setShippingAddress({ ...shippingAddress, pincode: e.target.value })} />

        <h4 style={{ margin: '14px 0 6px', color: '#fff' }}>Select Payment Gateway</h4>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f3f4f6' }}>
          <input 
            type="radio" 
            name="pay" 
            checked={paymentMethod === 'stripe'} 
            onChange={() => setPaymentMethod('stripe')} 
          />
          Stripe Secure (Credit / Debit / UPI)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f3f4f6' }}>
          <input 
            type="radio" 
            name="pay" 
            checked={paymentMethod === 'cod'} 
            onChange={() => setPaymentMethod('cod')} 
          />
          Cash on Delivery (COD)
        </label>

        <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '12px', fontWeight: 'bold' }}>
          CONFIRM & PAY ₹{product.price.toLocaleString()}
        </button>
      </form>
    </div>
  );
}