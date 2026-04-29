import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, MapPin, Phone, CreditCard, Truck, MessageSquare, Send, Camera, AlertTriangle } from 'lucide-react';
import { fetchAllOrders, updateOrderStatus, fetchOrderTickets, updateTicketStatus, sendTicketMessage, fetchAllTickets } from '../api';
import './DemoPages.css';
import './CRM.css';

const statusFlow = ['placed', 'confirmed', 'packaging', 'shipped', 'in_hub', 'out_for_delivery', 'delivered'];
const statusLabels = {
  placed: 'Placed', confirmed: 'Confirmed', packaging: 'Packaging',
  shipped: 'Shipped', in_hub: 'In Hub', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};
const statusColors = {
  placed: 'badge-warning', confirmed: 'badge-info', packaging: 'badge-info',
  shipped: 'badge-primary', in_hub: 'badge-primary', out_for_delivery: 'badge-warning',
  delivered: 'badge-success', cancelled: 'badge-danger',
};

const ticketStatusLabels = {
  raised: 'Raised', accepted: 'Accepted', in_process: 'In Process', info_requested: 'Info Requested',
  resolved: 'Resolved', refund_initiated: 'Refund Initiated', refund_completed: 'Refund Done', rejected: 'Rejected',
};
const ticketStatusColors = {
  raised: 'badge-warning', accepted: 'badge-info', in_process: 'badge-primary', info_requested: 'badge-warning',
  resolved: 'badge-success', refund_initiated: 'badge-warning', refund_completed: 'badge-success', rejected: 'badge-danger',
};
const ticketFlow = ['raised', 'accepted', 'in_process', 'resolved', 'refund_initiated', 'refund_completed'];

const typeLabels = {
  return: '↩️ Return', damaged: '📦 Damaged', wrong_product: '🔄 Wrong Product',
  not_working: '⚠️ Not Working', missing_parts: '🧩 Missing Parts', quality_issue: '👎 Quality', other: '📝 Other'
};

const Revenue = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [orderTickets, setOrderTickets] = useState({});
  const [ticketNote, setTicketNote] = useState('');
  const [ticketRefund, setTicketRefund] = useState('');
  const [updatingTicket, setUpdatingTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  // Complaints view
  const [viewMode, setViewMode] = useState('orders'); // 'orders' | 'complaints'
  const [allTickets, setAllTickets] = useState([]);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [expandedTicket, setExpandedTicket] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders(filter);
      setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadTickets = async () => {
    try {
      const data = await fetchAllTickets(ticketFilter);
      setAllTickets(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (viewMode === 'orders') loadOrders(); }, [filter, viewMode]);
  useEffect(() => { if (viewMode === 'complaints') loadTickets(); }, [ticketFilter, viewMode]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus, note: `Admin updated status to ${statusLabels[newStatus]}` });
      await loadOrders();
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setUpdating(null); }
  };

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const handleTicketAction = async (ticketId, status, note, refundAmount, orderId) => {
    try {
      await updateTicketStatus(ticketId, { status, note, refundAmount: refundAmount ? parseInt(refundAmount) : undefined });
      // Refresh
      if (orderId) {
        const updated = await fetchOrderTickets(orderId);
        setOrderTickets(prev => ({ ...prev, [orderId]: updated }));
      }
      if (viewMode === 'complaints') await loadTickets();
      setTicketNote(''); setTicketRefund('');
    } catch (err) { alert(err.message); }
  };

  const handleSendChat = async (ticketId, orderId) => {
    if (!chatMessage.trim()) return;
    try {
      const updated = await sendTicketMessage(ticketId, { message: chatMessage });
      setChatMessage('');
      // Refresh ticket data
      if (orderId) {
        const tickets = await fetchOrderTickets(orderId);
        setOrderTickets(prev => ({ ...prev, [orderId]: tickets }));
      }
      if (viewMode === 'complaints') await loadTickets();
    } catch (err) { alert(err.message); }
  };

  const handleRequestImages = async (ticketId, orderId) => {
    try {
      await updateTicketStatus(ticketId, { status: 'info_requested', note: 'Please share images of the damaged/defective product for verification' });
      if (orderId) {
        const updated = await fetchOrderTickets(orderId);
        setOrderTickets(prev => ({ ...prev, [orderId]: updated }));
      }
      if (viewMode === 'complaints') await loadTickets();
    } catch (err) { alert(err.message); }
  };

  const filters = ['all', ...statusFlow, 'cancelled'];
  const ticketFilters = ['all', 'raised', 'accepted', 'in_process', 'info_requested', 'resolved', 'refund_initiated', 'refund_completed', 'rejected'];

  // Ticket Chat + Action Component (reusable between Orders and Complaints views)
  const renderTicketCard = (ticket, orderId) => {
    const nextIdx = ticketFlow.indexOf(ticket.status) + 1;
    const nextStatus = nextIdx < ticketFlow.length ? ticketFlow[nextIdx] : null;
    const isChatOpen = activeChat === ticket._id;
    const isOpen = !['resolved', 'refund_completed', 'rejected'].includes(ticket.status);

    return (
      <div key={ticket._id} className="ticket-card-full">
        {/* Header */}
        <div className="ticket-card-header">
          <div>
            <strong>{ticket.ticketId}</strong>
            <span style={{margin: '0 0.5rem', color: 'var(--text-muted)'}}>·</span>
            <span>{typeLabels[ticket.type] || ticket.type}</span>
            <span style={{margin: '0 0.5rem', color: 'var(--text-muted)'}}>·</span>
            <span style={{color: 'var(--text-muted)'}}>{ticket.customerName}</span>
          </div>
          <span className={`badge ${ticketStatusColors[ticket.status]}`}>{ticketStatusLabels[ticket.status]}</span>
        </div>

        {/* Product & Description */}
        <p className="ticket-product">{ticket.productName}</p>
        <p className="ticket-desc">{ticket.description}</p>

        {/* Chat Thread */}
        <div className="chat-section">
          <div className="chat-toggle" onClick={() => setActiveChat(isChatOpen ? null : ticket._id)}>
            <MessageSquare size={16} />
            <span>Chat ({ticket.messages?.length || 0} messages)</span>
            {isChatOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </div>

          {isChatOpen && (
            <div className="chat-thread">
              {ticket.messages?.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.sender === 'admin' ? 'admin-msg' : 'customer-msg'}`}>
                  <div className="chat-msg-header">
                    <strong>{msg.sender === 'admin' ? '🛡️ Support Agent' : '👤 ' + msg.senderName}</strong>
                    <span>{new Date(msg.createdAt).toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'})}</span>
                  </div>
                  <p className={msg.type === 'image_request' ? 'image-request-msg' : ''}>
                    {msg.type === 'image_request' && <><Camera size={14} /> </>}
                    {msg.message}
                  </p>
                </div>
              ))}

              {/* Admin Reply Box */}
              {isOpen && (
                <div className="chat-reply-bar">
                  <input
                    type="text"
                    placeholder="Type a reply to customer..."
                    value={activeChat === ticket._id ? chatMessage : ''}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat(ticket._id, orderId)}
                    className="chat-input"
                  />
                  <button className="chat-send-btn" onClick={() => handleSendChat(ticket._id, orderId)}>
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOpen && (
          <div className="ticket-actions">
            {ticket.status === 'raised' && (
              <>
                <button className="btn-accept btn-sm" onClick={() => handleTicketAction(ticket._id, 'accepted', 'Complaint accepted, we will investigate', null, orderId)}>
                  ✅ Accept
                </button>
                <button className="btn-sm btn-camera" onClick={() => handleRequestImages(ticket._id, orderId)}>
                  📷 Request Images
                </button>
                <button className="btn-reject btn-sm" onClick={() => handleTicketAction(ticket._id, 'rejected', 'Complaint rejected', null, orderId)}>
                  ❌ Reject
                </button>
              </>
            )}
            {ticket.status === 'accepted' && (
              <>
                <button className="btn-primary btn-sm" onClick={() => handleTicketAction(ticket._id, 'in_process', 'Moving to investigation', null, orderId)}>
                  🔍 Start Processing
                </button>
                <button className="btn-sm btn-camera" onClick={() => handleRequestImages(ticket._id, orderId)}>
                  📷 Request Images
                </button>
              </>
            )}
            {ticket.status === 'info_requested' && (
              <div className="ticket-waiting-info">
                <AlertTriangle size={16} />
                <span>Waiting for customer to provide images/info...</span>
              </div>
            )}
            {ticket.status === 'in_process' && (
              <>
                <button className="btn-primary btn-sm" onClick={() => handleTicketAction(ticket._id, 'resolved', ticketNote || 'Issue has been resolved', null, orderId)}>
                  ✅ Mark Resolved
                </button>
                <div className="refund-input-group">
                  <input type="number" placeholder="₹ Refund" value={updatingTicket === ticket._id ? ticketRefund : ''} onChange={(e) => { setUpdatingTicket(ticket._id); setTicketRefund(e.target.value); }} className="refund-input" />
                  <button className="btn-sm btn-refund" onClick={() => handleTicketAction(ticket._id, 'refund_initiated', ticketNote || 'Refund initiated', ticketRefund, orderId)}>
                    💰 Initiate Refund
                  </button>
                </div>
              </>
            )}
            {ticket.status === 'resolved' && (
              <div className="ticket-waiting-info" style={{color: 'var(--success)'}}>
                <span>✅ This complaint has been resolved</span>
              </div>
            )}
            {ticket.status === 'refund_initiated' && (
              <button className="btn-accept btn-sm" onClick={() => handleTicketAction(ticket._id, 'refund_completed', `Refund of ₹${ticket.refundAmount || 0} processed`, null, orderId)}>
                ✅ Complete Refund
              </button>
            )}
          </div>
        )}

        {ticket.refundAmount && <p style={{fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.5rem'}}>💰 Refund: ₹{ticket.refundAmount.toLocaleString('en-IN')}</p>}
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Order <span className="text-gradient">Management</span></h1>
          <p className="page-subtitle">View, track, update orders and manage customer complaints</p>
        </header>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle animate-fade-in delay-100">
          <button className={`mode-btn ${viewMode === 'orders' ? 'active' : ''}`} onClick={() => setViewMode('orders')}>
            📦 Orders
          </button>
          <button className={`mode-btn ${viewMode === 'complaints' ? 'active' : ''}`} onClick={() => { setViewMode('complaints'); loadTickets(); }}>
            🎫 Complaints ({allTickets.filter(t => !['resolved','refund_completed','rejected'].includes(t.status)).length || '...'})
          </button>
        </div>

        {/* === ORDERS VIEW === */}
        {viewMode === 'orders' && (
          <>
            <div className="orders-filters animate-fade-in delay-100">
              {filters.map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All Orders' : statusLabels[f]}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="loading-spinner">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state"><Package size={48} /><p>No orders found.</p></div>
            ) : (
              <div className="animate-fade-in delay-200">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer</th><th>Phone</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <React.Fragment key={order._id}>
                        <tr onClick={async () => {
                          const newId = expandedOrder === order._id ? null : order._id;
                          setExpandedOrder(newId);
                          if (newId && !orderTickets[order.orderId]) {
                            try {
                              const tickets = await fetchOrderTickets(order.orderId);
                              setOrderTickets(prev => ({ ...prev, [order.orderId]: tickets }));
                            } catch (e) {}
                          }
                        }} style={{cursor: 'pointer'}}>
                          <td><strong>{order.orderId}</strong></td>
                          <td>{order.customerName}</td>
                          <td>{order.shippingAddress?.mobile || order.customerPhone}</td>
                          <td>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                          <td>{order.paymentMethod === 'razorpay' ? '💳 Razorpay' : '🚛 COD'}</td>
                          <td><span className={`badge ${statusColors[order.status]}`}>{statusLabels[order.status]}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>{expandedOrder === order._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan="8" style={{padding: 0}}>
                              <div className="order-expand">
                                {/* Order Details */}
                                <div className="order-detail-grid">
                                  <div className="order-detail-card">
                                    <h4><MapPin size={14} /> Shipping Address</h4>
                                    <p><strong>{order.shippingAddress?.fullName}</strong></p>
                                    <p>{order.shippingAddress?.address}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                                    <p><Phone size={12} /> {order.shippingAddress?.mobile}</p>
                                  </div>
                                  <div className="order-detail-card">
                                    <h4><Package size={14} /> Items</h4>
                                    {order.items?.map((item, i) => (
                                      <p key={i}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    ))}
                                  </div>
                                  <div className="order-detail-card">
                                    <h4><CreditCard size={14} /> Payment</h4>
                                    <p>{order.paymentMethod === 'razorpay' ? 'Razorpay' : 'COD'}</p>
                                    {order.paymentId && <p>ID: {order.paymentId}</p>}
                                    <p>Est: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : '—'}</p>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                {order.status !== 'cancelled' && (
                                  <div className="order-progress-bar">
                                    {statusFlow.map((s, i) => {
                                      const currentIdx = statusFlow.indexOf(order.status);
                                      return (
                                        <div key={s} className={`progress-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}>
                                          <div className="progress-dot">{i <= currentIdx ? '✓' : i + 1}</div>
                                          <span>{statusLabels[s]}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Actions */}
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <div className="status-update-bar">
                                    {order.status === 'placed' ? (
                                      <>
                                        <button className="btn-accept" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id, 'confirmed'); }} disabled={updating === order._id}>
                                          {updating === order._id ? '⏳ Accepting...' : '✅ Accept Order'}
                                        </button>
                                        <button className="btn-reject" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id, 'cancelled'); }} disabled={updating === order._id}>
                                          ❌ Reject Order
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <Truck size={18} />
                                        <span style={{fontWeight: 500}}>Move to next stage:</span>
                                        {getNextStatus(order.status) && (
                                          <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id, getNextStatus(order.status)); }} disabled={updating === order._id}>
                                            {updating === order._id ? '⏳' : `📦 ${statusLabels[getNextStatus(order.status)]}`}
                                          </button>
                                        )}
                                        <button className="btn-secondary btn-sm" style={{color: 'var(--danger)'}} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id, 'cancelled'); }} disabled={updating === order._id}>
                                          Cancel
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}

                                {/* Tickets for this Order */}
                                {(orderTickets[order.orderId] || []).length > 0 && (
                                  <div className="complaints-section-in-order">
                                    <h4 className="complaints-heading">
                                      <MessageSquare size={16} /> Customer Complaints ({(orderTickets[order.orderId] || []).length})
                                    </h4>
                                    {(orderTickets[order.orderId] || []).map(ticket => renderTicketCard(ticket, order.orderId))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* === COMPLAINTS VIEW === */}
        {viewMode === 'complaints' && (
          <>
            <div className="orders-filters animate-fade-in delay-100">
              {ticketFilters.map(f => (
                <button key={f} className={`filter-btn ${ticketFilter === f ? 'active' : ''}`} onClick={() => setTicketFilter(f)}>
                  {f === 'all' ? 'All' : ticketStatusLabels[f]}
                </button>
              ))}
            </div>

            {allTickets.length === 0 ? (
              <div className="empty-state animate-fade-in"><MessageSquare size={48} /><p>No complaints found.</p></div>
            ) : (
              <div className="animate-fade-in delay-200" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {allTickets.map(ticket => (
                  <div key={ticket._id} className="glass-card" style={{padding: '1.5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Order: <strong>{ticket.orderId}</strong></span>
                    </div>
                    {renderTicketCard(ticket, ticket.orderId)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Revenue;
