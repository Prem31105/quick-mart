import React, { createContext, useState, useContext, useEffect } from 'react';
import { sendNotification } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id || item._id === product._id);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id || item._id === product._id) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, id: product._id || product.id, quantity: 1 }];
    });

    // Send notification to admin (fire-and-forget)
    sendNotification({
      type: 'cart_add',
      title: 'Item Added to Cart',
      message: `A customer added "${product.name}" (₹${product.price.toLocaleString('en-IN')}) to their cart`,
      productName: product.name,
      amount: product.price,
    }).catch(() => {}); // Ignore errors
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item.id || item._id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item => (item.id || item._id) === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
