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
  Globe,
  Mail,
  Link as LinkIcon,
  TrendingUp
} from 'lucide-react';
import './Home.css';

const Landing = () => {
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-landing fade-in">
        <div className="hero-content">
          <div className="hero-announcement">
            <span className="badge">New</span>
            <span>AI Wealth Intelligence is here</span>
            <ChevronRight size={16} />
          </div>
          <h1>Take Control of Your <br /><span className="gradient-text">Financial Future</span></h1>
          <p className="hero-subtitle">
            FinVista combines advanced analytics with intuitive design to help you track, 
            save, and grow your wealth effortlessly.
          </p>
          <div className="hero-cta">
            <Link to="/dashboard" className="primary-btn">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="secondary-btn">How it Works</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-mockup">
            <div className="mockup-chart">
              {/* Simple mock bars for visual effect */}
              <div className="mockup-bar" style={{ height: '60%', left: '10%' }}></div>
              <div className="mockup-bar" style={{ height: '80%', left: '30%', backgroundColor: '#10b981' }}></div>
              <div className="mockup-bar" style={{ height: '40%', left: '50%' }}></div>
              <div className="mockup-bar" style={{ height: '90%', left: '70%', backgroundColor: '#f59e0b' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-landing">
        <div className="section-header">
          <h2>Everything you need to <br />master your money</h2>
          <p>Ditch the spreadsheets. FinVista automates your financial tracking so you can focus on what matters.</p>
        </div>
        
        <div className="features-grid-landing">
          <div className="landing-feature-card glass-panel">
            <div className="icon-box"><BarChart3 size={28} /></div>
            <h3>Smart Analytics</h3>
            <p>Visualise your cash flow, expenses, and net worth trends with beautiful, interactive charts.</p>
          </div>
          <div className="landing-feature-card glass-panel">
            <div className="icon-box"><ShieldCheck size={28} /></div>
            <h3>Secure by Design</h3>
            <p>Your data is encrypted and protected with bank-grade security protocols at every step.</p>
          </div>
          <div className="landing-feature-card glass-panel">
            <div className="icon-box"><Zap size={28} /></div>
            <h3>AI Wealth Insights</h3>
            <p>Get personalized recommendations to optimize your spending and reach your goals faster.</p>
          </div>
          <div className="landing-feature-card glass-panel">
            <div className="icon-box"><Smartphone size={28} /></div>
            <h3>Always with You</h3>
            <p>Access your dashboard from any device, anywhere. Stay on top of your finances on the go.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section glass-panel">
        <div className="trust-content">
          <h2>Ready to transform your finances?</h2>
          <p>Join over 50,000+ users who are already using FinTrace to manage their wealth.</p>
          <div className="trust-list">
            <div className="trust-item"><CheckCircle2 size={20} color="var(--accent-secondary)" /> No credit card required</div>
            <div className="trust-item"><CheckCircle2 size={20} color="var(--accent-secondary)" /> Secure & Private</div>
            <div className="trust-item"><CheckCircle2 size={20} color="var(--accent-secondary)" /> Free for individuals</div>
          </div>
          <Link to="/dashboard" className="primary-btn large">Start Tracking Now</Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="main-footer glass-panel">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-container-footer">
              <TrendingUp color="var(--accent-primary)" size={24} />
              <span className="logo-text">FinVista</span>
            </div>
            <p className="footer-tagline">
              Mastering wealth intelligence through AI and intuitive design.
            </p>
            <div className="social-links">
              <div className="social-icon"><Globe size={18} /></div>
              <div className="social-icon"><Mail size={18} /></div>
              <div className="social-icon"><LinkIcon size={18} /></div>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/investments">Portfolio</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <Link to="/docs">Documentation</Link>
              <Link to="/support">Support</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FinVista Intelligence. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
