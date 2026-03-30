import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useAppContext();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) return alert('Please enter shipping address');

    setIsProcessing(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const payload = {
        items: cart.map(c => ({ productId: c.product.id, quantity: c.quantity })),
        shipping_address: address
      };
      
      const res = await axios.post('/api/orders/checkout', payload);
      clearCart();
      setSuccess(true);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <CheckCircle size={64} color="var(--secondary)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 className="text-2xl mb-4 font-bold">Payment Successful!</h2>
        <p className="text-muted mb-8">Your order has been placed and is being processed.</p>
        <button className="btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2 className="text-2xl mb-8 font-bold">Checkout</h2>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="font-bold text-lg mb-4">Shipping Details</h3>
        <form onSubmit={handleCheckout}>
          <div className="mb-4">
            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Shipping Address</label>
            <textarea 
              rows="3" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="123 Example St, City, Country"
              required
            />
          </div>

          <h3 className="font-bold text-lg mb-4 mt-8">Payment Info (Simulated)</h3>
          <div className="mb-4">
            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Card Number</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="0000 0000 0000 0000" style={{ paddingLeft: '2.5rem' }} defaultValue="4242 4242 4242 4242" />
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Expiry</label>
              <input type="text" placeholder="MM/YY" defaultValue="12/25" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>CVC</label>
              <input type="text" placeholder="123" defaultValue="123" />
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50" style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <div className="flex justify-between font-bold text-lg">
              <span>Total to Pay:</span>
              <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isProcessing}>
            {isProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
