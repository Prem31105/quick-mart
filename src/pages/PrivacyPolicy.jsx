import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronRight, FileText, Lock, Truck, RotateCcw, CreditCard, Users, Eye, Scale, AlertTriangle, BookOpen } from 'lucide-react';
import './DemoPages.css';
import './PrivacyPolicy.css';

const policies = [
  {
    id: 'privacy',
    icon: <Eye size={22} />,
    title: 'Privacy Policy',
    color: '#6366f1',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Information We Collect',
        content: 'We collect personal information you provide during registration, including your name, email address, phone number, shipping address, and payment details. We also collect browsing data, device information, cookies, and purchase history to enhance your shopping experience.'
      },
      {
        heading: '2. How We Use Your Data',
        content: 'Your data is used to process orders, personalize your shopping experience, send promotional offers (with your consent), improve our services, prevent fraud, and comply with legal obligations. We never sell your personal data to third parties.'
      },
      {
        heading: '3. Data Storage & Security',
        content: 'All personal data is encrypted using AES-256 encryption and stored on secure servers within India. We implement SSL/TLS protocols for all data transmissions. Regular security audits and penetration testing are conducted quarterly.'
      },
      {
        heading: '4. Third-Party Sharing',
        content: 'We share limited data with trusted partners only for order fulfillment (logistics providers), payment processing (payment gateways), and analytics. All partners are contractually bound to protect your data under strict confidentiality agreements.'
      },
      {
        heading: '5. Your Rights',
        content: 'You have the right to access, correct, or delete your personal data at any time. You can opt out of marketing communications, request data portability, and withdraw consent for data processing by contacting our Data Protection Officer.'
      }
    ]
  },
  {
    id: 'terms',
    icon: <Scale size={22} />,
    title: 'Terms & Conditions',
    color: '#3b82f6',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Account Registration',
        content: 'Users must provide accurate and complete information during registration. Each user is responsible for maintaining the confidentiality of their account credentials. Quick Mart reserves the right to suspend or terminate accounts that violate our terms.'
      },
      {
        heading: '2. Product Listings & Pricing',
        content: 'All product descriptions and images are as accurate as possible. Prices are listed in INR and include applicable taxes unless stated otherwise. Quick Mart reserves the right to modify prices without prior notice. Typographical errors in pricing will be corrected and customers notified.'
      },
      {
        heading: '3. Order Acceptance',
        content: 'Placing an order constitutes an offer to purchase. Quick Mart reserves the right to accept or decline orders based on product availability, pricing accuracy, and suspected fraudulent activity. Order confirmation email serves as acceptance.'
      },
      {
        heading: '4. Intellectual Property',
        content: 'All content on Quick Mart, including logos, product images, text, graphics, and software, is the intellectual property of Quick Mart or its licensors. Unauthorized reproduction, distribution, or modification is strictly prohibited.'
      },
      {
        heading: '5. Limitation of Liability',
        content: 'Quick Mart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability for any claim shall not exceed the amount paid by the customer for the specific product or service in question.'
      }
    ]
  },
  {
    id: 'return',
    icon: <RotateCcw size={22} />,
    title: 'Return & Refund Policy',
    color: '#10b981',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Return Window',
        content: 'Products can be returned within 7 days of delivery for electronics, and 15 days for fashion & lifestyle items. The product must be unused, in its original packaging, with all tags and accessories intact.'
      },
      {
        heading: '2. Non-Returnable Items',
        content: 'Certain products including undergarments, customized items, digital downloads, perishable goods, and items marked as "non-returnable" on the product page cannot be returned or exchanged.'
      },
      {
        heading: '3. Refund Process',
        content: 'Refunds are processed within 5-7 business days after the returned product is inspected and approved. Refunds are credited to the original payment method. Cash-on-delivery refunds are processed via bank transfer or Quick Mart wallet credit.'
      },
      {
        heading: '4. Exchange Policy',
        content: 'Product exchanges are subject to availability. If the requested exchange item is unavailable, a full refund will be initiated. Exchange requests must be raised within the return window period.'
      },
      {
        heading: '5. Damaged or Defective Products',
        content: 'If you receive a damaged or defective product, please report it within 48 hours of delivery with supporting photos. We will arrange a free pickup and provide a replacement or full refund at your preference.'
      }
    ]
  },
  {
    id: 'shipping',
    icon: <Truck size={22} />,
    title: 'Shipping Policy',
    color: '#f59e0b',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Delivery Timeframes',
        content: 'Standard delivery takes 5-7 business days. Express delivery is available for select pin codes within 2-3 business days. Same-day delivery is available in select metro cities for orders placed before 12 PM.'
      },
      {
        heading: '2. Shipping Charges',
        content: 'Free shipping on orders above ₹5,000. Standard shipping fee of ₹49 applies for orders below ₹5,000. Express delivery incurs an additional charge of ₹99. Same-day delivery is charged at ₹199.'
      },
      {
        heading: '3. Tracking & Notifications',
        content: 'Order tracking is available via SMS, email, and the Quick Mart app. Real-time tracking updates are sent at each stage: order confirmed, dispatched, in transit, out for delivery, and delivered.'
      },
      {
        heading: '4. Undeliverable Orders',
        content: 'If delivery fails after 3 attempts, the order will be returned to our warehouse. A full refund will be initiated within 5 business days. Customers can also request redelivery to an alternate address.'
      },
      {
        heading: '5. International Shipping',
        content: 'Currently, Quick Mart ships only within India. International shipping is planned for future expansion. Customers in border areas may experience extended delivery times due to security checks.'
      }
    ]
  },
  {
    id: 'payment',
    icon: <CreditCard size={22} />,
    title: 'Payment Policy',
    color: '#ec4899',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Accepted Payment Methods',
        content: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, EMI options, Quick Mart wallet, and Cash on Delivery (COD) for eligible orders up to ₹50,000.'
      },
      {
        heading: '2. Payment Security',
        content: 'All transactions are processed through PCI-DSS compliant payment gateways. We use 3D Secure authentication for card payments. Your card details are never stored on our servers.'
      },
      {
        heading: '3. EMI Options',
        content: 'No-cost EMI is available on select products for tenures of 3, 6, 9, and 12 months through partnered banks. Standard EMI with applicable interest rates is available on all products above ₹3,000.'
      },
      {
        heading: '4. Failed Transactions',
        content: 'If a payment is deducted but the order is not confirmed, the amount will be auto-refunded within 5-7 business days. For persistent issues, please contact our payment support with transaction reference number.'
      },
      {
        heading: '5. Promotional Offers & Discounts',
        content: 'Promotional discounts cannot be combined with other offers unless explicitly stated. Coupon codes are single-use and have an expiry date. Quick Mart reserves the right to modify or withdraw offers at any time.'
      }
    ]
  },
  {
    id: 'user-conduct',
    icon: <Users size={22} />,
    title: 'User Conduct Policy',
    color: '#8b5cf6',
    lastUpdated: 'April 2026',
    rules: [
      {
        heading: '1. Prohibited Activities',
        content: 'Users must not engage in fraudulent activities, create fake accounts, post misleading reviews, attempt to hack or disrupt services, or use automated bots to scrape data or place orders.'
      },
      {
        heading: '2. Review Guidelines',
        content: 'Product reviews must be honest, relevant, and based on genuine purchase experience. Reviews containing offensive language, personal attacks, spam, or promotional content will be removed. Users found posting fake reviews will face account suspension.'
      },
      {
        heading: '3. Account Suspension',
        content: 'Quick Mart may suspend or permanently ban accounts involved in repeated return abuse, payment fraud, harassment of delivery personnel, or violation of any terms. Suspended users will be notified via email with reasons for suspension.'
      },
      {
        heading: '4. Communication Standards',
        content: 'All communications with Quick Mart support team and delivery partners should be respectful and professional. Abusive or threatening behavior towards our staff will result in immediate account termination and may be reported to authorities.'
      },
      {
        heading: '5. Fair Usage',
        content: 'Promotional offers, discounts, and cashback are intended for genuine personal purchases. Bulk ordering for resale purposes using promotional prices is prohibited. Quick Mart reserves the right to cancel such orders.'
      }
    ]
  }
];

const PrivacyPolicy = () => {
  const [expandedPolicy, setExpandedPolicy] = useState('privacy');
  const [expandedRules, setExpandedRules] = useState({});

  const togglePolicy = (id) => {
    setExpandedPolicy(expandedPolicy === id ? null : id);
    setExpandedRules({});
  };

  const toggleRule = (policyId, ruleIndex) => {
    const key = `${policyId}-${ruleIndex}`;
    setExpandedRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">
            Privacy & <span className="text-gradient">Policy</span>
          </h1>
          <p className="page-subtitle">
            Comprehensive rules, guidelines, and policies that govern the Quick Mart platform — ensuring transparency, trust, and a safe shopping experience for all users.
          </p>
        </header>

        {/* Policy Summary Cards */}
        <div className="policy-summary-strip animate-fade-in delay-100">
          {policies.map((policy) => (
            <button
              key={policy.id}
              className={`policy-chip ${expandedPolicy === policy.id ? 'active' : ''}`}
              style={{ '--chip-color': policy.color }}
              onClick={() => togglePolicy(policy.id)}
            >
              <span className="chip-icon">{policy.icon}</span>
              <span className="chip-label">{policy.title}</span>
            </button>
          ))}
        </div>

        {/* Policy Content Sections */}
        <div className="policy-content-area animate-fade-in delay-200">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={`policy-section ${expandedPolicy === policy.id ? 'expanded' : ''}`}
            >
              <button
                className="policy-section-header"
                onClick={() => togglePolicy(policy.id)}
                style={{ '--section-accent': policy.color }}
              >
                <div className="section-header-left">
                  <div className="section-icon-badge" style={{ background: `${policy.color}15`, color: policy.color, border: `1px solid ${policy.color}30` }}>
                    {policy.icon}
                  </div>
                  <div>
                    <h2 className="section-heading">{policy.title}</h2>
                    <span className="section-meta">Last updated: {policy.lastUpdated} • {policy.rules.length} clauses</span>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`section-chevron ${expandedPolicy === policy.id ? 'rotated' : ''}`}
                />
              </button>

              {expandedPolicy === policy.id && (
                <div className="policy-rules-container">
                  {policy.rules.map((rule, index) => {
                    const ruleKey = `${policy.id}-${index}`;
                    const isExpanded = expandedRules[ruleKey];
                    return (
                      <div key={index} className={`policy-rule ${isExpanded ? 'rule-expanded' : ''}`}>
                        <button
                          className="rule-header"
                          onClick={() => toggleRule(policy.id, index)}
                        >
                          <div className="rule-number" style={{ background: `${policy.color}15`, color: policy.color }}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <h3 className="rule-title">{rule.heading}</h3>
                          <ChevronRight
                            size={16}
                            className={`rule-chevron ${isExpanded ? 'rotated' : ''}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="rule-content animate-slide-down">
                            <p>{rule.content}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="policy-footer animate-fade-in delay-300">
          <div className="policy-footer-card glass-card">
            <div className="footer-icon-wrapper">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3>Important Notice</h3>
              <p>
                Quick Mart reserves the right to update these policies at any time. Users will be notified of significant changes via email and in-app notifications. Continued use of the platform after policy updates constitutes acceptance of the revised terms. For any queries, contact our Compliance Team at <strong>compliance@quickmart.in</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
