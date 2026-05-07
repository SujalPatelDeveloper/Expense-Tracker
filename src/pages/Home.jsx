import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  PieChart,
  Layers,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import CountUp from '../components/CountUp';
import LegalModal from '../components/LegalModal';
import LandingNav from '../components/LandingNav';
import './Home.css';

const Landing = () => {
  const { isDark, toggleTheme } = useTransactions();
  const [legalModal, setLegalModal] = React.useState({ isOpen: false, type: 'privacy' });

  const openLegal = (type) => setLegalModal({ isOpen: true, type });
  const closeLegal = () => setLegalModal({ ...legalModal, isOpen: false });

  return (
    <div className="landing-wrapper">
      {/* Decorative Background Elements */}
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>

      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <section className="hero-landing fade-in">
        <div className="hero-content">
          <div className="hero-announcement glass-panel">
            <span className="badge">Pro</span>
            <span>New: Advanced Portfolio Analytics is Live</span>
            <ChevronRight size={16} />
          </div>
          <h1>Master Your Wealth with <br /><span className="gradient-text">Precision Intelligence</span></h1>
          <p className="hero-subtitle">
            Experience the next generation of financial management. FinVista combines 
            glassmorphic design with AI-driven insights to transform your data into growth.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="primary-btn">
              Get Started for Free <ArrowRight size={20} />
            </Link>
            <div className="user-stats">
              <div className="stat-avatars">
                <div className="avatar v1">JD</div>
                <div className="avatar v2">AK</div>
                <div className="avatar v3">SP</div>
                <div className="avatar plus-avatar">+5k</div>
              </div>
              <span>Joined by 50,000+ smart investors</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-dashboard-preview-new glass-panel fade-in-up">
            <img src="/src/assets/FinVista_Dashboard_Dark.png" alt="FinVista Dashboard Dark" className="mockup-img dark-preview" />
            <img src="/src/assets/FinVista_Dashboard_Light.png" alt="FinVista Dashboard Light" className="mockup-img light-preview" />
            
            {/* Floating Elements */}
            <div className="floating-card c1 glass-panel">
              <div className="f-icon"><TrendingUp size={20} /></div>
              <div className="f-info">
                <span>Net Worth</span>
                <strong>$124,500.00</strong>
              </div>
            </div>
            <div className="floating-card c2 glass-panel">
              <div className="f-icon"><PieChart size={20} /></div>
              <div className="f-info">
                <span>Investments</span>
                <strong>+12.4%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats glass-panel">
        <div className="stat-item">
          <h3><CountUp end={98} suffix="%" /></h3>
          <p>Customer Satisfaction</p>
        </div>
        <div className="stat-item">
          <h3><CountUp end={2.4} suffix="M" decimals={1} /></h3>
          <p>Transactions Tracked</p>
        </div>
        <div className="stat-item">
          <h3><CountUp end={150} suffix="K+" /></h3>
          <p>Active Portfolios</p>
        </div>
        <div className="stat-item">
          <h3><CountUp end={0} suffix="$" /></h3>
          <p>Hidden Fees</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-landing">
        <div className="landing-section-header">
          <span className="section-badge">Core Capabilities</span>
          <h2>Intelligent tools for <br />the modern investor</h2>
        </div>
        
        <div className="features-grid-landing">
          <div className="landing-feature-card glass-panel hover-lift">
            <div className="icon-box-premium"><BarChart3 size={32} /></div>
            <h3>Deep Analytics</h3>
            <p>Go beyond simple tracking with predictive modeling and trend analysis.</p>
            <div className="card-link">Explore Analytics <ArrowUpRight size={16} /></div>
          </div>
          <div className="landing-feature-card glass-panel hover-lift">
            <div className="icon-box-premium"><Sparkles size={32} /></div>
            <h3>AI Insights</h3>
            <p>Personalized wealth recommendations powered by our proprietary algorithms.</p>
            <div className="card-link">See AI in Action <ArrowUpRight size={16} /></div>
          </div>
          <div className="landing-feature-card glass-panel hover-lift">
            <div className="icon-box-premium"><Layers size={32} /></div>
            <h3>Unified Portfolio</h3>
            <p>Crypto, Stocks, ETFs, and Cash. Everything managed in one stunning view.</p>
            <div className="card-link">Manage Assets <ArrowUpRight size={16} /></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-box glass-panel">
        <div className="cta-content">
          <h2>Ready to revolutionize your <br />financial life?</h2>
          <p>Join the future of wealth intelligence today. No credit card required.</p>
          <div className="cta-btns">
            <Link to="/login" className="primary-btn large">Start Free Trial</Link>
            <Link to="/about" className="secondary-btn large">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-info">
            <div className="nav-logo">
              <TrendingUp color="var(--accent-primary)" size={28} />
              <span>FinVista</span>
            </div>
            <p>The world's most beautiful financial intelligence platform.</p>
          </div>
          <div className="footer-links-grid">
            <div className="f-col">
              <h4>Product</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/investments">Investments</Link>
            </div>
            <div className="f-col">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div className="f-col">
              <h4>Legal</h4>
              <button onClick={() => openLegal('privacy')} className="footer-link-btn">Privacy</button>
              <button onClick={() => openLegal('terms')} className="footer-link-btn">Terms</button>
              <button onClick={() => openLegal('security')} className="footer-link-btn">Security</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FinVista Intelligence. Designed with precision.</p>
        </div>
      </footer>
      <LegalModal 
        isOpen={legalModal.isOpen} 
        onClose={closeLegal} 
        type={legalModal.type} 
      />
    </div>
  );
};

export default Landing;
