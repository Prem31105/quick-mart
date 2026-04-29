import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  Truck, 
  BarChart, 
  Globe, 
  Smartphone,
  Star,
  Award
} from 'lucide-react';
import './DemoPages.css';

const Strategy = () => {
  return (
    <div className="page-wrapper">
      <div className="container">
        <header className="page-header animate-fade-in">
          <h1 className="page-title">Business <span className="text-gradient">Strategy</span></h1>
          <p className="page-subtitle">A comprehensive showcase of our Revenue, Marketing, and CRM models</p>
        </header>

        {/* --- SECTION 1: REVENUE MODEL --- */}
        <section className="strategy-section animate-fade-in delay-100">
          <div className="strategy-card glass-card" style={{borderLeft: '6px solid #3b82f6'}}>
            <div className="strategy-header">
              <div className="strategy-icon-box blue">
                <TrendingUp size={36} />
              </div>
              <div className="strategy-title-group">
                <h2 className="strategy-h2">Revenue Infrastructure</h2>
                <p className="strategy-tagline">Diversified income streams & financial optimization</p>
              </div>
            </div>

            <div className="strategy-grid">
              <div className="strategy-item">
                <div className="item-icon blue"><Zap size={20} /></div>
                <div>
                  <h4>D2C Retail Model</h4>
                  <p>Direct-to-consumer sales eliminating middleman markups by 15-20%.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon blue"><Target size={20} /></div>
                <div>
                  <h4>Retail Media Networks</h4>
                  <p>Monetizing platform real-estate via contextual brand advertisements.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon blue"><Globe size={20} /></div>
                <div>
                  <h4>Logistics as a Service</h4>
                  <p>Future-ready infrastructure to offer fulfillment services to third-party vendors.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon blue"><BarChart size={20} /></div>
                <div>
                  <h4>Predictive Stocking</h4>
                  <p>AI-based demand forecasting to minimize inventory holding costs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: MARKETING STRATEGY --- */}
        <section className="strategy-section animate-fade-in delay-200">
          <div className="strategy-card glass-card" style={{borderLeft: '6px solid #f59e0b'}}>
            <div className="strategy-header">
              <div className="strategy-icon-box orange">
                <Smartphone size={36} />
              </div>
              <div className="strategy-title-group">
                <h2 className="strategy-h2">Marketing Ecosystem</h2>
                <p className="strategy-tagline">Data-driven acquisition & multi-channel engagement</p>
              </div>
            </div>

            <div className="strategy-grid">
              <div className="strategy-item">
                <div className="item-icon orange"><Star size={20} /></div>
                <div>
                  <h4>Tier-1 Influencer Flywheel</h4>
                  <p>High-conversion partnerships with tech-focused digital creators.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon orange"><Award size={20} /></div>
                <div>
                  <h4>Performance Branding</h4>
                  <p>Focusing on high-intent search and social signals for efficient ROAS.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon orange"><MessageCircle size={20} /></div>
                <div>
                  <h4>CRM Automation</h4>
                  <p>Personalized re-engagement loops based on user browsing behavior.</p>
                </div>
              </div>
              <div className="strategy-item">
                <div className="item-icon orange"><Target size={20} /></div>
                <div>
                  <h4>Localized Campaigns</h4>
                  <p>Geo-targeted ads synchronized with hub-specific inventory levels.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: CRM STRATEGY --- */}
        <section className="strategy-section animate-fade-in delay-300">
          <div className="strategy-card glass-card secondary-border">
            <div className="strategy-header">
              <div className="strategy-icon-box green">
                <Users size={32} />
              </div>
              <div className="strategy-title-group">
                <h2 className="strategy-h2">CRM Ecosystem</h2>
                <p className="strategy-tagline">Personalized automation & customer lifecycle loops</p>
              </div>
            </div>

            <div className="crm-visual-container">
              <div className="crm-circle-viz">
                <div className="crm-center">
                  <div className="pulse-circle"></div>
                  <span>CRM</span>
                </div>
                <div className="crm-node-orbit node-1"><span>Acquisition</span></div>
                <div className="crm-node-orbit node-2"><span>Engagement</span></div>
                <div className="crm-node-orbit node-3"><span>Retention</span></div>
                <div className="crm-node-orbit node-4"><span>Advocacy</span></div>
              </div>
              
              <div className="crm-pillars">
                <div className="crm-pillar">
                  <div className="pillar-icon"><MessageCircle size={24} /></div>
                  <h3>Active Support</h3>
                  <p>Real-time chat integration for instant issue resolution and order tracking.</p>
                  <ul className="pillar-list">
                    <li>24/7 Ticketing System</li>
                    <li>In-app Support Chat</li>
                    <li>Image-based Verification</li>
                  </ul>
                </div>

                <div className="crm-pillar">
                  <div className="pillar-icon"><Truck size={24} /></div>
                  <h3>Experience</h3>
                  <p>Seamless post-purchase journey from packaging to door-step delivery.</p>
                  <ul className="pillar-list">
                    <li>Milestone Tracking</li>
                    <li>Estimated Delivery Accuracy</li>
                    <li>Easy Returns/Refunds</li>
                  </ul>
                </div>

                <div className="crm-pillar">
                  <div className="pillar-icon"><ShieldCheck size={24} /></div>
                  <h3>Trust & Security</h3>
                  <p>Ensuring customer data privacy and secure payment transactions.</p>
                  <ul className="pillar-list">
                    <li>Encrypted Data Flow</li>
                    <li>Secure Razorpay Gateway</li>
                    <li>Transparent Privacy Policy</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="crm-summary-box">
              <p><strong>CRM Strategy:</strong> Transform "One-Time Buyers" into "Brand Advocates" by providing a frictionless, transparent, and responsive shopping experience.</p>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .strategy-section {
          margin-bottom: 2.5rem;
        }
        .strategy-card {
          padding: 2.5rem;
          border-left: 5px solid transparent;
          transition: all 0.3s ease;
        }
        .strategy-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .strategy-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .strategy-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .strategy-icon-box.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .strategy-icon-box.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .strategy-icon-box.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .strategy-h2 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .strategy-tagline {
          color: var(--text-muted);
          font-size: 1.1rem;
          font-weight: 500;
        }
        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }
        .strategy-item {
          display: flex;
          gap: 1.25rem;
        }
        .item-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          background: var(--bg-darker);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-icon.blue { color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }
        .item-icon.orange { color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }

        .strategy-item h4 {
          margin-bottom: 0.5rem;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .strategy-item p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .crm-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        .crm-pillar {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }
        .pillar-icon {
          margin-bottom: 1.5rem;
          color: var(--secondary);
        }
        .crm-pillar h3 {
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .crm-pillar p {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .pillar-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pillar-list li {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
        }
        .pillar-list li::before {
          content: "✓";
          color: var(--secondary);
          font-weight: bold;
        }

        .crm-summary-box {
          margin-top: 3rem;
          padding: 1.5rem;
          background: var(--secondary-glow);
          border-radius: 15px;
          text-align: center;
          border: 1px dashed var(--secondary);
        }
        .crm-summary-box p {
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .secondary-border {
          border-bottom: 4px solid var(--secondary);
        }

        .crm-visual-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-top: 2rem;
        }

        .crm-circle-viz {
          width: 100%;
          height: 300px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.02);
          border-radius: 30px;
          overflow: hidden;
        }
        .crm-center {
          width: 80px;
          height: 80px;
          background: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: black;
          z-index: 10;
          box-shadow: 0 0 30px var(--secondary);
        }
        .pulse-circle {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 1px solid var(--secondary);
          border-radius: 50%;
          animation: crmPulse 3s infinite;
        }
        @keyframes crmPulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .crm-node-orbit {
          position: absolute;
          padding: 10px 18px;
          background: var(--bg-darker);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .node-1 { top: 20%; left: 30%; animation: float 4s infinite ease-in-out; }
        .node-2 { top: 20%; right: 30%; animation: float 5s infinite ease-in-out; }
        .node-3 { bottom: 20%; left: 30%; animation: float 6s infinite ease-in-out; }
        .node-4 { bottom: 20%; right: 30%; animation: float 4.5s infinite ease-in-out; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      ` }} />
    </div>
  );
};

export default Strategy;
