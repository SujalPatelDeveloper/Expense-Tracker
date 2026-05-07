import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TrendingUp, Sun, Moon } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

const LandingNav = () => {
  const { isDark, toggleTheme } = useTransactions();

  return (
    <nav className="landing-nav glass-panel fade-in">
      <div className="nav-logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <TrendingUp color="var(--accent-primary)" size={28} />
          <span>FinVista</span>
        </Link>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'landing-link active' : 'landing-link'}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'landing-link active' : 'landing-link'}>Features</NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'landing-link active' : 'landing-link'}>Blog</NavLink>
        <NavLink to="/careers" className={({ isActive }) => isActive ? 'landing-link active' : 'landing-link'}>Careers</NavLink>
        <button className="theme-toggle-landing" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link to="/login" className="nav-cta">Sign In</Link>
      </div>
    </nav>
  );
};

export default LandingNav;
