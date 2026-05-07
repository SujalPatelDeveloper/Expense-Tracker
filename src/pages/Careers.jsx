import React from 'react';
import LandingNav from '../components/LandingNav';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import './Home.css'; // Reuse landing styles

const Careers = () => {
  const jobs = [
    { title: "Senior Product Designer", location: "Remote / London", type: "Full-time" },
    { title: "Frontend Engineer (React)", location: "Remote / New York", type: "Full-time" },
    { title: "Financial Data Analyst", location: "Remote / Singapore", type: "Full-time" },
    { title: "DevOps Engineer", location: "Remote / Berlin", type: "Contract" }
  ];

  return (
    <div className="landing-wrapper">
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>
      <LandingNav />
      
      <main className="hero-landing fade-in" style={{ gridTemplateColumns: '1fr', paddingTop: '8rem', minHeight: 'auto' }}>
        <div className="hero-content" style={{ maxWidth: '900px' }}>
          <h1>Join the <span className="gradient-text">Future</span> of Finance</h1>
          <p className="hero-subtitle">We're building the world's most beautiful financial intelligence platform. Come help us redefine wealth management.</p>
        </div>
      </main>

      <section className="features-landing" style={{ paddingTop: 0 }}>
        <div className="landing-section-header">
          <span className="section-badge">Open Positions</span>
          <h2>Help us build the next generation</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {jobs.map((job, i) => (
            <div key={i} className="glass-panel hover-lift" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{job.title}</h3>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {job.type}</span>
                </div>
              </div>
              <div className="icon-box-small" style={{ background: 'var(--accent-primary)', color: 'white' }}>
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;
