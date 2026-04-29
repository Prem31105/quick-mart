import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginAPI } from '../api';
import { encryptData, decryptData } from '../utils/encryption.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage using decryption
  useEffect(() => {
    const encToken = localStorage.getItem('token');
    const encUser = localStorage.getItem('user');
    
    if (encToken && encUser) {
      try {
        const decryptedUser = decryptData(encUser);
        if (decryptedUser) {
          setUser(decryptedUser);
        } else {
          throw new Error('Decryption failed');
        }
      } catch {
        // If decryption fails (e.g., tampered data or old unencrypted data), clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (role, password) => {
    setError('');
    try {
      const data = await loginAPI({ role, password });
      
      // Encrypt sensitive user data and token before storing in localStorage
      const encryptedToken = encryptData(data.token);
      const encryptedUser = encryptData(data.user);
      
      localStorage.setItem('token', encryptedToken);
      localStorage.setItem('user', encryptedUser);
      
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) return null; // Don't render until session is checked

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
