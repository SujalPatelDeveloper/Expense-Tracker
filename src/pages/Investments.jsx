import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  DollarSign, 
  Briefcase, 
  PieChart as PieChartIcon,
  Search,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './Investments.css';

const Investments = () => {
  const { investments, addInvestment, deleteInvestment, searchQuery, setSearchQuery, currencySymbol, formatAmount } = useTransactions();
  const { addToast } = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({ name: '', symbol: '', amount: '', type: 'Stock', growth: 0 });

  const filteredInvestments = investments.filter(inv => 
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const avgGrowth = investments.length > 0 ? (investments.reduce((acc, inv) => acc + Number(inv.growth), 0) / investments.length).toFixed(1) : 0;

  const typeData = [
    { name: 'Stocks', value: investments.filter(i => i.type === 'Stock').reduce((acc, i) => acc + Number(i.amount), 0), color: '#6366f1' },
    { name: 'Crypto', value: investments.filter(i => i.type === 'Crypto').reduce((acc, i) => acc + Number(i.amount), 0), color: '#f59e0b' },
    { name: 'ETFs', value: investments.filter(i => i.type === 'ETF').reduce((acc, i) => acc + Number(i.amount), 0), color: '#10b981' },
  ].filter(d => d.value > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvestment({ ...formData, amount: Number(formData.amount), growth: Number(formData.growth) });
    addToast(`${formData.name} added to portfolio`, 'success');
    setModalOpen(false);
    setFormData({ name: '', symbol: '', amount: '', type: 'Stock', growth: 0 });
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const inv = investments.find(i => i.id === deleteConfirmId);
    deleteInvestment(deleteConfirmId);
    addToast(`${inv?.name || 'Asset'} removed from portfolio`, 'info');
    setDeleteConfirmId(null);
  };

  return (
    <div className="investments-container">
      <div className="fade-in">
        <header className="page-header">
          <div>
            <h1>Investments</h1>
            <p>Track your portfolio performance and asset distribution</p>
          </div>
          <div className="header-actions">
            <div className="search-box glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '8px' }}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search portfolio..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <button className="primary-btn" onClick={() => setModalOpen(true)}>
              <Plus size={18} /> Add Asset
            </button>
          </div>
        </header>

        <div className="portfolio-summary-grid">
          <div className="summary-card glass-panel">
            <div className="card-info">
              <span className="label">Total Portfolio Value</span>
              <span className="value">{currencySymbol}{formatAmount(totalValue)}</span>
            </div>
            <div className="card-icon portfolio"><Briefcase size={24} /></div>
          </div>
          <div className="summary-card glass-panel">
            <div className="card-info">
              <span className="label">Average Growth</span>
              <span className="value">{avgGrowth}%</span>
            </div>
            <div className="card-icon growth"><TrendingUp size={24} /></div>
          </div>
          <div className="summary-card glass-panel">
            <div className="card-info">
              <span className="label">Total Assets</span>
              <span className="value">{investments.length}</span>
            </div>
            <div className="card-icon assets"><PieChartIcon size={24} /></div>
          </div>
        </div>

        {filteredInvestments.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title={searchQuery ? "No assets found" : "No investments yet"}
            message={searchQuery ? `No asset matching "${searchQuery}" was found in your portfolio.` : "Start building your wealth by adding your first stock, crypto, or ETF asset."}
            onAction={searchQuery ? null : () => setModalOpen(true)}
            actionLabel="Add First Asset"
          />
        ) : (
          <div className="investments-main-grid">
            <div className="assets-table-section glass-panel">
              <div className="assets-table-container">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Type</th>
                      <th>Value</th>
                      <th>Growth</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((inv) => (
                      <tr key={inv.id}>
                        <td>
                          <div className="asset-info">
                            <span className="symbol">{inv.symbol}</span>
                            <span className="name">{inv.name}</span>
                          </div>
                        </td>
                        <td><span className={`asset-type-tag ${inv.type.toLowerCase()}`}>{inv.type}</span></td>
                        <td><span className="asset-value">{currencySymbol}{formatAmount(inv.amount)}</span></td>
                        <td>
                          <span className={`asset-growth ${Number(inv.growth) >= 0 ? 'text-success' : 'text-danger'}`}>
                            {Number(inv.growth) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(inv.growth)}%
                          </span>
                        </td>
                        <td>
                          <button onClick={() => setDeleteConfirmId(inv.id)} className="delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="asset-distribution glass-panel">
              <h3>Asset Allocation</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={typeData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${currencySymbol}${formatAmount(value)}`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="distribution-legend">
                {typeData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <div className="dot" style={{ backgroundColor: item.color }}></div>
                    <span className="name">{item.name}</span>
                    <span className="percent">{((item.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container glass-panel fade-in">
            <div className="modal-header">
              <h2>Add New Asset</h2>
              <button onClick={() => setModalOpen(false)} className="close-btn"><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Asset Name</label>
                <input type="text" placeholder="e.g. Apple Inc." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ticker Symbol</label>
                  <input type="text" placeholder="e.g. AAPL" value={formData.symbol} onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})} required />
                </div>
                <div className="form-group">
                  <label>Asset Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Stock">Stock</option>
                    <option value="Crypto">Crypto</option>
                    <option value="ETF">ETF</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Invested Amount ({currencySymbol})</label>
                  <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Initial Growth (%)</label>
                  <input type="number" step="0.1" placeholder="0.0" value={formData.growth} onChange={(e) => setFormData({...formData, growth: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="primary-btn">Add to Portfolio</button>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Remove Asset"
        message="Are you sure you want to remove this asset from your portfolio?"
      />
    </div>
  );
};

export default Investments;
