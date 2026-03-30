import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundData, setRefundData] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestRefund = async (orderId) => {
    const reason = refundData[orderId];
    if (!reason) return alert('Please provide a reason for refund');
    try {
      await axios.post('/api/refunds', { orderId, reason });
      alert('Refund requested successfully!');
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Refund request failed');
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl mb-8 font-bold">My Orders</h2>
      {loading ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted" style={{ padding: '4rem 0' }}>You have no orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between align-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 className="font-bold text-lg">Order #{order.id}</h3>
                  <p className="text-muted text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`badge`} style={{ backgroundColor: order.status === 'delivered' ? 'var(--secondary)' : 'var(--primary)' }}>
                    {order.status.toUpperCase()}
                  </span>
                  <p className="font-bold mt-2" style={{ color: 'var(--primary)' }}>${order.total_amount}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-bold mb-2 text-sm">Items</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {order.OrderItems?.map(item => (
                    <li key={item.id} className="text-sm text-muted mb-1 flex justify-between">
                      <span>Product #{item.ProductId} <span style={{ fontWeight: 'bold' }}>(x{item.quantity})</span></span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.status === 'delivered' && !order.Refund && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <h4 className="font-bold mb-2 flex align-center gap-2" style={{ fontSize: '0.875rem' }}><AlertTriangle size={16} color="#b45309" /> Problem with your order?</h4>
                  <div className="flex gap-2 text-sm">
                    <input 
                      type="text" 
                      placeholder="Reason for refund..." 
                      value={refundData[order.id] || ''}
                      onChange={(e) => setRefundData({ ...refundData, [order.id]: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem' }}
                    />
                    <button className="btn-outline btn-sm" onClick={() => requestRefund(order.id)}>Request Refund</button>
                  </div>
                </div>
              )}
              {order.Refund && (
                <div className="mt-4 pt-4 text-sm" style={{ borderTop: '1px solid var(--border)', color: '#b45309' }}>
                  <strong>Refund Status: </strong>{order.Refund.status.toUpperCase()} <br/>
                  <span className="text-muted">Reason: {order.Refund.reason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
