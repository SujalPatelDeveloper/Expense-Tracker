import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home as HomeIcon,
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp,
  Wallet,
  Calendar,
  Settings,
  LineChart,
  Target,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './Sidebar.css';

const Sidebar = ({ closeSidebar }) => {
  const { user } = useTransactions();
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const menuItems = [
    { icon: <HomeIcon size={20} />, label: 'Home', path: '/' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <LineChart size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <ArrowLeftRight size={20} />, label: 'Transactions', path: '/transactions' },
    { icon: <Wallet size={20} />, label: 'Investments', path: '/investments' },
    { icon: <Target size={20} />, label: 'Savings Plans', path: '/savings' },
    { icon: <Calendar size={20} />, label: 'Subscriptions', path: '/subscriptions' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <TrendingUp color="var(--accent-primary)" size={24} />
        </div>
        <span className="logo-text">FinVista</span>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <X size={20} />
        </button>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
            onClick={closeSidebar}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
        <div className="user-profile">
          <div className="avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="sidebar-avatar-img" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-plan">{user.plan}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
