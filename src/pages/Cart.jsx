import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useAppContext();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <h2 className="text-2xl mb-4 font-bold">Your cart is empty</h2>
        <p className="text-muted mb-8">Looks like you haven't added any premium items to your cart yet.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-2xl mb-8 font-bold">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2" style={{ gridColumn: 'span 2 / span 2' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            {cart.map((item) => (
              <div key={item.product.id} className="flex align-center justify-between mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div className="flex gap-4 align-center" style={{ flex: 1 }}>
                  <img src={item.product.image_url} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                  <div>
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-muted text-sm">${item.product.price} each</p>
                  </div>
                </div>
                
                <div className="flex align-center gap-4">
                  <div className="flex align-center gap-2">
                    <button className="btn-outline btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span style={{ width: '2rem', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button className="btn-outline btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="text-muted" style={{ padding: '0.5rem', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 size={20} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '5rem' }}>
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="font-bold">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-muted">Estimated Tax (10%)</span>
              <span className="font-bold">${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl" style={{ color: 'var(--primary)' }}>${(getCartTotal() * 1.1).toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
