import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createPaymentOrder, verifyPayment, getPaymentConfig } from '../api';
import { CreditCard, MapPin, CheckCircle, Truck, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import RazorpayModal from '../components/RazorpayModal';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    mobile: ''
  });

  // Check if Razorpay is configured on mount
  useEffect(() => {
    getPaymentConfig()
      .then(config => setRazorpayConfigured(config.configured))
      .catch(() => setRazorpayConfigured(false));
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
      navigate('/');
    }
  }, [cartItems, navigate, step]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async (paymentId = null) => {
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const order = await createOrder({
        items: orderItems,
        shippingAddress: shipping,
        paymentMethod,
        paymentId,
        totalAmount: cartTotal,
      });

      setOrderData(order);
      clearCart();
      setStep(3);
    } catch (err) {
      alert('Failed to create order: ' + err.message);
    }
  };

  // Load Razorpay SDK script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Open real Razorpay checkout
  const openRazorpayCheckout = async () => {
    setIsProcessing(true);
    try {
      // Load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK. Check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // Create order on backend
      const paymentOrder = await createPaymentOrder({ amount: cartTotal });

      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Quick Mart',
        description: `Order payment — ₹${cartTotal.toLocaleString('en-IN')}`,
        order_id: paymentOrder.orderId,
        prefill: {
          name: shipping.fullName,
          email: user?.email || '',
          contact: shipping.mobile,
        },
        theme: {
          color: '#0f172a',
          backdrop_color: 'rgba(15, 23, 42, 0.75)',
        },
        handler: async function (response) {
          // Verify payment on server
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.verified) {
              await placeOrder(response.razorpay_payment_id);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            alert('Payment verification error: ' + err.message);
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
          confirm_close: true,
          escape: false,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (err) {
      alert('Failed to initiate payment: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'cod') {
      setIsProcessing(true);
      await placeOrder();
      setIsProcessing(false);
      return;
    }

    // If Razorpay is configured with real keys, use official Razorpay checkout
    if (razorpayConfigured) {
      await openRazorpayCheckout();
    } else {
      // Fallback: Open the custom simulated modal
      setShowRazorpay(true);
    }
  };

  const handleRazorpaySuccess = async (paymentId) => {
    setShowRazorpay(false);
    setIsProcessing(true);
    await placeOrder(paymentId);
    setIsProcessing(false);
  };

  const handleRazorpayFailure = () => {
    setShowRazorpay(false);
    // Payment failed – user stays on payment step
  };

  if (cartItems.length === 0 && step !== 3) {
    return null;
  }

  return (
    <div className="page-wrapper checkout-wrapper">
      <div className="container">

        <div className="checkout-stepper animate-fade-in">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-icon"><MapPin size={20} /></div>
            <span>Shipping</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-icon"><CreditCard size={20} /></div>
            <span>Payment</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-icon"><CheckCircle size={20} /></div>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main glass-card animate-fade-in delay-100">
            {step === 1 && (
              <div className="checkout-step-container">
                <h2 className="checkout-title">Shipping Details</h2>
                <form onSubmit={handleShippingSubmit} className="checkout-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={shipping.fullName} onChange={handleShippingChange} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="mobile" value={shipping.mobile} onChange={handleShippingChange} required placeholder="+91 9876543210" />
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input type="text" name="address" value={shipping.address} onChange={handleShippingChange} required placeholder="123 Main St, Apartment 4B" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={shipping.city} onChange={handleShippingChange} required placeholder="Mumbai" />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={shipping.state} onChange={handleShippingChange} required placeholder="Maharashtra" />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input type="text" name="pincode" value={shipping.pincode} onChange={handleShippingChange} required placeholder="400001" />
                    </div>
                  </div>
                  <div className="checkout-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                      <ArrowLeft size={16} /> Back to Store
                    </button>
                    <button type="submit" className="btn-primary">
                      Proceed to Payment <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-step-container">
                <h2 className="checkout-title">Payment Method</h2>
                <div className="payment-options">
                  <div className={`payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
                    <CreditCard className="text-primary" size={24} />
                    <div className="payment-option-details">
                      <h4>Razorpay</h4>
                      <p>Cards, UPI, NetBanking, Wallets</p>
                    </div>
                    <div className="radio-circle"></div>
                  </div>
                  <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                    <Truck className="text-primary" size={24} />
                    <div className="payment-option-details">
                      <h4>Cash on Delivery (COD)</h4>
                      <p>Pay when your order arrives</p>
                    </div>
                    <div className="radio-circle"></div>
                  </div>
                </div>
                <form onSubmit={handlePaymentSubmit} className="checkout-form payment-form">
                  <div className="secure-badge mt-4">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Your payment information is encrypted and secure.</span>
                  </div>
                  <div className="checkout-actions">
                    <button type="button" className="btn-secondary" onClick={() => setStep(1)} disabled={isProcessing}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn-primary" disabled={isProcessing}>
                      {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${cartTotal.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-step-container success-container">
                <div className="success-icon animate-bounce-in">
                  <CheckCircle size={80} className="text-success" />
                </div>
                <h2 className="checkout-title text-center mt-4">Order Placed Successfully!</h2>
                <p className="text-center text-muted">Thank you for your purchase.</p>

                <div className="order-details-card">
                  <div className="order-row">
                    <span>Order ID</span>
                    <strong>{orderData?.orderId || '—'}</strong>
                  </div>
                  <div className="order-row">
                    <span>Amount</span>
                    <strong>₹{(orderData?.totalAmount || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="order-row">
                    <span>Shipping To</span>
                    <strong>{shipping.fullName}, {shipping.city}</strong>
                  </div>
                </div>

                <div className="delivery-estimate">
                  <Truck className="text-primary" size={24} />
                  <div>
                    <h4>Estimated Delivery</h4>
                    <p>{orderData?.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Within 5-7 business days'}</p>
                  </div>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn-primary mt-4" onClick={() => navigate('/my-orders')}>
                    Track Order
                  </button>
                  <button className="btn-secondary mt-4" onClick={() => navigate('/')}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {step !== 3 && (
            <div className="checkout-sidebar glass-card animate-fade-in delay-200">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id || item._id} className="summary-item">
                    <div className="summary-item-img">
                      <img src={item.image} alt={item.name} />
                      <span className="summary-item-qty">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <h4>{item.name}</h4>
                      <p>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="text-gradient">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Razorpay Modal (fallback when keys not configured) */}
      <RazorpayModal
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        amount={cartTotal}
        customerName={shipping.fullName}
        customerEmail={user?.email}
        customerPhone={shipping.mobile}
        onSuccess={handleRazorpaySuccess}
        onFailure={handleRazorpayFailure}
      />
    </div>
  );
};

export default Checkout;
