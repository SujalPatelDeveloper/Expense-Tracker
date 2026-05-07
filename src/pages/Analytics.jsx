import React, { useMemo, useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  X
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './Analytics.css';

const Analytics = () => {
  const { transactions, totals, currencySymbol, formatAmount } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return transactions.filter(t => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  // Process data for charts
  const categoryData = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name],
      color: getCategoryColor(name)
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const dailyTrendData = useMemo(() => {
    // Group transactions by date for the last 7 days
    const days = {};
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      days[date] = { date, income: 0, expense: 0 };
    });

    transactions.forEach(t => {
      if (days[t.date]) {
        if (t.type === 'income') days[t.date].income += t.amount;
        else days[t.date].expense += Math.abs(t.amount);
      }
    });

    return Object.values(days);
  }, [transactions]);

  function getCategoryColor(cat) {
    const colors = {
      'Tech': '#6366f1',
      'Food': '#f59e0b',
      'Salary': '#10b981',
      'Entertainment': '#ec4899',
      'Transport': '#8b5cf6',
      'Shopping': '#f43f5e',
      'Health': '#06b6d4',
      'Investments': '#34d399',
      'Housing': '#fbbf24',
      'Lifestyle': '#a855f7'
    };
    return colors[cat] || '#94a3b8';
  }

  return (
    <div className="analytics-container fade-in">
      <header className="page-header">
        <div>
          <h1>Financial Analytics</h1>
          <p>Visual intelligence and spending patterns</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn"><Calendar size={18} /> Last 30 Days</button>
          <button className="secondary-btn"><Download size={18} /> Export Data</button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="analytics-summary-grid">
        <div className="summary-card glass-panel income-highlight">
          <div className="card-info">
            <span className="label">Savings Rate</span>
            <span className="value">{(totals.income > 0 ? ((totals.income - totals.expense) / totals.income * 100) : 0).toFixed(1)}%</span>
          </div>
          <div className="card-icon savings"><TrendingUp size={24} /></div>
        </div>
        <div className="summary-card glass-panel expense-highlight">
          <div className="card-info">
            <span className="label">Daily Average</span>
            <span className="value">{currencySymbol}{formatAmount(totals.expense / 30)}</span>
          </div>
          <div className="card-icon expense"><TrendingDown size={24} /></div>
        </div>
        <div className="summary-card glass-panel">
          <div className="card-info">
            <span className="label">Highest Category</span>
            <span className="value">{categoryData[0]?.name || 'N/A'}</span>
          </div>
          <div className="card-icon category"><Info size={24} /></div>
        </div>
      </div>

      <div className="analytics-main-grid">
        {/* Income vs Expense Area Chart */}
        <div className="analytics-card glass-panel wide">
          <div className="card-header">
            <h3>Income vs Expenses</h3>
            <div className="chart-legend-custom">
              <span className="legend-item income">Income</span>
              <span className="legend-item expense">Expenses</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={dailyTrendData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`${currencySymbol}${formatAmount(value)}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#incomeGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#expenseGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="analytics-card glass-panel">
          <div className="card-header">
            <h3>Category Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    onClick={(data) => setSelectedCategory(data.name === selectedCategory ? null : data.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={selectedCategory === entry.name ? '#fff' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${currencySymbol}${formatAmount(value)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="category-details">
              {categoryData.slice(0, 4).map(item => (
                <div 
                  key={item.name} 
                  className={`cat-stat-item ${selectedCategory === item.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(item.name === selectedCategory ? null : item.name)}
                >
                  <div className="cat-name-box">
                    <div className="cat-dot" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="cat-val">{currencySymbol}{formatAmount(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Spending Bar Chart */}
          <div className="analytics-card glass-panel">
            <div className="card-header">
              <h3>Spending Density</h3>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    formatter={(value) => [`${currencySymbol}${formatAmount(value)}`, '']}
                  />
                  <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Drill Down Section */}
        {selectedCategory && (
          <div className="drill-down-section glass-panel fade-in">
            <div className="drill-header">
              <h3>Transactions in <span>{selectedCategory}</span></h3>
              <button className="close-drill" onClick={() => setSelectedCategory(null)}><X size={18} /></button>
            </div>
            <div className="drill-list">
              {filteredTransactions.map(t => (
                <div key={t.id} className="drill-item">
                  <div className="drill-item-left">
                    <div className="drill-icon"><ChevronRight size={14} /></div>
                    <div className="drill-info">
                      <span className="merchant">{t.merchant || t.name}</span>
                      <span className="date">{t.date}</span>
                    </div>
                  </div>
                  <div className="drill-amount text-danger">-{currencySymbol}{formatAmount(Math.abs(t.amount))}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default Analytics;
