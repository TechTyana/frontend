import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Check, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image_url: '' });

  // Quick switch for mock purposes
  const toggleRole = () => {
    setUser({ ...user, role: user.role === 'admin' ? 'customer' : 'admin' });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <Shield size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)' }} />
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-muted mb-4">You do not have permission to view this page. (Click below to simulate Admin role)</p>
        <div className="flex justify-center gap-4">
          <button className="btn-outline" onClick={() => navigate('/')}>Return Home</button>
          <button className="btn-primary" onClick={toggleRole}>Simulate Admin</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'orders') {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } else if (activeTab === 'products') {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } else if (activeTab === 'refunds') {
        const res = await axios.get('/api/refunds');
        setRefunds(res.data);
      }
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/delivery`);
      fetchData();
    } catch (error) {
      alert('Failed to update delivery status');
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', newProduct);
      setNewProduct({ name: '', description: '', price: '', category: '', image_url: '' });
      fetchData();
      alert('Product added successfully');
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between align-center mb-8">
        <div className="flex align-center gap-2">
          <Shield size={32} color="var(--primary)" />
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <button className="btn-outline btn-sm" onClick={toggleRole}>Exit Admin Mode</button>
      </div>

      <div className="flex gap-4 mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', overflowX: 'auto' }}>
        <button className={`btn-outline ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} style={{ backgroundColor: activeTab === 'orders' ? 'var(--primary)' : 'white', color: activeTab === 'orders' ? 'white' : 'var(--text-main)', border: 'none' }}>Manage Orders</button>
        <button className={`btn-outline ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')} style={{ backgroundColor: activeTab === 'products' ? 'var(--primary)' : 'white', color: activeTab === 'products' ? 'white' : 'var(--text-main)', border: 'none' }}>Manage Products</button>
        <button className={`btn-outline ${activeTab === 'refunds' ? 'active' : ''}`} onClick={() => setActiveTab('refunds')} style={{ backgroundColor: activeTab === 'refunds' ? 'var(--primary)' : 'white', color: activeTab === 'refunds' ? 'white' : 'var(--text-main)', border: 'none' }}>Refund Requests</button>
      </div>

      {activeTab === 'orders' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="font-bold text-lg mb-4">All Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.id}</td>
                    <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: order.status === 'delivered' ? 'var(--secondary)' : 'var(--primary)' }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>${order.total_amount}</td>
                    <td style={{ padding: '1rem' }}>
                      {order.status !== 'delivered' && (
                        <button className="btn-sm btn-primary flex align-center gap-2" onClick={() => markDelivered(order.id)}>
                          <Check size={14} /> Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="font-bold text-lg mb-4 flex align-center gap-2"><Plus size={18} /> Add New Product</h3>
            <form onSubmit={addProduct}>
              <div className="mb-4">
                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <input type="text" placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
              </div>
              <div className="mb-4">
                <input type="number" step="0.01" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div className="mb-4">
                <input type="url" placeholder="Image URL (Unsplash valid URL etc)" required value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
              </div>
              <div className="mb-4">
                <textarea rows="3" placeholder="Detailed Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Product</button>
            </form>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            <h3 className="font-bold text-lg mb-4">Existing Products Dashboard</h3>
            {products.map(p => (
              <div key={p.id} className="flex justify-between align-center mb-4 pb-4 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-muted">{p.category}</div>
                </div>
                <span className="font-bold px-3 py-1 bg-gray-100 rounded">${p.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'refunds' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="font-bold text-lg mb-4">Refund Requests Inbox</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Reason</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map(refund => (
                  <tr key={refund.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{refund.OrderId}</td>
                    <td style={{ padding: '1rem' }}>{refund.reason}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge">{refund.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
                {refunds.length === 0 && (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No refund requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
