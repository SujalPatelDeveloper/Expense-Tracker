import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Sparkles,
  MoreVertical,
  Sun,
  Moon
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';
import './Dashboard.css';

const currencies = [
  { code: 'USD', name: 'US Dollar', balance: '0.00', status: 'Active', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', balance: '0.00', status: 'Active', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', balance: '0.00', status: 'Inactive', flag: '🇬🇧' },
];

const Dashboard = () => {
  const { transactions, totals, goals } = useTransactions();
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const categoryData = React.useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    });
    
    const colors = {
      'Housing': '#f59e0b',
      'Investments': '#10b981',
      'Lifestyle': '#6366f1',
      'Food': '#ec4899',
      'Transport': '#8b5cf6',
      'Tech': '#06b6d4'
    };

    return Object.keys(categories).map(name => ({
      name,
      value: categories[name],
      color: colors[name] || '#94a3b8'
    }));
  }, [transactions]);

  const cashFlowData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(name => ({ name, income: 0, expense: 0 }));
    
    transactions.forEach(t => {
      const dayName = days[new Date(t.date).getDay()];
      const dayObj = data.find(d => d.name === dayName);
      if (t.type === 'income') dayObj.income += t.amount;
      else dayObj.expense += Math.abs(t.amount);
    });
    return data;
  }, [transactions]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="fade-in">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search analytics, transactions..." />
          </div>
          
          <div className="header-right">
            <div className="icon-group">
              <button className="header-icon-btn" onClick={toggleTheme}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="header-icon-btn">
                <MessageSquare size={20} />
              </button>
              <button className="header-icon-btn">
                <Bell size={20} />
                <span className="badge-dot"></span>
              </button>
            </div>
            
            <div className="header-divider"></div>
            
            <div className="time-filter">
              <span>This Month</span>
              <ChevronDown size={16} />
            </div>
            
            <div className="user-profile-header">
              <div className="header-avatar">U</div>
              <div className="header-user-info">
                <span className="name">User</span>
                <span className="role">Wealth Master</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="greeting-box">
            <h1>Welcome back! 👋</h1>
            <p>
              {transactions.length > 0 
                ? "Here is your financial overview for this period." 
                : "Add your first transaction to start tracking your wealth."}
            </p>
          </div>
          
          <div className="ai-insight-card glass-panel">
            <div className="insight-icon">
              <Sparkles size={20} />
            </div>
            <div className="insight-content">
              <h4>Wealth Intelligence</h4>
              <p>
                {transactions.length > 0 
                  ? "Based on your spending, we've identified ways to optimize your wealth." 
                  : "Add transactions to unlock personalized AI wealth recommendations."}
              </p>
            </div>
            <button className="insight-action">
              {transactions.length > 0 ? "View Details" : "Learn More"}
            </button>
          </div>
        </section>

        {/* Metrics Row */}
        <section className="metrics-grid">
          <div className="metric-card glass-panel">
            <div className="metric-header">
              <span className="metric-title">Total Balance</span>
              <div className="metric-trend up">
                <TrendingUp size={14} />
                <span>+2.4%</span>
              </div>
            </div>
            <div className="metric-value">${totals.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="sparkline-placeholder"></div>
            <p className="metric-subtext">Current Wallet Balance</p>
          </div>

          <div className="metric-card glass-panel">
            <div className="metric-header">
              <span className="metric-title">Monthly Income</span>
              <div className="metric-trend up">
                <TrendingUp size={14} />
                <span>+8.1%</span>
              </div>
            </div>
            <div className="metric-value">${totals.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="sparkline-placeholder"></div>
            <p className="metric-subtext">Total deposits this month</p>
          </div>

          <div className="metric-card glass-panel">
            <div className="metric-header">
              <span className="metric-title">Total Expenses</span>
              <div className="metric-trend down">
                <TrendingDown size={14} />
                <span>-0.5%</span>
              </div>
            </div>
            <div className="metric-value">${totals.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="sparkline-placeholder"></div>
            <p className="metric-subtext">Total spending this month</p>
          </div>
        </section>

        {/* Main Grid Content */}
        <div className="main-dashboard-grid">
          <div className="grid-left">
            {/* Cash Flow Chart */}
            <div className="section-card glass-panel">
              <div className="section-header">
                <h3>Cash Flow Analysis</h3>
                <div className="chart-tabs">
                  <button className="tab active">Weekly</button>
                  <button className="tab">Monthly</button>
                </div>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#f59e0b" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="section-card glass-panel">
              <div className="section-header">
                <h3>Quick Actions</h3>
                <button className="add-btn-small" onClick={() => setModalOpen(true)}>
                  <Plus size={14} /> Add Transaction
                </button>
              </div>
              <div className="currency-list">
                {currencies.map((curr) => (
                  <div key={curr.code} className="currency-card">
                    <div className="curr-info">
                      <span className="curr-flag">{curr.flag}</span>
                      <div>
                        <span className="curr-code">{curr.code}</span>
                        <span className="curr-name">{curr.name}</span>
                      </div>
                    </div>
                    <div className="curr-balance">
                      <span className="balance-val">${curr.balance}</span>
                      <span className={`status ${curr.status.toLowerCase()}`}>{curr.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-right">
            {/* Expense Breakdown */}
            <div className="section-card glass-panel">
              <div className="section-header">
                <h3>Expense Breakdown</h3>
                <MoreVertical size={18} color="var(--text-muted)" />
              </div>
              <div className="radial-chart-box">
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="radial-center-text">
                  <span className="label">Total Spent</span>
                  <span className="value">${totals.expense.toFixed(0)}</span>
                </div>
              </div>
              <div className="category-legend">
                {categoryData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <div className="dot" style={{ backgroundColor: item.color }}></div>
                    <span className="cat-name">{item.name}</span>
                    <span className="cat-percent">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Goals */}
            <div className="section-card glass-panel">
              <div className="section-header">
                <h3>Savings Goals</h3>
                <Target size={18} color="var(--accent-primary)" />
              </div>
              <div className="goals-list">
                {goals.map((goal) => {
                  const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                  return (
                    <div key={goal.id} className="goal-item">
                      <div className="goal-info">
                        <span>{goal.name}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${percent}%`, backgroundColor: goal.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {goals.length === 0 && (
                  <p className="empty-text">No active goals. Set one in Savings Plans!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Compact Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 FinVista Intelligence. Built for Wealth.</p>
          <div className="footer-links-compact">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </footer>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
