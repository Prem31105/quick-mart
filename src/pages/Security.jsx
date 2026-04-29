import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, Package, CreditCard, AlertTriangle, Settings, CheckCheck, Trash2 } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllRead } from '../api';
import './DemoPages.css';
import './CRM.css';

const iconMap = {
  cart_add: { icon: <ShoppingCart size={20} />, bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  order_placed: { icon: <Package size={20} />, bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  payment_received: { icon: <CreditCard size={20} />, bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  low_stock: { icon: <AlertTriangle size={20} />, bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  system: { icon: <Settings size={20} />, bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString('en-IN');
};

const Security = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <div className="page-wrapper"><div className="container"><div className="loading-spinner">Loading Notifications...</div></div></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Live <span className="text-gradient">Notifications</span></h1>
          <p className="page-subtitle">Real-time alerts for cart activity, orders, and system events</p>
        </header>

        <div className="notification-header animate-fade-in delay-100">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <Bell size={20} />
            <span style={{fontSize: '1rem', fontWeight: 600}}>
              {unreadCount > 0 ? <><span className="notif-badge-count">{unreadCount}</span> unread notifications</> : 'All caught up!'}
            </span>
          </div>
          {unreadCount > 0 && (
            <button className="btn-secondary btn-sm" onClick={handleMarkAllRead}>
              <CheckCheck size={14} /> Mark All Read
            </button>
          )}
        </div>

        <div className="notif-list animate-fade-in delay-200">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} />
              <p>No notifications yet. When customers interact with your store, alerts will appear here in real-time.</p>
            </div>
          ) : (
            notifications.map(notif => {
              const style = iconMap[notif.type] || iconMap.system;
              return (
                <div
                  key={notif._id}
                  className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                >
                  <div className="notif-icon" style={{background: style.bg, color: style.color}}>
                    {style.icon}
                  </div>
                  <div className="notif-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    {notif.orderId && <p style={{fontWeight: 600, marginTop: '0.25rem'}}>Order: {notif.orderId}</p>}
                    {notif.amount && <p style={{fontWeight: 600, color: 'var(--success)'}}>Amount: ₹{notif.amount.toLocaleString('en-IN')}</p>}
                  </div>
                  <span className="notif-time">{timeAgo(notif.createdAt)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;
