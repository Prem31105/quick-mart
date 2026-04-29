import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, Package, Warehouse, Bell, ShoppingCart, Grid, LogOut, Search, ClipboardList, TrendingUp, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchUnreadCount } from '../api';
import CartSidebar from './CartSidebar';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cartCount, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) => location.pathname === path;

  // Poll unread notification count for admin
  useEffect(() => {
    if (user?.role !== 'admin') return;
    const load = () => {
      fetchUnreadCount().then(d => setUnreadCount(d.count)).catch(() => {});
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <ShoppingBag className="brand-icon" />
          <span className="brand-text">Quick <span className="text-gradient">Mart</span></span>
        </Link>

        {user && user.role === 'user' && (
          <div className="nav-user-center">
            <div className="nav-search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search products..." />
            </div>

            <ul className="nav-links user-links">
              <li>
                <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                  <Grid size={18} /> Products
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}>
                  <ClipboardList size={18} /> My Orders
                </Link>
              </li>
            </ul>
          </div>
        )}

        {user && user.role === 'admin' && (
          <ul className="nav-links">
            <li>
              <Link to="/crm" className={`nav-link ${isActive('/crm') ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/revenue" className={`nav-link ${isActive('/revenue') ? 'active' : ''}`}>
                <Package size={18} /> Orders
              </Link>
            </li>
            <li>
              <Link to="/marketing" className={`nav-link ${isActive('/marketing') ? 'active' : ''}`}>
                <Warehouse size={18} /> Inventory
              </Link>
            </li>
            <li>
              <Link to="/strategy" className={`nav-link ${isActive('/strategy') ? 'active' : ''}`}>
                <TrendingUp size={18} /> Strategy
              </Link>
            </li>
            <li>
              <Link to="/scm" className={`nav-link ${isActive('/scm') ? 'active' : ''}`}>
                <Truck size={18} /> SCM
              </Link>
            </li>
            <li>
              <Link to="/security" className={`nav-link ${isActive('/security') ? 'active' : ''}`}>
                <Bell size={18} /> Notifications
                {unreadCount > 0 && <span className="nav-notif-badge">{unreadCount}</span>}
              </Link>
            </li>

          </ul>
        )}

        <div className="nav-actions">
          {user && user.role === 'user' && (
            <button className="cart-icon-btn" onClick={toggleCart}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge-nav">{cartCount}</span>}
            </button>
          )}
          <button className="cart-icon-btn text-danger" onClick={logout} title="Logout">
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </nav>
    <CartSidebar />
    </>
  );
};

export default Navbar;
