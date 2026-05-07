import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Clock,
  DollarSign,
  PieChart as PieChartIcon,
  Search
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import EmptyState from '../components/EmptyState';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './Savings.css';

const Savings = () => {
  const { goals, addGoal, updateGoal, deleteGoal, searchQuery, setSearchQuery, currencySymbol, formatAmount } = useTransactions();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editGoal, setEditGoal] = useState(null);
  const [formData, setFormData] = useState({ name: '', target: '', current: '', color: '#f59e0b' });

  const filteredGoals = goals.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditGoal(goal);
      setFormData({ name: goal.name, target: goal.target, current: goal.current, color: goal.color });
    } else {
      setEditGoal(null);
      setFormData({ name: '', target: '', current: '', color: '#f59e0b' });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      target: Number(formData.target),
      current: Number(formData.current)
    };

    if (editGoal) {
      updateGoal(editGoal.id, data);
    } else {
      addGoal(data);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteGoal(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + Number(g.target), 0);
  const totalSaved = goals.reduce((acc, g) => acc + Number(g.current), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="savings-container">
      <div className="fade-in">
        <header className="page-header">
          <div>
            <h1>Savings Plans</h1>
            <p>Set targets and track your journey to financial freedom</p>
          </div>
          <div className="header-actions">
            <div className="header-search glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '8px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search goals..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <button className="primary-btn" onClick={() => handleOpenModal()}>
              <Plus size={18} /> New Goal
            </button>
          </div>
        </header>

        <div className="savings-summary glass-panel">
          <div className="summary-info">
            <div className="summary-item">
              <span className="label">Total Saved</span>
              <span className="value">{currencySymbol}{formatAmount(totalSaved)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Target</span>
              <span className="value">{currencySymbol}{formatAmount(totalTarget)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Overall Progress</span>
              <span className="value">{overallProgress}%</span>
            </div>
          </div>
          <div className="overall-progress-bar">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        {filteredGoals.length === 0 ? (
          <EmptyState 
            icon={Target}
            title={searchQuery ? "No matching goals" : "No savings goals"}
            message={searchQuery ? `We couldn't find any goal matching "${searchQuery}"` : "Set a target for your dream car, house, or vacation and watch your progress grow."}
            onAction={searchQuery ? null : () => handleOpenModal()}
            actionLabel="Create First Goal"
          />
        ) : (
          <div className="goals-grid">
            {filteredGoals.map((goal) => {
              const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
              return (
                <div key={goal.id} className="goal-detail-card glass-panel">
                  <div className="goal-card-header">
                    <div className="goal-icon-box" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                      <Target size={24} />
                    </div>
                    <div className="goal-actions">
                      <button onClick={() => handleOpenModal(goal)}><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteConfirmId(goal.id)} className="delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="goal-card-body">
                    <h3>{goal.name}</h3>
                    <div className="goal-amounts">
                      <span className="current">{currencySymbol}{formatAmount(goal.current)}</span>
                      <span className="separator">of</span>
                      <span className="target">{currencySymbol}{formatAmount(goal.target)}</span>
                    </div>
                    
                    <div className="progress-container">
                      <div className="progress-info">
                        <span>Progress</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${percent}%`, backgroundColor: goal.color }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="goal-card-footer">
                    {percent === 100 ? (
                      <div className="status-badge success">
                        <CheckCircle2 size={14} /> Completed
                      </div>
                    ) : (
                      <div className="status-badge pending">
                        <Clock size={14} /> In Progress
                      </div>
                    )}
                    <span className="remaining">
                      {currencySymbol}{formatAmount(goal.target - goal.current)} remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container glass-panel fade-in">
            <div className="modal-header">
              <h2>{editGoal ? 'Edit Savings Goal' : 'Create New Goal'}</h2>
              <button onClick={() => setModalOpen(false)} className="close-btn"><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Goal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dream House" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Amount ({currencySymbol})</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Current Savings ({currencySymbol})</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.current}
                    onChange={(e) => setFormData({...formData, current: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Theme Color</label>
                <div className="color-picker">
                  {['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#f43f5e'].map(c => (
                    <button 
                      key={c}
                      type="button"
                      className={`color-dot ${formData.color === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setFormData({...formData, color: c})}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="primary-btn">
                {editGoal ? 'Update Goal' : 'Start Saving'}
              </button>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal? All progress data for this goal will be lost."
      />
    </div>
  );
};

export default Savings;
