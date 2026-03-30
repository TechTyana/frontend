import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="text-muted text-sm" style={{ fontWeight: 500 }}>&copy; {new Date().getFullYear()} EAZY E-commerce Platform. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2" style={{ marginTop: '1rem' }}>
          <a href="#" className="nav-item" style={{ fontSize: '0.875rem' }}>Terms</a>
          <a href="#" className="nav-item" style={{ fontSize: '0.875rem' }}>Privacy</a>
          <a href="#" className="nav-item" style={{ fontSize: '0.875rem' }}>Help & Contact</a>
        </div>
      </div>
    </footer>
  );
}
