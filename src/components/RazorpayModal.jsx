import React, { useState, useEffect, useRef } from 'react';
import {
  X, ChevronRight, Lock, ShieldCheck, CreditCard,
  Smartphone, Building2, Wallet, CheckCircle, XCircle,
  ArrowLeft, Eye, EyeOff, Loader2
} from 'lucide-react';
import './RazorpayModal.css';

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', short: 'SBI', color: '#1a4fa0' },
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC', color: '#004c8f' },
  { id: 'icici', name: 'ICICI Bank', short: 'ICICI', color: '#f37920' },
  { id: 'axis', name: 'Axis Bank', short: 'AXIS', color: '#97144d' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', short: 'KOTAK', color: '#ed1c24' },
  { id: 'bob', name: 'Bank of Baroda', short: 'BOB', color: '#f47920' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB', color: '#0a2f6e' },
  { id: 'yes', name: 'YES Bank', short: 'YES', color: '#0072bc' },
];

const RazorpayModal = ({ isOpen, onClose, amount, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
  const [activeTab, setActiveTab] = useState('netbanking');
  const [selectedBank, setSelectedBank] = useState(null);
  const [phase, setPhase] = useState('select'); // select | bankLogin | otp | processing | result
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(120);
  const [result, setResult] = useState(null); // 'success' | 'failure'
  const [processingText, setProcessingText] = useState('');
  const otpRefs = useRef([]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab('netbanking');
      setSelectedBank(null);
      setPhase('select');
      setLoginId('');
      setLoginPass('');
      setShowPass(false);
      setOtp(['', '', '', '', '', '']);
      setOtpTimer(120);
      setResult(null);
    }
  }, [isOpen]);

  // OTP countdown timer
  useEffect(() => {
    if (phase === 'otp' && otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, otpTimer]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const handleProceedToBank = () => {
    if (!selectedBank) return;
    setPhase('bankLogin');
  };

  const handleBankLogin = (e) => {
    e.preventDefault();
    setPhase('otp');
    setOtpTimer(120);
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => otpRefs.current[0]?.focus(), 300);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpVal = otp.join('');
    if (otpVal.length < 6) return;

    setPhase('processing');
    const steps = [
      'Connecting to bank server...',
      'Verifying OTP...',
      'Authenticating transaction...',
      `Debiting ₹${amount.toLocaleString('en-IN')} from account...`,
      'Confirming with Razorpay...',
    ];

    let i = 0;
    setProcessingText(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setProcessingText(steps[i]);
      } else {
        clearInterval(interval);
        // Random success/failure (80% success)
        const isSuccess = Math.random() > 0.2;
        setResult(isSuccess ? 'success' : 'failure');
        setPhase('result');
      }
    }, 900);
  };

  const handleResultAction = () => {
    if (result === 'success') {
      const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
      onSuccess(fakePaymentId);
    } else {
      onFailure();
    }
    onClose();
  };

  const handleRetry = () => {
    setPhase('select');
    setSelectedBank(null);
    setLoginId('');
    setLoginPass('');
    setOtp(['', '', '', '', '', '']);
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="rzp-overlay" onClick={onClose}>
      <div className="rzp-modal" onClick={(e) => e.stopPropagation()}>

        {/* ─── Razorpay Header ─── */}
        <div className="rzp-header">
          <div className="rzp-header-left">
            <div className="rzp-merchant-logo">QM</div>
            <div>
              <div className="rzp-merchant-name">Quick Mart</div>
              <div className="rzp-amount">₹{amount.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <button className="rzp-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* ─── Customer Info Bar ─── */}
        <div className="rzp-customer-bar">
          <span>{customerEmail || 'customer@quickmart.com'}</span>
          <span>|</span>
          <span>{customerPhone || '+91 9876543210'}</span>
        </div>

        {/* ─── Main Body ─── */}
        <div className="rzp-body">

          {/* PHASE: Payment Method Selection */}
          {phase === 'select' && (
            <>
              {/* Tabs */}
              <div className="rzp-tabs">
                <button className={`rzp-tab ${activeTab === 'upi' ? 'active' : ''}`} onClick={() => setActiveTab('upi')}>
                  <Smartphone size={16} /> UPI
                </button>
                <button className={`rzp-tab ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setActiveTab('cards')}>
                  <CreditCard size={16} /> Cards
                </button>
                <button className={`rzp-tab ${activeTab === 'netbanking' ? 'active' : ''}`} onClick={() => setActiveTab('netbanking')}>
                  <Building2 size={16} /> Net Banking
                </button>
                <button className={`rzp-tab ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
                  <Wallet size={16} /> Wallet
                </button>
              </div>

              {/* Tab Content */}
              <div className="rzp-tab-content">
                {activeTab === 'netbanking' && (
                  <div className="rzp-netbanking">
                    <h4 className="rzp-section-title">Popular Banks</h4>
                    <div className="rzp-bank-grid">
                      {BANKS.map((bank) => (
                        <div
                          key={bank.id}
                          className={`rzp-bank-card ${selectedBank?.id === bank.id ? 'selected' : ''}`}
                          onClick={() => handleBankSelect(bank)}
                        >
                          <div className="rzp-bank-icon" style={{ background: bank.color }}>
                            {bank.short.charAt(0)}
                          </div>
                          <span className="rzp-bank-name">{bank.short}</span>
                        </div>
                      ))}
                    </div>
                    {selectedBank && (
                      <div className="rzp-selected-bank-info">
                        <Building2 size={16} />
                        <span>Selected: <strong>{selectedBank.name}</strong></span>
                      </div>
                    )}
                    <button
                      className="rzp-pay-btn"
                      disabled={!selectedBank}
                      onClick={handleProceedToBank}
                    >
                      Pay ₹{amount.toLocaleString('en-IN')} via Net Banking
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {activeTab === 'upi' && (
                  <div className="rzp-other-method">
                    <Smartphone size={40} className="rzp-other-icon" />
                    <p>Enter your UPI ID to pay</p>
                    <div className="rzp-upi-input-wrap">
                      <input type="text" placeholder="yourname@upi" className="rzp-upi-input" />
                    </div>
                    <button className="rzp-pay-btn" onClick={handleProceedToBank} disabled>
                      Verify and Pay
                    </button>
                    <p className="rzp-coming-soon">UPI payment simulation coming soon</p>
                  </div>
                )}

                {activeTab === 'cards' && (
                  <div className="rzp-other-method">
                    <CreditCard size={40} className="rzp-other-icon" />
                    <p>Card payment details</p>
                    <div className="rzp-upi-input-wrap">
                      <input type="text" placeholder="Card Number" className="rzp-upi-input" />
                    </div>
                    <button className="rzp-pay-btn" disabled>
                      Pay via Card
                    </button>
                    <p className="rzp-coming-soon">Select Net Banking for full demo experience</p>
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div className="rzp-other-method">
                    <Wallet size={40} className="rzp-other-icon" />
                    <p>Select your wallet</p>
                    <div className="rzp-wallet-list">
                      {['Paytm', 'PhonePe', 'Amazon Pay', 'Freecharge'].map(w => (
                        <div key={w} className="rzp-wallet-item">{w}</div>
                      ))}
                    </div>
                    <p className="rzp-coming-soon">Select Net Banking for full demo experience</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PHASE: Bank Login Page */}
          {phase === 'bankLogin' && selectedBank && (
            <div className="rzp-bank-page">
              <div className="rzp-bank-page-header" style={{ background: selectedBank.color }}>
                <button className="rzp-bank-back" onClick={() => setPhase('select')}>
                  <ArrowLeft size={18} color="white" />
                </button>
                <div className="rzp-bank-logo-big" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {selectedBank.short.charAt(0)}
                </div>
                <div className="rzp-bank-header-info">
                  <h3>{selectedBank.name}</h3>
                  <span>Internet Banking Login</span>
                </div>
              </div>

              <div className="rzp-bank-page-body">
                <div className="rzp-bank-txn-info">
                  <div className="rzp-txn-row">
                    <span>Merchant</span>
                    <strong>Quick Mart Pvt. Ltd.</strong>
                  </div>
                  <div className="rzp-txn-row">
                    <span>Amount</span>
                    <strong className="rzp-txn-amount">₹{amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="rzp-txn-row">
                    <span>Txn Ref</span>
                    <strong>QM{Date.now().toString().slice(-8)}</strong>
                  </div>
                </div>

                <form className="rzp-bank-form" onSubmit={handleBankLogin}>
                  <div className="rzp-bank-field">
                    <label>Customer ID / Username</label>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Enter Customer ID"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="rzp-bank-field">
                    <label>Password / IPIN</label>
                    <div className="rzp-pass-wrap">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Enter Password"
                        required
                      />
                      <button type="button" className="rzp-pass-toggle" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="rzp-bank-secure">
                    <Lock size={14} />
                    <span>This page is 256-bit SSL encrypted and secure</span>
                  </div>
                  <button type="submit" className="rzp-bank-login-btn" style={{ background: selectedBank.color }}>
                    Login & Proceed
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PHASE: OTP Verification */}
          {phase === 'otp' && selectedBank && (
            <div className="rzp-bank-page">
              <div className="rzp-bank-page-header" style={{ background: selectedBank.color }}>
                <button className="rzp-bank-back" onClick={() => setPhase('bankLogin')}>
                  <ArrowLeft size={18} color="white" />
                </button>
                <div className="rzp-bank-logo-big" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {selectedBank.short.charAt(0)}
                </div>
                <div className="rzp-bank-header-info">
                  <h3>{selectedBank.name}</h3>
                  <span>Transaction Authorization</span>
                </div>
              </div>

              <div className="rzp-bank-page-body rzp-otp-body">
                <div className="rzp-otp-message">
                  <ShieldCheck size={24} className="rzp-otp-shield" />
                  <div>
                    <h4>OTP Verification Required</h4>
                    <p>A 6-digit OTP has been sent to your registered mobile number ******{customerPhone ? customerPhone.slice(-4) : '3210'}</p>
                  </div>
                </div>

                <div className="rzp-otp-amount-confirm">
                  <span>Confirm payment of</span>
                  <strong>₹{amount.toLocaleString('en-IN')}</strong>
                  <span>to Quick Mart Pvt. Ltd.</span>
                </div>

                <form className="rzp-otp-form" onSubmit={handleOtpSubmit}>
                  <label className="rzp-otp-label">Enter OTP</label>
                  <div className="rzp-otp-boxes">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpRefs.current[idx] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="rzp-otp-box"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                  <div className="rzp-otp-timer">
                    {otpTimer > 0 ? (
                      <span>OTP valid for <strong>{formatTime(otpTimer)}</strong></span>
                    ) : (
                      <button type="button" className="rzp-resend-btn" onClick={() => setOtpTimer(120)}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="rzp-bank-login-btn"
                    style={{ background: selectedBank.color }}
                    disabled={otp.join('').length < 6}
                  >
                    Verify & Authorize Payment
                  </button>
                </form>

                <div className="rzp-otp-warning">
                  <Lock size={12} />
                  <span>Never share your OTP with anyone. Bank officials will never ask for your OTP.</span>
                </div>
              </div>
            </div>
          )}

          {/* PHASE: Processing */}
          {phase === 'processing' && (
            <div className="rzp-processing">
              <div className="rzp-processing-spinner">
                <Loader2 size={48} className="rzp-spinner-icon" />
              </div>
              <h3>Processing Payment</h3>
              <p className="rzp-processing-text">{processingText}</p>
              <div className="rzp-processing-bar">
                <div className="rzp-processing-fill"></div>
              </div>
              <p className="rzp-processing-warn">
                <Lock size={14} />
                Do not press back or close this window
              </p>
            </div>
          )}

          {/* PHASE: Result */}
          {phase === 'result' && (
            <div className="rzp-result">
              {result === 'success' ? (
                <>
                  <div className="rzp-result-icon rzp-result-success">
                    <CheckCircle size={64} />
                  </div>
                  <h3 className="rzp-result-title rzp-success-color">Payment Successful!</h3>
                  <p className="rzp-result-amount">₹{amount.toLocaleString('en-IN')}</p>
                  <div className="rzp-result-details">
                    <div className="rzp-result-row">
                      <span>Bank</span>
                      <strong>{selectedBank?.name}</strong>
                    </div>
                    <div className="rzp-result-row">
                      <span>Transaction ID</span>
                      <strong>TXN{Date.now().toString().slice(-10)}</strong>
                    </div>
                    <div className="rzp-result-row">
                      <span>Status</span>
                      <strong className="rzp-success-color">Authorized</strong>
                    </div>
                  </div>
                  <button className="rzp-result-btn rzp-result-btn-success" onClick={handleResultAction}>
                    <CheckCircle size={18} />
                    Continue to Order Confirmation
                  </button>
                </>
              ) : (
                <>
                  <div className="rzp-result-icon rzp-result-failure">
                    <XCircle size={64} />
                  </div>
                  <h3 className="rzp-result-title rzp-failure-color">Payment Failed</h3>
                  <p className="rzp-result-sub">Your transaction could not be completed. No amount has been debited.</p>
                  <div className="rzp-result-details">
                    <div className="rzp-result-row">
                      <span>Reason</span>
                      <strong>Transaction declined by bank</strong>
                    </div>
                    <div className="rzp-result-row">
                      <span>Error Code</span>
                      <strong>BAD_REQUEST_ERROR</strong>
                    </div>
                  </div>
                  <div className="rzp-result-actions">
                    <button className="rzp-result-btn rzp-result-btn-retry" onClick={handleRetry}>
                      Try Again
                    </button>
                    <button className="rzp-result-btn rzp-result-btn-close" onClick={() => { onFailure(); onClose(); }}>
                      Cancel Payment
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="rzp-footer">
          <Lock size={12} />
          <span>Secured by</span>
          <strong>Razorpay</strong>
          <span className="rzp-footer-sep">|</span>
          <span>PCI DSS Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
