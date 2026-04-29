import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''} glass-panel`}>
        <div className="cart-header">
          <h3><ShoppingBag size={20} /> Your Cart</h3>
          <button className="close-btn" onClick={toggleCart}><X size={24} /></button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} className="text-muted" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item glass-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn-primary w-full" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
