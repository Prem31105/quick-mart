import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, FileText, Mail, Phone, MapPin, Heart, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Only show footer for logged-in users (not admin)
  if (!user || user.role === 'admin') return null;
  // Don't show on checkout or login
  if (['/login', '/checkout'].includes(location.pathname)) return null;

  return (
    <footer className="site-footer">
      <div className="footer-glow"></div>
      <div className="container footer-container">

        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <ShoppingBag className="footer-brand-icon" />
              <span className="footer-brand-text">Quick <span className="text-gradient">Mart</span></span>
            </div>
            <p className="footer-tagline">
              Your one-stop destination for premium electronics. 
              Fast delivery, secure payments, and unbeatable prices.
            </p>
            <div className="footer-contact-row">
              <a href="mailto:support@quickmart.in" className="footer-contact-item">
                <Mail size={14} /> support@quickmart.in
              </a>
              <a href="tel:+911800123456" className="footer-contact-item">
                <Phone size={14} /> 1800-123-456
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Policies</h4>
            <ul className="footer-links">
              <li><Link to="/privacy-policy"><FileText size={14} /> Privacy Policy</Link></li>
              <li><Link to="/privacy-policy"><Shield size={14} /> Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy"><RotateCcw size={14} /> Return & Refund</Link></li>
              <li><Link to="/privacy-policy"><Truck size={14} /> Shipping Policy</Link></li>
              <li><Link to="/privacy-policy"><CreditCard size={14} /> Payment Policy</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">We Accept</h4>
            <div className="footer-payment-badges">
              <div className="payment-badge">
                <CreditCard size={16} />
                <span>Visa</span>
              </div>
              <div className="payment-badge">
                <CreditCard size={16} />
                <span>Mastercard</span>
              </div>
              <div className="payment-badge">
                <CreditCard size={16} />
                <span>RuPay</span>
              </div>
              <div className="payment-badge">
                <Shield size={16} />
                <span>UPI</span>
              </div>
            </div>
            <div className="footer-secure-badge">
              <Shield size={14} />
              <span>100% Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Quick Mart. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <Heart size={14} className="footer-heart" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
