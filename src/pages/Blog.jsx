import React from 'react';
import LandingNav from '../components/LandingNav';
import { Newspaper, ArrowUpRight, Calendar } from 'lucide-react';
import './Home.css'; // Reuse landing styles

const Blog = () => {
  const posts = [
    {
      title: "How to Build a $100k Portfolio in 2026",
      desc: "An in-depth guide to modern asset allocation and risk management strategies.",
      date: "May 12, 2026",
      category: "Investing"
    },
    {
      title: "The Rise of AI in Personal Finance",
      desc: "How machine learning is changing the way we track and grow our wealth.",
      date: "May 10, 2026",
      category: "Technology"
    },
    {
      title: "5 Habits of Highly Successful Savers",
      desc: "Simple daily routines that can lead to massive long-term financial freedom.",
      date: "May 05, 2026",
      category: "Savings"
    }
  ];

  return (
    <div className="landing-wrapper">
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>
      <LandingNav />
      
      <main className="hero-landing fade-in" style={{ gridTemplateColumns: '1fr', paddingTop: '8rem', minHeight: 'auto' }}>
        <div className="hero-content" style={{ maxWidth: '900px' }}>
          <h1>The FinVista <span className="gradient-text">Journal</span></h1>
          <p className="hero-subtitle">Insights, strategies, and stories from the frontier of wealth intelligence.</p>
        </div>
      </main>

      <section className="features-landing" style={{ paddingTop: 0 }}>
        <div className="features-grid-landing">
          {posts.map((post, i) => (
            <div key={i} className="landing-feature-card glass-panel hover-lift">
              <div className="icon-box-premium"><Newspaper size={32} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{post.category}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.desc}</p>
              <div className="card-link">Read Full Post <ArrowUpRight size={16} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
