import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Package, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import { fetchHubs, fetchHubStock, updateStock } from '../api';
import './DemoPages.css';
import './CRM.css';

const Marketing = () => {
  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(false);
  const [editedStock, setEditedStock] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    loadHubs();
  }, []);

  const loadHubs = async () => {
    try {
      const data = await fetchHubs();
      setHubs(data);
      if (data.length > 0 && !selectedHub) {
        setSelectedHub(data[0].city);
        loadStock(data[0].city);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStock = async (city) => {
    setStockLoading(true);
    try {
      const data = await fetchHubStock(city);
      setStockData(data);
      setEditedStock({});
    } catch (err) {
      console.error(err);
    } finally {
      setStockLoading(false);
    }
  };

  const handleHubClick = (city) => {
    setSelectedHub(city);
    loadStock(city);
  };

  const handleStockChange = (productId, value) => {
    setEditedStock(prev => ({ ...prev, [productId]: parseInt(value) || 0 }));
  };

  const handleSaveStock = async (productId) => {
    const quantity = editedStock[productId];
    if (quantity === undefined) return;
    setSaving(productId);
    try {
      await updateStock({ productId, city: selectedHub, quantity });
      await loadStock(selectedHub);
      await loadHubs();
    } catch (err) {
      alert('Failed to update stock: ' + err.message);
    } finally {
      setSaving(null);
    }
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: 'Out of Stock', className: 'out-of-stock' };
    if (qty <= 10) return { label: 'Low Stock', className: 'low-stock' };
    return { label: 'In Stock', className: 'in-stock' };
  };

  if (loading) {
    return <div className="page-wrapper"><div className="container"><div className="loading-spinner">Loading Inventory...</div></div></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Inventory <span className="text-gradient">Management</span></h1>
          <p className="page-subtitle">Monitor and manage stock across all city hubs in real-time</p>
        </header>

        {/* Hub Cards */}
        <div className="hubs-grid animate-fade-in delay-100">
          {hubs.map(hub => (
            <div
              key={hub._id}
              className={`hub-card glass-card ${selectedHub === hub.city ? 'active' : ''}`}
              onClick={() => handleHubClick(hub.city)}
            >
              <Warehouse size={28} style={{color: selectedHub === hub.city ? 'var(--secondary)' : 'var(--text-muted)', marginBottom: '0.5rem'}} />
              <h3>{hub.city}</h3>
              <p className="hub-city"><MapPin size={14} /> {hub.state}</p>
              <div className="hub-stat">
                <span>Products</span>
                <span>{hub.totalProducts}</span>
              </div>
              <div className="hub-stat">
                <span>Total Stock</span>
                <span>{hub.totalStock}</span>
              </div>
              {hub.lowStockCount > 0 && (
                <div className="hub-stat" style={{color: 'var(--warning)'}}>
                  <span><AlertTriangle size={12} /> Low Stock</span>
                  <span>{hub.lowStockCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stock Table */}
        {selectedHub && (
          <div className="animate-fade-in delay-200">
            <div className="stock-table-header">
              <h3><Package size={20} /> Stock in {selectedHub} Hub</h3>
              <button className="btn-secondary btn-sm" onClick={() => loadStock(selectedHub)}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {stockLoading ? (
              <div className="loading-spinner">Loading stock...</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map(item => {
                    const status = getStockStatus(item.quantity);
                    const edited = editedStock[item.productId] !== undefined;
                    return (
                      <tr key={item.productId}>
                        <td style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          <img src={item.image} alt={item.name} style={{width: 36, height: 36, objectFit: 'contain', borderRadius: 6}} />
                          {item.name}
                        </td>
                        <td>{item.category}</td>
                        <td>{item.brand}</td>
                        <td>₹{item.price.toLocaleString('en-IN')}</td>
                        <td>
                          <input
                            type="number"
                            className="stock-qty-input"
                            defaultValue={item.quantity}
                            onChange={(e) => handleStockChange(item.productId, e.target.value)}
                          />
                        </td>
                        <td><span className={`stock-status ${status.className}`}>{status.label}</span></td>
                        <td>
                          <button
                            className="btn-primary btn-sm"
                            disabled={!edited || saving === item.productId}
                            onClick={() => handleSaveStock(item.productId)}
                            style={{opacity: edited ? 1 : 0.4}}
                          >
                            {saving === item.productId ? '...' : <><Save size={14} /> Save</>}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketing;
