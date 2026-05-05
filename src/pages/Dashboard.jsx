import React from 'react';
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
import './Dashboard.css';

const cashFlowData = [
  { name: 'Mon', income: 4000, expense: 2400 },
  { name: 'Tue', income: 3000, expense: 1398 },
  { name: 'Wed', income: 2000, expense: 9800 },
  { name: 'Thu', income: 2780, expense: 3908 },
  { name: 'Fri', income: 1890, expense: 4800 },
  { name: 'Sat', income: 2390, expense: 3800 },
  { name: 'Sun', income: 3490, expense: 4300 },
];

const categoryData = [
  { name: 'Housing', value: 45, color: '#f59e0b' },
  { name: 'Investments', value: 25, color: '#10b981' },
  { name: 'Lifestyle', value: 20, color: '#6366f1' },
  { name: 'Others', value: 10, color: '#94a3b8' },
];

const currencies = [
  { code: 'USD', name: 'US Dollar', balance: '12,450.00', status: 'Active', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', balance: '3,200.00', status: 'Active', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', balance: '850.00', status: 'Inactive', flag: '🇬🇧' },
];

const Dashboard = () => {
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="dashboard-wrapper fade-in">
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
            <div className="header-avatar">AD</div>
            <div className="header-user-info">
              <span className="name">Alex Dawson</span>
              <span className="role">Pro Member</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="greeting-box">
          <h1>Welcome back, Alex! 👋</h1>
          <p>Your wealth has grown by <strong>12.5%</strong> this month. Keep it up!</p>
        </div>
        
        <div className="ai-insight-card glass-panel">
          <div className="insight-icon">
            <Sparkles size={20} />
          </div>
          <div className="insight-content">
            <h4>Wealth Intelligence</h4>
            <p>Based on your spending, you can save an extra $450 by optimizing subscriptions.</p>
          </div>
          <button className="insight-action">View Plan</button>
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
          <div className="metric-value">$84,250.00</div>
          <div className="sparkline-placeholder"></div>
          <p className="metric-subtext">Across 4 connected accounts</p>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Monthly Savings</span>
            <div className="metric-trend up">
              <TrendingUp size={14} />
              <span>+8.1%</span>
            </div>
          </div>
          <div className="metric-value">$12,840.00</div>
          <div className="sparkline-placeholder"></div>
          <p className="metric-subtext">Target: $15,000.00</p>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Investments</span>
            <div className="metric-trend down">
              <TrendingDown size={14} />
              <span>-0.5%</span>
            </div>
          </div>
          <div className="metric-value">$54,200.00</div>
          <div className="sparkline-placeholder"></div>
          <p className="metric-subtext">Market value as of today</p>
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
              <h3>Recent Wallets</h3>
              <button className="add-btn-small"><Plus size={14} /> Add Wallet</button>
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
                <span className="value">$4,250</span>
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
              <div className="goal-item">
                <div className="goal-info">
                  <span>New Car</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '75%', backgroundColor: '#f59e0b' }}></div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-info">
                  <span>Home Downpayment</span>
                  <span>30%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '30%', backgroundColor: '#10b981' }}></div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-info">
                  <span>Vacation Fund</span>
                  <span>90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '90%', backgroundColor: '#6366f1' }}></div>
                </div>
              </div>
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
  );
};

export default Dashboard;
