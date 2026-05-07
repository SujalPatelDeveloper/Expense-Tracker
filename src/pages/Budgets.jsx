import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  Target, 
  PieChart, 
  X
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './Budgets.css';

const Budgets = () => {
  const { 
    budgets, 
    updateBudget, 
    getCategoryTotals, 
    currencySymbol,
    formatAmount,
    transactions 
  } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'Food', amount: '' });

  const categoryTotals = getCategoryTotals();
  const categories = [...new Set(transactions.map(t => t.category))].filter(c => c !== 'Income');
  
  const defaultCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Other'];
  const allCategories = Array.from(new Set([...categories, ...defaultCategories]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.amount) {
      await updateBudget(newBudget.category, Number(newBudget.amount));
      setIsModalOpen(false);
      setNewBudget({ category: 'Food', amount: '' });
    }
  };

  const handleDelete = async (category) => {
    await updateBudget(category, 0);
  };

  const budgetItems = Object.entries(budgets).filter(([_, amount]) => amount > 0);

  return (
    <>
      <div className="budgets-page fade-in">
        <header className="page-header">
          <div className="header-info">
            <h1>Budget Planner</h1>
            <p>Set spending limits and stay on track with your goals</p>
          </div>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>Set New Budget</span>
          </button>
        </header>

        <div className="budgets-grid">
          {budgetItems.length > 0 ? (
            budgetItems.map(([category, limit]) => {
              const spent = categoryTotals[category] || 0;
              const percentage = Math.min((spent / limit) * 100, 100);
              const isOver = spent > limit;
              const remaining = limit - spent;

              return (
                <div key={category} className={`budget-card glass-panel ${isOver ? 'over-budget' : ''}`}>
                  <div className="card-header">
                    <div className="category-info">
                      <div className="category-icon">
                        <PieChart size={20} />
                      </div>
                      <h3>{category}</h3>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(category)}>
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="budget-stats">
                    <div className="stat">
                      <span>Spent</span>
                      <strong>{currencySymbol}{formatAmount(spent)}</strong>
                    </div>
                    <div className="stat">
                      <span>Limit</span>
                      <strong>{currencySymbol}{formatAmount(limit)}</strong>
                    </div>
                  </div>

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${isOver ? 'danger' : percentage > 80 ? 'warning' : 'success'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>{percentage.toFixed(0)}% used</span>
                      <span className={isOver ? 'text-danger' : 'text-success'}>
                        {isOver ? `Over by ${currencySymbol}${formatAmount(Math.abs(remaining))}` : `Left: ${currencySymbol}${formatAmount(remaining)}`}
                      </span>
                    </div>
                  </div>

                  {isOver && (
                    <div className="budget-alert">
                      <AlertCircle size={16} />
                      <span>Budget exceeded for this month!</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-state glass-panel">
              <Target size={48} className="empty-icon" />
              <h3>No Budgets Set</h3>
              <p>Start managing your wealth by setting monthly spending limits for your categories.</p>
              <button className="primary-btn" onClick={() => setIsModalOpen(true)}>Set Your First Budget</button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container glass-panel fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Set Category Budget</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newBudget.category} 
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Limit ({currencySymbol})</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="primary-btn full-width">
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Budgets;
