import { encryptData, decryptData } from './utils/encryption.js';
const API_BASE = '/api';

const getToken = () => {
  const encToken = localStorage.getItem('token');
  return encToken ? decryptData(encToken) : null;
};

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handleRes = async (res) => {
  const text = await res.text();
  if (!text) throw new Error('Empty response');
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  } catch (e) {
    if (!res.ok) throw new Error(`API Error (${res.status})`);
    throw e;
  }
};

// Auth
export const loginAPI = (body) => {
  const payload = { ...body };
  if (payload.password) payload.password = encryptData(payload.password);
  return fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then(handleRes);
};

export const registerAPI = (body) => {
  const payload = { ...body };
  if (payload.password) payload.password = encryptData(payload.password);
  return fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then(handleRes);
};

// Products
export const fetchProducts = () =>
  fetch(`${API_BASE}/products`, { headers: headers() }).then(handleRes);

// Orders
export const createOrder = (body) =>
  fetch(`${API_BASE}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const fetchAllOrders = (status = 'all') =>
  fetch(`${API_BASE}/orders?status=${status}`, { headers: headers() }).then(handleRes);

export const fetchMyOrders = () =>
  fetch(`${API_BASE}/orders/my-orders`, { headers: headers() }).then(handleRes);

export const updateOrderStatus = (id, body) =>
  fetch(`${API_BASE}/orders/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const trackOrder = (orderId) =>
  fetch(`${API_BASE}/orders/track/${orderId}`, { headers: headers() }).then(handleRes);

// Notifications
export const sendNotification = (body) =>
  fetch(`${API_BASE}/notifications`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const fetchNotifications = () =>
  fetch(`${API_BASE}/notifications`, { headers: headers() }).then(handleRes);

export const fetchUnreadCount = () =>
  fetch(`${API_BASE}/notifications/unread-count`, { headers: headers() }).then(handleRes);

export const markNotificationRead = (id) =>
  fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT', headers: headers() }).then(handleRes);

export const markAllRead = () =>
  fetch(`${API_BASE}/notifications/read-all`, { method: 'PUT', headers: headers() }).then(handleRes);

// Inventory
export const fetchHubs = () =>
  fetch(`${API_BASE}/inventory/hubs`, { headers: headers() }).then(handleRes);

export const fetchHubStock = (city) =>
  fetch(`${API_BASE}/inventory/hubs/${city}`, { headers: headers() }).then(handleRes);

export const updateStock = (body) =>
  fetch(`${API_BASE}/inventory/stock`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const fetchLowStock = () =>
  fetch(`${API_BASE}/inventory/low-stock`, { headers: headers() }).then(handleRes);

// Dashboard
export const fetchDashboardStats = () =>
  fetch(`${API_BASE}/dashboard/stats`, { headers: headers() }).then(handleRes);

export const fetchRecentOrders = () =>
  fetch(`${API_BASE}/dashboard/recent-orders`, { headers: headers() }).then(handleRes);

// Tickets
export const createTicket = (body) =>
  fetch(`${API_BASE}/tickets`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const fetchMyTickets = () =>
  fetch(`${API_BASE}/tickets/my-tickets`, { headers: headers() }).then(handleRes);

export const fetchAllTickets = (status = 'all') =>
  fetch(`${API_BASE}/tickets?status=${status}`, { headers: headers() }).then(handleRes);

export const fetchOrderTickets = (orderId) =>
  fetch(`${API_BASE}/tickets/order/${orderId}`, { headers: headers() }).then(handleRes);

export const fetchTicketStats = () =>
  fetch(`${API_BASE}/tickets/stats`, { headers: headers() }).then(handleRes);

export const updateTicketStatus = (id, body) =>
  fetch(`${API_BASE}/tickets/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const sendTicketMessage = (id, body) =>
  fetch(`${API_BASE}/tickets/${id}/messages`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const fetchOrdersWithComplaints = () =>
  fetch(`${API_BASE}/tickets/orders-with-complaints`, { headers: headers() }).then(handleRes);

// Payment (Razorpay)
export const createPaymentOrder = (body) =>
  fetch(`${API_BASE}/payment/create-order`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const verifyPayment = (body) =>
  fetch(`${API_BASE}/payment/verify`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const getPaymentConfig = () =>
  fetch(`${API_BASE}/payment/config`, { headers: headers() }).then(handleRes);
