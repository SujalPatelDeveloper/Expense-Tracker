import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Savings from './pages/Savings';
import Investments from './pages/Investments';
import Subscriptions from './pages/Subscriptions';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import ProtectedRoute from './components/ProtectedRoute';
import FinanceAlerter from './components/FinanceAlerter';
import { TransactionProvider } from './context/TransactionContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';
import './App.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/about', '/blog', '/careers'].includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className={`app-container ${isAuthPage ? 'landing-mode' : ''}`}>
      {!isAuthPage && (
        <>
          <FinanceAlerter />
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar} />
          
          <div className={`sidebar-wrapper ${isSidebarOpen ? 'mobile-open' : ''}`}>
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
      
      <main className={`main-content ${isAuthPage ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <TransactionProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      </TransactionProvider>
    </ToastProvider>
  );
}

export default App;
