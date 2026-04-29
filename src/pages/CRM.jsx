import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingCart, IndianRupee, Users, Package, TrendingUp, Clock } from 'lucide-react';
import { fetchDashboardStats, fetchRecentOrders } from '../api';
import './DemoPages.css';
import './CRM.css';

const statusColors = {
  placed: 'badge-warning',
  confirmed: 'badge-info',
  packaging: 'badge-info',
  shipped: 'badge-primary',
  in_hub: 'badge-primary',
  out_for_delivery: 'badge-warning',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

const statusLabels = {
  placed: 'Placed', confirmed: 'Confirmed', packaging: 'Packaging',
  shipped: 'Shipped', in_hub: 'In Hub', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

const CRM = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [s, orders] = await Promise.all([fetchDashboardStats(), fetchRecentOrders()]);
      setStats(s);
      setRecentOrders(orders);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container"><div className="loading-spinner">Loading Dashboard...</div></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Admin <span className="text-gradient">Dashboard</span></h1>
          <p className="page-subtitle">Real-time overview of your Quick Mart operations</p>
        </header>

        {/* Stats Cards */}
        <div className="dash-stats animate-fade-in delay-100">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background: 'rgba(99,102,241,0.1)', color: '#6366f1'}}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="stat-label">Total Orders</p>
              <h4 className="stat-value">{stats?.totalOrders || 0}</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background: 'rgba(16,185,129,0.1)', color: '#10b981'}}>
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="stat-label">Total Revenue</p>
              <h4 className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background: 'rgba(245,158,11,0.1)', color: '#f59e0b'}}>
              <Clock size={24} />
            </div>
            <div>
              <p className="stat-label">Pending Orders</p>
              <h4 className="stat-value">{stats?.pendingOrders || 0}</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background: 'rgba(59,130,246,0.1)', color: '#3b82f6'}}>
              <Users size={24} />
            </div>
            <div>
              <p className="stat-label">Registered Users</p>
              <h4 className="stat-value">{stats?.totalUsers || 0}</h4>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="quick-stats-row animate-fade-in delay-200">
          <div className="quick-stat glass-card">
            <Package size={20} />
            <span><strong>{stats?.totalProducts || 0}</strong> Products</span>
          </div>
          <div className="quick-stat glass-card">
            <TrendingUp size={20} />
            <span><strong>{stats?.deliveredOrders || 0}</strong> Delivered</span>
          </div>
          <div className="quick-stat glass-card">
            <BarChart3 size={20} />
            <span><strong>{stats?.totalStock || 0}</strong> Units in Stock</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dash-recent animate-fade-in delay-300">
          <h3>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={48} />
              <p>No orders yet. When a customer places an order, it will appear here.</p>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>City</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><strong>{order.orderId}</strong></td>
                    <td>{order.customerName}</td>
                    <td>{order.items?.map(i => i.name).join(', ').substring(0, 30)}...</td>
                    <td>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td>{order.shippingAddress?.city || '—'}</td>
                    <td><span className={`badge ${statusColors[order.status] || ''}`}>{statusLabels[order.status] || order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRM;
