import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Revenue from './pages/Revenue';
import Marketing from './pages/Marketing';
import CRM from './pages/CRM';
import Strategy from './pages/Strategy';
import SCM from './pages/SCM';
import Security from './pages/Security';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MyOrders from './pages/MyOrders';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/crm' : '/'} replace />} />

        <Route path="/" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Products /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['user']}><MyOrders /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<ProtectedRoute allowedRoles={['user']}><PrivacyPolicy /></ProtectedRoute>} />

        <Route path="/revenue" element={<ProtectedRoute allowedRoles={['admin']}><Revenue /></ProtectedRoute>} />
        <Route path="/marketing" element={<ProtectedRoute allowedRoles={['admin']}><Marketing /></ProtectedRoute>} />
        <Route path="/crm" element={<ProtectedRoute allowedRoles={['admin']}><CRM /></ProtectedRoute>} />
        <Route path="/strategy" element={<ProtectedRoute allowedRoles={['admin']}><Strategy /></ProtectedRoute>} />
        <Route path="/scm" element={<ProtectedRoute allowedRoles={['admin']}><SCM /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute allowedRoles={['admin']}><Security /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/crm' : '/') : '/login'} replace />} />
      </Routes>
      {user && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
