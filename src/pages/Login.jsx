import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Lock, User, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('User');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(role, password);
    if (success) {
      if (role === 'Admin') {
        navigate('/crm');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="login-container page-wrapper">
      <div className="login-card glass-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <ShoppingBag className="brand-icon" size={32} />
          </div>
          <h2 className="login-title">Welcome to Quick <span className="text-gradient">Mart</span></h2>
          <p className="login-subtitle">Please log in to continue</p>
        </div>

        {error && (
          <div className="login-error animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="role">Select Role</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <select 
                id="role"
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                id="password"
                type="password" 
                className="form-input" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full login-btn">
            Sign In as {role}
          </button>
        </form>
        
        <div className="login-hints">
          <p><strong>Demo Credentials:</strong></p>
          <p>User: <code>user123</code></p>
          <p>Admin: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
