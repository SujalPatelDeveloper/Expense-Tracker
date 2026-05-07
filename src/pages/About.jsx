import React from 'react';
import { Shield, Zap, Globe, Cpu, Heart, Code, Layers, Target } from 'lucide-react';
import LandingNav from '../components/LandingNav';
import './Home.css';
import './About.css';

const About = () => {
  const features = [
    { 
      icon: <Shield size={24} />, 
      title: "Bank-Grade Security", 
      desc: "Your financial data is encrypted and stored securely using industry-leading standards." 
    },
    { 
      icon: <Zap size={24} />, 
      title: "Real-time Tracking", 
      desc: "See your transactions updated instantly across all your connected accounts." 
    },
    { 
      icon: <Globe size={24} />, 
      title: "Multi-Currency", 
      desc: "Support for over 150+ currencies with automated exchange rate updates." 
    },
    { 
      icon: <Cpu size={24} />, 
      title: "AI Insights", 
      desc: "Smart categorization and spending predictions powered by advanced machine learning." 
    },
    { 
      icon: <Layers size={24} />, 
      title: "Unified Portfolio", 
      desc: "Manage Stocks, Crypto, ETFs, and Cash in one integrated, beautiful view." 
    },
    { 
      icon: <Target size={24} />, 
      title: "Wealth Goals", 
      desc: "Set ambitious targets and track your journey to financial freedom with milestones." 
    }
  ];

  return (
    <div className="landing-wrapper">
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>
      <LandingNav />
      <div className="about-container fade-in">
      <main className="hero-landing fade-in" style={{ gridTemplateColumns: '1fr', paddingTop: '8rem', minHeight: 'auto' }}>
        <div className="hero-content" style={{ maxWidth: '900px' }}>
          <div className="hero-announcement glass-panel" style={{ marginBottom: '1.5rem' }}>
            <span className="badge">New</span>
            <span>Version 2.0 is now live</span>
          </div>
          <h1>Intelligence for Your <span className="gradient-text">Wealth Journey</span></h1>
          <p className="hero-subtitle">
            FinVista is the ultimate wealth intelligence platform. It combines 
            advanced data analytics with personalized AI insights to help you 
            master your finances and grow your assets like a pro.
          </p>
        </div>
      </main>

      <section className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card glass-panel">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mission-section glass-panel">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We believe that financial literacy and control should be accessible to everyone. 
            Our mission is to build the most intuitive, powerful, and secure platform for 
            personal finance management, empowering users to make better financial decisions 
            every day.
          </p>
          <div className="mission-footer">
            <div className="mission-stat">
              <span className="stat-num">500K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="mission-stat">
              <span className="stat-num">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="mission-stat">
              <span className="stat-num">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="footer-item"><Code size={16} /> <span>Built with React & Vite</span></div>
        <div className="footer-item"><Heart size={16} color="#f43f5e" /> <span>Designed for Clarity</span></div>
      </footer>
    </div>
    </div>
  );
};

export default About;
