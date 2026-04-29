import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, Truck, Box, MapPin, ChevronDown, ChevronUp, Star, RotateCcw, AlertTriangle, X, MessageSquare, Send, Camera } from 'lucide-react';
import { fetchMyOrders, createTicket, fetchMyTickets, sendTicketMessage } from '../api';
import './DemoPages.css';
import './CRM.css';

const statusSteps = [
  { key: 'placed', label: 'Placed', icon: <Package size={16} /> },
  { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={16} /> },
  { key: 'packaging', label: 'Packaging', icon: <Box size={16} /> },
  { key: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
  { key: 'in_hub', label: 'In Hub', icon: <MapPin size={16} /> },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={16} /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> },
];

const issueTypes = [
  { value: 'damaged', label: '📦 Received Damaged Product', desc: 'Product arrived broken or damaged' },
  { value: 'wrong_product', label: '🔄 Received Wrong Product', desc: 'A different product was delivered' },
  { value: 'not_working', label: '⚠️ Product Not Working', desc: 'Product is defective or malfunctioning' },
  { value: 'missing_parts', label: '🧩 Missing Parts/Accessories', desc: 'Some components are missing from the package' },
  { value: 'quality_issue', label: '👎 Quality Issue', desc: 'Product quality does not match the description' },
  { value: 'return', label: '↩️ Want to Return', desc: 'I want to return this product' },
  { value: 'other', label: '📝 Other Issue', desc: 'Some other problem with the order' },
];

const ticketStatusLabels = {
  raised: 'Raised', accepted: 'Accepted', in_process: 'In Process', info_requested: 'Info Requested',
  resolved: 'Resolved', refund_initiated: 'Refund Initiated', refund_completed: 'Refund Done', rejected: 'Rejected',
};
const ticketStatusColors = {
  raised: 'badge-warning', accepted: 'badge-info', in_process: 'badge-primary', info_requested: 'badge-warning',
  resolved: 'badge-success', refund_initiated: 'badge-warning', refund_completed: 'badge-success', rejected: 'badge-danger',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showComplaintForm, setShowComplaintForm] = useState(null); // orderId
  const [complaintProduct, setComplaintProduct] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [activeChat, setActiveChat] = useState(null);
  const [chatReply, setChatReply] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [orderData, ticketData] = await Promise.all([fetchMyOrders(), fetchMyTickets()]);
        setOrders(orderData);
        setTickets(ticketData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
  };

  const handleRating = (orderId, productName, stars) => {
    setRatings(prev => ({ ...prev, [`${orderId}-${productName}`]: stars }));
  };

  const handleComplaintSubmit = async (order) => {
    if (!complaintType || !complaintDesc) return alert('Please select issue type and provide description');
    setSubmitting(true);
    try {
      await createTicket({
        orderId: order.orderId,
        orderObjectId: order._id,
        type: complaintType,
        productName: complaintProduct || order.items?.map(i => i.name).join(', '),
        description: complaintDesc,
      });
      const ticketData = await fetchMyTickets();
      setTickets(ticketData);
      setShowComplaintForm(null);
      setComplaintType('');
      setComplaintDesc('');
      setComplaintProduct('');
      alert('✅ Complaint raised successfully! Our team will look into it.');
    } catch (err) {
      alert('Failed to raise complaint: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const orderTickets = (orderId) => tickets.filter(t => t.orderId === orderId);

  const handleSendReply = async (ticketId) => {
    if (!chatReply.trim()) return;
    try {
      await sendTicketMessage(ticketId, { message: chatReply });
      setChatReply('');
      const ticketData = await fetchMyTickets();
      setTickets(ticketData);
    } catch (err) { alert(err.message); }
  };

  if (loading) {
    return <div className="page-wrapper"><div className="container"><div className="loading-spinner">Loading Your Orders...</div></div></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">My <span className="text-gradient">Orders</span></h1>
          <p className="page-subtitle">Track orders, rate products, and raise complaints</p>
        </header>

        {/* Tabs */}
        <div className="orders-filters animate-fade-in delay-100" style={{marginBottom: '2rem'}}>
          <button className={`filter-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📦 My Orders ({orders.length})
          </button>
          <button className={`filter-btn ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
            🎫 My Complaints ({tickets.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="empty-state animate-fade-in"><Package size={48} /><p>No orders yet.</p></div>
            ) : (
              <div className="animate-fade-in delay-100" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {orders.map(order => {
                  const currentIdx = getStepIndex(order.status);
                  const isExpanded = expanded === order._id;
                  const isDelivered = order.status === 'delivered';
                  const oTickets = orderTickets(order.orderId);

                  return (
                    <div key={order._id} className="glass-card" style={{padding: 0, overflow: 'hidden'}}>
                      <div
                        style={{padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        onClick={() => setExpanded(isExpanded ? null : order._id)}
                      >
                        <div>
                          <h3 style={{fontSize: '1.1rem', marginBottom: '0.25rem'}}>{order.orderId}</h3>
                          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                            {order.items?.length} item(s) · ₹{(order.totalAmount || 0).toLocaleString('en-IN')} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          {oTickets.length > 0 && <span className="badge badge-warning">🎫 {oTickets.length} ticket(s)</span>}
                          <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'cancelled' ? 'badge-danger' : 'badge-info'}`}>
                            {order.status === 'in_hub' ? 'In Hub' : order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </span>
                          {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)'}}>
                          {/* Status Timeline */}
                          {order.status !== 'cancelled' && (
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', position: 'relative'}}>
                              <div style={{position: 'absolute', top: '2.2rem', left: '2%', right: '2%', height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 4, zIndex: 0}}>
                                <div style={{width: `${Math.max(0, (currentIdx / (statusSteps.length - 1)) * 100)}%`, height: '100%', background: 'var(--success)', borderRadius: 4, transition: 'width 0.5s ease'}}></div>
                              </div>
                              {statusSteps.map((step, i) => (
                                <div key={step.key} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', position: 'relative', zIndex: 1, flex: 1}}>
                                  <div style={{width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: i <= currentIdx ? 'var(--success)' : 'rgba(0,0,0,0.06)', color: i <= currentIdx ? 'white' : 'var(--text-muted)', transition: 'all 0.3s'}}>
                                    {step.icon}
                                  </div>
                                  <span style={{fontSize: '0.7rem', fontWeight: i <= currentIdx ? 600 : 400, color: i <= currentIdx ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'center'}}>{step.label}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {order.status === 'cancelled' && (
                            <div style={{padding: '1rem', textAlign: 'center', color: 'var(--danger)', fontWeight: 600}}>❌ This order has been cancelled</div>
                          )}

                          {/* Items */}
                          <div style={{marginTop: '1rem'}}>
                            <h4 style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase'}}>Items</h4>
                            {order.items?.map((item, i) => (
                              <div key={i} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)'}}>
                                <img src={item.image} alt={item.name} style={{width: 40, height: 40, objectFit: 'contain', borderRadius: 6}} />
                                <span style={{flex: 1}}>{item.name}</span>
                                <span style={{color: 'var(--text-muted)'}}>×{item.quantity}</span>
                                <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                                {/* Rating for delivered items */}
                                {isDelivered && (
                                  <div style={{display: 'flex', gap: '2px'}}>
                                    {[1,2,3,4,5].map(star => (
                                      <Star key={star} size={16}
                                        fill={(ratings[`${order._id}-${item.name}`] || 0) >= star ? '#f59e0b' : 'none'}
                                        color="#f59e0b"
                                        style={{cursor: 'pointer'}}
                                        onClick={(e) => { e.stopPropagation(); handleRating(order._id, item.name, star); }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Delivery Info */}
                          <div style={{marginTop: '1.25rem', display: 'flex', gap: '2rem', fontSize: '0.9rem', flexWrap: 'wrap'}}>
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Shipping To: </span>
                              <strong>{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</strong>
                            </div>
                            {order.estimatedDelivery && (
                              <div>
                                <span style={{color: 'var(--text-muted)'}}>Expected: </span>
                                <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                              </div>
                            )}
                            {order.deliveredAt && (
                              <div>
                                <span style={{color: 'var(--success)'}}>Delivered: </span>
                                <strong>{new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                              </div>
                            )}
                          </div>

                          {/* Delivered: Action Buttons */}
                          {isDelivered && (
                            <div className="delivered-actions">
                              <button className="btn-action btn-return" onClick={(e) => { e.stopPropagation(); setShowComplaintForm(order._id); setComplaintType('return'); }}>
                                <RotateCcw size={16} /> Return Product
                              </button>
                              <button className="btn-action btn-issue" onClick={(e) => { e.stopPropagation(); setShowComplaintForm(order._id); setComplaintType(''); }}>
                                <AlertTriangle size={16} /> Report Issue
                              </button>
                            </div>
                          )}

                          {/* Complaint Form */}
                          {showComplaintForm === order._id && (
                            <div className="complaint-form-card animate-fade-in">
                              <div className="complaint-header">
                                <h4><MessageSquare size={18} /> Raise a Complaint</h4>
                                <button className="btn-close-complaint" onClick={() => setShowComplaintForm(null)}><X size={18} /></button>
                              </div>

                              {/* Select Product */}
                              {order.items?.length > 1 && (
                                <div className="complaint-field">
                                  <label>Select Product</label>
                                  <select value={complaintProduct} onChange={(e) => setComplaintProduct(e.target.value)} className="complaint-select">
                                    <option value="">All items in this order</option>
                                    {order.items.map((item, i) => (
                                      <option key={i} value={item.name}>{item.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* Issue Type */}
                              <div className="complaint-field">
                                <label>What's the issue?</label>
                                <div className="issue-type-grid">
                                  {issueTypes.map(issue => (
                                    <div
                                      key={issue.value}
                                      className={`issue-type-card ${complaintType === issue.value ? 'selected' : ''}`}
                                      onClick={() => setComplaintType(issue.value)}
                                    >
                                      <span className="issue-label">{issue.label}</span>
                                      <span className="issue-desc">{issue.desc}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Description */}
                              <div className="complaint-field">
                                <label>Describe your issue</label>
                                <textarea
                                  value={complaintDesc}
                                  onChange={(e) => setComplaintDesc(e.target.value)}
                                  placeholder="Please provide details about the issue..."
                                  className="complaint-textarea"
                                  rows={3}
                                />
                              </div>

                              <button
                                className="btn-primary"
                                onClick={() => handleComplaintSubmit(order)}
                                disabled={submitting || !complaintType}
                                style={{width: '100%', marginTop: '0.5rem'}}
                              >
                                {submitting ? '⏳ Submitting...' : '🎫 Raise Complaint'}
                              </button>
                            </div>
                          )}

                          {/* Existing Tickets for this order */}
                          {oTickets.length > 0 && (
                            <div className="order-tickets-section">
                              <h4 style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase'}}>🎫 Complaints & Tickets</h4>
                              {oTickets.map(ticket => {
                                const isChatOpen = activeChat === ticket._id;
                                const isOpen = !['resolved', 'refund_completed', 'rejected'].includes(ticket.status);
                                return (
                                  <div key={ticket._id} className="ticket-card-mini">
                                    <div className="ticket-mini-header">
                                      <strong>{ticket.ticketId}</strong>
                                      <span className={`badge ${ticketStatusColors[ticket.status]}`}>{ticketStatusLabels[ticket.status]}</span>
                                    </div>
                                    <p style={{fontSize: '0.9rem', margin: '0.25rem 0'}}>{ticket.productName}</p>

                                    {/* Info requested alert */}
                                    {ticket.status === 'info_requested' && (
                                      <div className="info-request-alert">
                                        <Camera size={16} />
                                        <span>Admin has requested images/additional information. Please reply below.</span>
                                      </div>
                                    )}

                                    {/* Chat Thread */}
                                    <div className="chat-section">
                                      <div className="chat-toggle" onClick={() => setActiveChat(isChatOpen ? null : ticket._id)}>
                                        <MessageSquare size={14} />
                                        <span>Chat with Support ({ticket.messages?.length || 0})</span>
                                        {isChatOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                      </div>
                                      {isChatOpen && (
                                        <div className="chat-thread">
                                          {ticket.messages?.map((msg, i) => (
                                            <div key={i} className={`chat-msg ${msg.sender === 'admin' ? 'admin-msg' : 'customer-msg'}`}>
                                              <div className="chat-msg-header">
                                                <strong>{msg.sender === 'admin' ? '🛡️ Support' : '👤 You'}</strong>
                                                <span>{new Date(msg.createdAt).toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'})}</span>
                                              </div>
                                              <p className={msg.type === 'image_request' ? 'image-request-msg' : ''}>
                                                {msg.type === 'image_request' && <><Camera size={14} /> </>}
                                                {msg.message}
                                              </p>
                                            </div>
                                          ))}
                                          {/* User reply box */}
                                          {isOpen && (
                                            <div className="chat-reply-bar">
                                              <input
                                                type="text"
                                                placeholder={ticket.status === 'info_requested' ? 'Provide requested info or describe the image...' : 'Reply to support...'}
                                                value={activeChat === ticket._id ? chatReply : ''}
                                                onChange={(e) => setChatReply(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply(ticket._id)}
                                                className="chat-input"
                                              />
                                              <button className="chat-send-btn" onClick={() => handleSendReply(ticket._id)}>
                                                <Send size={16} />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {ticket.refundAmount && (
                                      <p style={{fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.5rem'}}>💰 Refund: ₹{ticket.refundAmount.toLocaleString('en-IN')}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="animate-fade-in delay-100">
            {tickets.length === 0 ? (
              <div className="empty-state"><MessageSquare size={48} /><p>No complaints raised yet.</p></div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {tickets.map(ticket => {
                  const isChatOpen = activeChat === ticket._id;
                  const isOpen = !['resolved', 'refund_completed', 'rejected'].includes(ticket.status);
                  return (
                    <div key={ticket._id} className="glass-card" style={{padding: '1.5rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                        <div>
                          <h3 style={{fontSize: '1.05rem'}}>{ticket.ticketId} — {ticket.productName}</h3>
                          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Order: {ticket.orderId} · {new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <span className={`badge ${ticketStatusColors[ticket.status]}`}>{ticketStatusLabels[ticket.status]}</span>
                      </div>
                      <p style={{fontSize: '0.95rem', marginBottom: '0.5rem'}}>
                        {issueTypes.find(i => i.value === ticket.type)?.label || ticket.type}
                      </p>

                      {/* Info requested alert */}
                      {ticket.status === 'info_requested' && (
                        <div className="info-request-alert">
                          <Camera size={16} />
                          <span>Admin has requested images/additional information. Please reply below.</span>
                        </div>
                      )}

                      {ticket.refundAmount && <p style={{color: 'var(--success)', fontWeight: 600, marginTop: '0.25rem'}}>💰 Refund: ₹{ticket.refundAmount.toLocaleString('en-IN')}</p>}

                      {/* Chat Thread */}
                      <div className="chat-section" style={{marginTop: '0.75rem'}}>
                        <div className="chat-toggle" onClick={() => setActiveChat(isChatOpen ? null : ticket._id)}>
                          <MessageSquare size={14} />
                          <span>Chat with Support ({ticket.messages?.length || 0})</span>
                          {isChatOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                        </div>
                        {isChatOpen && (
                          <div className="chat-thread">
                            {ticket.messages?.map((msg, i) => (
                              <div key={i} className={`chat-msg ${msg.sender === 'admin' ? 'admin-msg' : 'customer-msg'}`}>
                                <div className="chat-msg-header">
                                  <strong>{msg.sender === 'admin' ? '🛡️ Support' : '👤 You'}</strong>
                                  <span>{new Date(msg.createdAt).toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'})}</span>
                                </div>
                                <p className={msg.type === 'image_request' ? 'image-request-msg' : ''}>
                                  {msg.type === 'image_request' && <><Camera size={14} /> </>}
                                  {msg.message}
                                </p>
                              </div>
                            ))}
                            {isOpen && (
                              <div className="chat-reply-bar">
                                <input
                                  type="text"
                                  placeholder={ticket.status === 'info_requested' ? 'Provide requested info or describe the image...' : 'Reply to support...'}
                                  value={activeChat === ticket._id ? chatReply : ''}
                                  onChange={(e) => setChatReply(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply(ticket._id)}
                                  className="chat-input"
                                />
                                <button className="chat-send-btn" onClick={() => handleSendReply(ticket._id)}>
                                  <Send size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
