import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, CheckCircle, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { getCartCount, user } = useAppContext();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <CheckCircle size={28} />
          EAZY
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/')}`}>Products</Link>
          <Link to="/orders" className={`nav-item ${isActive('/orders')}`}><Package size={18}/> Orders</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-item ${isActive('/admin')}`}><Shield size={18}/> Admin</Link>
          )}
          <Link to="/cart" className={`nav-item ${isActive('/cart')}`} style={{ position: 'relative' }}>
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span className="badge" style={{ position: 'absolute', top: '-8px', right: '-12px', padding: '2px 6px', color: 'white' }}>
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
