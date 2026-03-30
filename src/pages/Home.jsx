import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useAppContext();

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products', { params: { search, category } });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['', 'Electronics', 'Apparel', 'Accessories'];

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to EAZY</h1>
        <p>Your one-stop shop for premium products. Experience seamless shopping delivered to you.</p>
      </div>

      <div className="flex justify-between align-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="text-2xl">Our Products</h2>
        <div className="flex gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '250px' }}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '150px' }}>
            <option value="">All Categories</option>
            {categories.filter(c => c).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-muted" style={{ padding: '4rem 0' }}>No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(product => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f3f4f6', backgroundImage: `url(${product.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between align-center mb-2">
                  <span className="badge">{product.category}</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>${Number(product.price).toFixed(2)}</span>
                </div>
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-muted text-sm mb-4" style={{ flex: 1 }}>{product.description}</p>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
