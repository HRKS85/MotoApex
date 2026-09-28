import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0, orders: [] });
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Helmets', price: '', originalPrice: '', description: '', images: '', material: '', safetyCert: '', color: ''
  });

  const token = localStorage.getItem('token');

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders/admin/metrics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const imgArray = newProduct.images.split(',').map(url => url.trim()).filter(Boolean);
      await axios.post(`${API_BASE}/api/products`, {
        ...newProduct,
        images: imgArray.length > 0 ? imgArray : ['[https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80)'],
        specifications: {
          material: newProduct.material,
          safetyCert: newProduct.safetyCert,
          color: newProduct.color
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product created!');
      setNewProduct({ name: '', category: 'Helmets', price: '', originalPrice: '', description: '', images: '', material: '', safetyCert: '', color: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving gear listing');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '30px 20px' }}>
      <h1 style={{ fontSize: '36px', color: '#ff2a2a', fontFamily: 'Teko, sans-serif' }}>ADMINISTRATIVE OPERATIONS</h1>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0 30px' }}>
        <div style={{ background: '#15171e', border: '1px solid #232733', padding: '20px', borderRadius: '8px', minWidth: '220px' }}>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>TOTAL REVENUE</p>
          <h2 style={{ fontSize: '32px', color: '#22c55e', margin: '6px 0 0' }}>₹{metrics.totalRevenue.toLocaleString()}</h2>
        </div>
        <div style={{ background: '#15171e', border: '1px solid #232733', padding: '20px', borderRadius: '8px', minWidth: '220px' }}>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>COMPLETED ORDERS</p>
          <h2 style={{ fontSize: '32px', color: '#3b82f6', margin: '6px 0 0' }}>{metrics.totalOrders}</h2>
        </div>
      </div>

      {/* Add Product Form */}
      <div style={{ background: '#15171e', border: '1px solid #232733', padding: '24px', borderRadius: '10px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Add New Gear Listing</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input placeholder="Gear Title" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
            <option value="Helmets">Helmets</option>
            <option value="Jackets">Jackets</option>
            <option value="Gloves">Gloves</option>
          </select>
          <input placeholder="Selling Price (₹)" type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input placeholder="Original MRP (₹)" type="number" required value={newProduct.originalPrice} onChange={e => setNewProduct({ ...newProduct, originalPrice: e.target.value })} />
          <input placeholder="Image URLs (comma separated)" required style={{ gridColumn: 'span 2' }} value={newProduct.images} onChange={e => setNewProduct({ ...newProduct, images: e.target.value })} />
          <input placeholder="Material (e.g. Carbon Fiber)" value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })} />
          <input placeholder="Safety Cert (e.g. ECE 22.06)" value={newProduct.safetyCert} onChange={e => setNewProduct({ ...newProduct, safetyCert: e.target.value })} />
          <textarea placeholder="Product Description" required style={{ gridColumn: 'span 2' }} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '12px' }}>CREATE GEAR LISTING</button>
        </form>
      </div>

      {/* Recent Orders Table */}
      <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Recent Deliveries</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#15171e', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#1f232e', textAlign: 'left', color: '#9ca3af', fontSize: '13px' }}>
            <th style={{ padding: '12px' }}>Order ID</th>
            <th style={{ padding: '12px' }}>Buyer</th>
            <th style={{ padding: '12px' }}>Item</th>
            <th style={{ padding: '12px' }}>Amount</th>
            <th style={{ padding: '12px' }}>Destination</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {metrics.orders.map(order => (
            <tr key={order._id} style={{ borderBottom: '1px solid #232733', fontSize: '13px' }}>
              <td style={{ padding: '12px' }}>{order._id.slice(-6)}</td>
              <td style={{ padding: '12px' }}>{order.user?.name || 'Customer'}</td>
              <td style={{ padding: '12px' }}>{order.items.map(i => i.name).join(', ')}</td>
              <td style={{ padding: '12px', color: '#ff2a2a', fontWeight: 'bold' }}>₹{order.totalAmount}</td>
              <td style={{ padding: '12px' }}>{order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong></td>
              <td style={{ padding: '12px', color: '#22c55e' }}>{order.deliveryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}