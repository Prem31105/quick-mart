import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Warehouse, 
  Factory, 
  Navigation, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  TrendingDown,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { trackOrder } from '../api';
import './DemoPages.css';

const SCM = () => {
  const [activeTab, setActiveTab] = useState('flow');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [shipmentProgress, setShipmentProgress] = useState(45); // Percentage
  const [hubStock, setHubStock] = useState({
    'Mumbai': 82,
    'Delhi': 65,
    'Bangalore': 91,
    'Chennai': 48,
    'Kolkata': 73
  });

  // Simulate live shipment progress
  useEffect(() => {
    const interval = setInterval(() => {
      setShipmentProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const suppliers = [
    { name: 'NeoTech Manufacturing', location: 'Shenzhen, CN', reliability: '98%', category: 'Circuit Boards', leadTime: '12 Days' },
    { name: 'Global Optics Ltd', location: 'Tokyo, JP', reliability: '95%', category: 'Screens/Display', leadTime: '15 Days' },
    { name: 'PowerCell Systems', location: 'Bangalore, IN', reliability: '99%', category: 'Batteries', leadTime: '5 Days' },
    { name: 'AluFrame Corp', location: 'Berlin, DE', reliability: '92%', category: 'Casing/Body', leadTime: '18 Days' },
  ];

  const inboundShipments = [
    { id: 'SCM-IN-102', origin: 'Shenzhen', destination: 'Mumbai Hub', status: 'In Transit', ETA: '2 days', items: 450 },
    { id: 'SCM-IN-105', origin: 'Bangalore', destination: 'Delhi Hub', status: 'Processing', ETA: '1 day', items: 1200 },
    { id: 'SCM-IN-108', origin: 'Tokyo', destination: 'Chennai Hub', status: 'At Customs', ETA: '4 days', items: 300 },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Supply Chain <span className="text-gradient">Management</span></h1>
          <p className="page-subtitle">Visualizing the journey from manufacturing to the customer's doorstep</p>
        </header>

        {/* --- SCM NAV TABS --- */}
        <div className="view-mode-toggle animate-fade-in delay-100">
          <button className={`mode-btn ${activeTab === 'flow' ? 'active' : ''}`} onClick={() => setActiveTab('flow')}>
            ⛓️ Supply Flow
          </button>
          <button className={`mode-btn ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => setActiveTab('suppliers')}>
            🏭 Suppliers
          </button>
          <button className={`mode-btn ${activeTab === 'logistics' ? 'active' : ''}`} onClick={() => setActiveTab('logistics')}>
            🚛 Logistics
          </button>
          <button className={`mode-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            🗺️ Live Map
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        {activeTab === 'flow' && (
          <div className="scm-flow-view animate-fade-in delay-200">
            <div className="glass-card scm-main-card" style={{padding: '3rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                <div>
                  <h3 style={{fontSize: '1.75rem', fontWeight: 800}}>Live Supply Chain Feed</h3>
                  <p style={{color: 'var(--text-muted)'}}>Simulated real-time visibility of global operations.</p>
                </div>
                <div className="live-indicator">
                  <div className="pulse-dot"></div>
                  <span>System Live</span>
                </div>
              </div>
              
              <div className="scm-visual-flow">
                <div className="flow-node">
                  <div className="node-icon bg-purple"><Factory size={32} /></div>
                  <h4>Procurement</h4>
                  <p>Global sourcing centers</p>
                  <div className="node-stats">12 Partners</div>
                </div>
                <div className="flow-connector">
                  <div className="connector-line"></div>
                  <div className="moving-dot" style={{ left: `${shipmentProgress}%` }}>
                    <Truck size={14} />
                  </div>
                </div>
                <div className="flow-node active-node">
                  <div className="node-icon bg-blue"><Truck size={32} /></div>
                  <h4>In-Transit</h4>
                  <p>Global freight moving</p>
                  <div className="node-stats">{840 + (shipmentProgress % 10)} Units</div>
                </div>
                <div className="flow-connector">
                  <div className="connector-line"></div>
                  <div className="moving-dot" style={{ left: `${(shipmentProgress + 50) % 100}%` }}>
                    <Package size={14} />
                  </div>
                </div>
                <div className="flow-node">
                  <div className="node-icon bg-green"><Warehouse size={32} /></div>
                  <h4>Regional Hubs</h4>
                  <p>Ready for dispatch</p>
                  <div className="node-stats">99% Capacity</div>
                </div>
              </div>

              <div className="scm-interactive-controls">
                <div className="tracking-search">
                  <input 
                    type="text" 
                    placeholder="Enter Order ID (e.g. QM-1001)" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="scm-input"
                  />
                  <button 
                    className="btn-primary" 
                    onClick={async () => {
                      if (!trackingId) return;
                      setIsTracking(true);
                      setTrackingError('');
                      setTrackingResult(null);
                      try {
                        const data = await trackOrder(trackingId);
                        setTrackingResult(data);
                      } catch (err) {
                        // Fallback: Generate simulated result for demonstration if not in DB
                        const statuses = ['placed', 'confirmed', 'packaging', 'shipped', 'in_hub', 'out_for_delivery'];
                        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        
                        setTrackingResult({
                          orderId: trackingId.toUpperCase(),
                          status: randomStatus,
                          customerName: 'Simulated Customer',
                          statusHistory: [
                            { status: 'placed', timestamp: new Date(Date.now() - 86400000), note: 'Order received and verified' },
                            { status: randomStatus, timestamp: new Date(), note: `Current location: ${['Mumbai Hub', 'Delhi NCR Hub', 'Bangalore Hub'][Math.floor(Math.random() * 3)]}` }
                          ]
                        });
                      } finally {
                        setIsTracking(false);
                      }
                    }}
                    disabled={isTracking}
                  >
                    {isTracking ? 'Searching...' : 'Track Shipment'}
                  </button>
                </div>

                {trackingError && (
                  <div className="tracking-error animate-fade-in" style={{marginTop: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <AlertCircle size={18} />
                    <span>{trackingError}</span>
                  </div>
                )}

                {trackingResult && (
                  <div className="tracking-result animate-fade-in">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                      <div>
                        <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)'}}>Order Found</p>
                        <h4 style={{margin: 0}}>{trackingResult.orderId}</h4>
                      </div>
                      <div className={`badge badge-${trackingResult.status === 'delivered' ? 'success' : 'primary'}`}>
                        {trackingResult.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <p>Current Status: <strong>{trackingResult.statusHistory[trackingResult.statusHistory.length - 1]?.note || 'In Transit'}</strong></p>
                    
                    <div className="tracking-timeline">
                      {['placed', 'packaging', 'shipped', 'delivered'].map((step, idx) => {
                        const statusOrder = ['placed', 'confirmed', 'packaging', 'shipped', 'in_hub', 'out_for_delivery', 'delivered'];
                        const currentIdx = statusOrder.indexOf(trackingResult.status);
                        const stepIdx = statusOrder.indexOf(step);
                        const isDone = currentIdx >= stepIdx;
                        
                        return (
                          <div key={step} className={`timeline-step ${isDone ? 'done' : ''}`}>
                            <div className="step-dot"></div>
                            <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="progress-bar-bg" style={{marginTop: '2rem'}}>
                      <div className="progress-bar-fill" style={{ 
                        width: trackingResult.status === 'delivered' ? '100%' : 
                               trackingResult.status === 'shipped' ? '75%' : 
                               trackingResult.status === 'packaging' ? '40%' : '15%' 
                      }}></div>
                    </div>
                  </div>
                )}

                {!trackingResult && !trackingError && !isTracking && (
                   <div style={{marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                     Try tracking <strong>QM-1001</strong> to see database integration.
                   </div>
                )}
              </div>
            </div>

            <div className="scm-secondary-grid">
              <div className="glass-card hub-capacity-card">
                <h4>Hub Inventory Levels</h4>
                <div className="hub-bars">
                  {Object.entries(hubStock).map(([city, level]) => (
                    <div key={city} className="hub-bar-item">
                      <div className="hub-label">
                        <span>{city} Hub</span>
                        <span>{level}%</span>
                      </div>
                      <div className="hub-progress-bg">
                        <div 
                          className={`hub-progress-fill ${level > 85 ? 'full' : level < 50 ? 'low' : ''}`} 
                          style={{ width: `${level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="scm-stats-grid-mini">
                <div className="scm-mini-card glass-card">
                  <div className="mini-card-icon blue"><Clock size={24} /></div>
                  <div>
                    <p>Lead Time</p>
                    <h4>98.4%</h4>
                  </div>
                </div>
                <div className="scm-mini-card glass-card">
                  <div className="mini-card-icon green"><TrendingDown size={24} /></div>
                  <div>
                    <p>Logistics Cost</p>
                    <h4>-14.2%</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="animate-fade-in delay-200">
            <div className="glass-card">
              <h3 style={{marginBottom: '1.5rem'}}>Live Fleet Tracking</h3>
              <div className="fleet-grid">
                {[
                  { id: 'TRK-9921', driver: 'Arjun Singh', route: 'Mumbai ➜ Pune', status: 'In Transit', progress: 65 },
                  { id: 'TRK-4412', driver: 'Vikram Rao', route: 'Delhi ➜ Jaipur', status: 'Loading', progress: 15 },
                  { id: 'TRK-8823', driver: 'Sanjay K.', route: 'Bangalore ➜ Mysore', status: 'Delivering', progress: 90 },
                  { id: 'TRK-1102', driver: 'Amit Shah', route: 'Chennai ➜ Vellore', status: 'In Transit', progress: 40 }
                ].map((truck, i) => (
                  <div key={i} className="truck-track-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{fontWeight: 700}}>{truck.id}</span>
                      <span className={`badge badge-${truck.status === 'Loading' ? 'warning' : 'primary'}`} style={{fontSize: '0.7rem'}}>
                        {truck.status}
                      </span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0'}}>{truck.route}</p>
                    <div className="progress-bar-bg" style={{height: 4}}>
                      <div className="progress-bar-fill" style={{width: `${truck.progress}%`}}></div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem'}}>
                      <span>Driver: {truck.driver}</span>
                      <span>{truck.progress}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="animate-fade-in delay-200">
            <div className="glass-card">
              <h3 style={{marginBottom: '1.5rem'}}>Global Supplier Network</h3>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Lead Time</th>
                    <th>Reliability</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.name}</strong></td>
                      <td><MapPin size={14} style={{marginRight: 4}} /> {s.location}</td>
                      <td>{s.category}</td>
                      <td>{s.leadTime}</td>
                      <td>{s.reliability}</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="animate-fade-in delay-200">
            <div className="glass-card scm-map-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <div>
                  <h3>India Distribution Network</h3>
                  <p style={{color: 'var(--text-muted)'}}>Visualizing real-time movement across regional hubs.</p>
                </div>
                <div className="map-legend">
                  <div className="legend-item"><div className="dot blue"></div> Hub</div>
                  <div className="legend-item"><div className="dot orange"></div> Shipment</div>
                </div>
              </div>

              <div className="india-map-container">
                <svg viewBox="0 0 400 500" className="india-svg">
                  {/* Simplified India Path */}
                  <path d="M150,50 L250,50 L300,150 L350,250 L300,400 L200,480 L100,400 L50,250 L100,150 Z" fill="rgba(255,255,255,0.05)" stroke="var(--glass-border)" />
                  
                  {/* Hubs */}
                  <circle cx="180" cy="120" r="5" className="hub-dot" fill="#3b82f6" /> {/* Delhi */}
                  <circle cx="120" cy="280" r="5" className="hub-dot" fill="#3b82f6" /> {/* Mumbai */}
                  <circle cx="220" cy="380" r="5" className="hub-dot" fill="#3b82f6" /> {/* Bangalore */}
                  <circle cx="280" cy="350" r="5" className="hub-dot" fill="#3b82f6" /> {/* Chennai */}
                  <circle cx="300" cy="200" r="5" className="hub-dot" fill="#3b82f6" /> {/* Kolkata */}

                  <text x="185" y="115" className="hub-label">Delhi Hub</text>
                  <text x="125" y="275" className="hub-label">Mumbai Hub</text>
                  <text x="225" y="375" className="hub-label">Bangalore Hub</text>

                  {/* Animated Shipments */}
                  <circle r="4" fill="#f59e0b">
                    <animateMotion 
                      path="M180,120 L120,280" 
                      dur="10s" 
                      repeatCount="indefinite" 
                    />
                  </circle>
                  <circle r="4" fill="#f59e0b">
                    <animateMotion 
                      path="M120,280 L220,380" 
                      dur="8s" 
                      repeatCount="indefinite" 
                    />
                  </circle>
                  <circle r="4" fill="#f59e0b">
                    <animateMotion 
                      path="M300,200 L180,120" 
                      dur="12s" 
                      repeatCount="indefinite" 
                    />
                  </circle>

                  {/* Tracking Overlay if active */}
                  {trackingResult && trackingResult.status === 'shipped' && (
                    <circle r="6" fill="#22c55e" className="active-tracking-dot">
                      <animateMotion 
                        path="M180,120 L300,200" 
                        dur="15s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  )}
                </svg>
                
                <div className="map-stats-panel">
                  <div className="map-stat-item">
                    <small>Active Shipments</small>
                    <h4>1,284</h4>
                  </div>
                  <div className="map-stat-item">
                    <small>Fleet Efficiency</small>
                    <h4>94.2%</h4>
                  </div>
                  <div className="map-stat-item">
                    <small>Avg. Transit Time</small>
                    <h4>14.5 hrs</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scm-visual-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding: 1rem;
          gap: 0.5rem;
        }
        .flow-node {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        .node-icon {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .flow-node h4 { margin-top: 0.5rem; font-weight: 800; font-size: 1.1rem; }
        .flow-node p { font-size: 0.8rem; color: var(--text-muted); max-width: 140px; margin: 0; line-height: 1.4; }
        
        .node-stats {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          background: rgba(59, 130, 246, 0.05);
          padding: 4px 10px;
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        .flow-connector {
          flex: 0.5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 80px;
          margin-top: -3.5rem;
        }
        .connector-line {
          width: 100%;
          height: 2px;
          background: repeating-linear-gradient(to right, var(--glass-border) 0, var(--glass-border) 5px, transparent 5px, transparent 10px);
          position: absolute;
          top: 50%;
        }
        .connector-icon {
          background: var(--bg-darker);
          padding: 4px;
          border-radius: 50%;
          color: var(--text-muted);
          position: relative;
          z-index: 2;
        }

        .bg-purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
        .bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .bg-green { background: linear-gradient(135deg, #22c55e, #15803d); }
        .bg-orange { background: linear-gradient(135deg, #f97316, #c2410c); }

        .active-node .node-icon {
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
          transform: scale(1.05);
        }

        .scm-mini-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
        }
        .mini-card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mini-card-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .mini-card-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .mini-card-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .mini-card-icon.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

        .scm-mini-card p { font-size: 0.9rem; color: var(--text-muted); margin: 0; font-weight: 500; }
        .scm-mini-card h4 { font-size: 1.5rem; margin: 0; font-weight: 800; color: var(--text-main); }

        .logistics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .shipment-card {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 15px;
        }
        .ship-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .ship-id { font-family: monospace; font-weight: bold; color: var(--secondary); }
        .ship-status { font-size: 0.75rem; background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 2px 8px; border-radius: 10px; }
        
        .ship-path {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .path-point small { color: var(--text-muted); display: block; }
        .path-point p { margin: 0; font-weight: 600; }
        .path-line {
          flex: 1;
          height: 1px;
          background: dashed var(--glass-border);
          margin: 0 1rem;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px dashed var(--glass-border);
        }
        
        .ship-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
          border-top: 1px solid var(--glass-border);
          padding-top: 1rem;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(34, 197, 94, 0.1);
          padding: 6px 14px;
          border-radius: 20px;
          color: #22c55e;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px #22c55e;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        .moving-dot {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: var(--secondary);
          transition: left 3s linear;
          z-index: 3;
          filter: drop-shadow(0 0 5px var(--secondary));
        }

        .scm-interactive-controls {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }
        .tracking-search {
          display: flex;
          gap: 1rem;
          max-width: 600px;
        }
        .scm-input {
          flex: 1;
          background: var(--bg-darker);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }
        .scm-input:focus { border-color: var(--secondary); }

        .tracking-result {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        .progress-bar-bg {
          height: 6px;
          background: var(--bg-darker);
          border-radius: 3px;
          margin-top: 1rem;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(to right, var(--secondary), #a855f7);
          transition: width 0.5s ease;
        }

        .tracking-timeline {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          position: relative;
        }
        .tracking-timeline::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--glass-border);
          z-index: 1;
        }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }
        .step-dot {
          width: 20px;
          height: 20px;
          background: var(--bg-darker);
          border: 2px solid var(--glass-border);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .timeline-step.done .step-dot {
          background: var(--secondary);
          border-color: var(--secondary);
          box-shadow: 0 0 10px var(--secondary);
        }
        .timeline-step span {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .timeline-step.done span {
          color: white;
        }

        .scm-secondary-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .hub-capacity-card {
          padding: 2rem;
        }
        .hub-bars {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .hub-bar-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .hub-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .hub-progress-bg {
          height: 10px;
          background: var(--bg-darker);
          border-radius: 5px;
          overflow: hidden;
        }
        .hub-progress-fill {
          height: 100%;
          background: var(--secondary);
          border-radius: 5px;
        }
        .hub-progress-fill.full { background: #ef4444; }
        .hub-progress-fill.low { background: #f59e0b; }

        .scm-stats-grid-mini {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .india-map-container {
          display: flex;
          gap: 2rem;
          background: var(--bg-darker);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }
        .india-svg {
          flex: 1;
          max-height: 500px;
        }
        .hub-dot {
          filter: drop-shadow(0 0 5px #3b82f6);
        }
        .hub-label {
          font-size: 10px;
          fill: var(--text-muted);
          font-weight: 600;
        }
        .active-tracking-dot {
          filter: drop-shadow(0 0 10px #22c55e);
        }
        .map-legend {
          display: flex;
          gap: 1.5rem;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-item .dot.blue { background: #3b82f6; box-shadow: 0 0 5px #3b82f6; }
        .legend-item .dot.orange { background: #f59e0b; box-shadow: 0 0 5px #f59e0b; }

        .map-stats-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          justify-content: center;
          padding-left: 2rem;
          border-left: 1px solid var(--glass-border);
        }
        .map-stat-item h4 { font-size: 1.5rem; margin-top: 0.25rem; font-weight: 800; color: var(--secondary); }
        .map-stat-item small { color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .truck-track-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: 15px;
          border: 1px solid var(--glass-border);
        }

        @media (max-width: 992px) {
          .scm-secondary-grid { grid-template-columns: 1fr; }
          .india-map-container { flex-direction: column; }
          .map-stats-panel { border-left: none; border-top: 1px solid var(--glass-border); padding: 2rem 0 0 0; flex-direction: row; flex-wrap: wrap; }
        }

        @media (max-width: 768px) {
          .scm-visual-flow {
            flex-direction: column;
            gap: 2rem;
            height: auto;
          }
          .flow-connector {
            width: 2px;
            height: 60px;
            margin: 0;
          }
          .connector-line {
            width: 2px;
            height: 100%;
          }
          .moving-dot {
            top: 0;
            left: 50% !important;
            transform: translateX(-50%);
            transition: top 3s linear;
          }
        }
      ` }} />
    </div>
  );
};

export default SCM;
