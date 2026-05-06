import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  CreditCard, 
  Clock, 
  Trash2, 
  AlertCircle,
  TrendingUp,
  Tag,
  Edit2,
  LayoutGrid
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import './Subscriptions.css';

const Subscriptions = () => {
  const { subscriptions, addSubscription, deleteSubscription, editSubscription, searchQuery } = useTransactions();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    amount: '', 
    cycle: 'Monthly', 
    category: 'Entertainment',
    nextBilling: new Date().toISOString().split('T')[0]
  });

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const monthlyTotal = subscriptions.reduce((acc, sub) => {
    return acc + (sub.cycle === 'Monthly' ? Number(sub.amount) : Number(sub.amount) / 12);
  }, 0);

  // Calendar Logic
  const daysInMonth = 31; // Simplified for demo
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getSubsForDay = (day) => {
    return filteredSubscriptions.filter(sub => {
      const subDay = new Date(sub.nextBilling).getDate();
      return subDay === day;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subData = { 
      ...formData, 
      amount: Number(formData.amount),
      id: editingSub ? editingSub.id : Date.now() 
    };

    if (editingSub) {
      editSubscription(subData);
      addToast(`${formData.name} updated`, 'success');
    } else {
      addSubscription(subData);
      addToast(`${formData.name} added to subscriptions`, 'success');
    }

    handleCloseModal();
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
    setFormData({ ...sub });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSub(null);
    setFormData({ 
      name: '', 
      amount: '', 
      cycle: 'Monthly', 
      category: 'Entertainment',
      nextBilling: new Date().toISOString().split('T')[0]
    });
  };

  const confirmDelete = (sub) => {
    setSubToDelete(sub);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (subToDelete) {
      deleteSubscription(subToDelete.id);
      addToast(`${subToDelete.name} removed`, 'info');
      setShowDeleteConfirm(false);
      setSubToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="subscriptions-container">
      <div className="fade-in">
        <header className="page-header">
          <div>
            <h1>Subscriptions</h1>
            <p>Manage your recurring expenses and automated payments</p>
          </div>
          <button className="primary-btn" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Add Subscription
          </button>
        </header>

        <div className="sub-metrics-row">
          <div className="metric-panel glass-panel">
            <div className="metric-icon"><CreditCard size={24} /></div>
            <div className="metric-data">
              <span className="label">Monthly Total</span>
              <span className="value">${monthlyTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="metric-panel glass-panel">
            <div className="metric-icon"><Calendar size={24} /></div>
            <div className="metric-data">
              <span className="label">Annual Projection</span>
              <span className="value">${(monthlyTotal * 12).toFixed(2)}</span>
            </div>
          </div>
          <div className="metric-panel glass-panel">
            <div className="metric-icon"><Clock size={24} /></div>
            <div className="metric-data">
              <span className="label">Active Services</span>
              <span className="value">{subscriptions.length}</span>
            </div>
          </div>
        </div>

        {filteredSubscriptions.length === 0 ? (
          <EmptyState 
            icon={CreditCard}
            title={searchQuery ? "No results found" : "No subscriptions yet"}
            message={searchQuery ? `We couldn't find any service matching "${searchQuery}"` : "Add your recurring bills, Netflix, or Spotify to track your commitments."}
            onAction={searchQuery ? null : () => setModalOpen(true)}
            actionLabel="Add Subscription"
          />
        ) : viewMode === 'grid' ? (
          <div className="subscriptions-grid">
            {filteredSubscriptions.map((sub) => (
              <div key={sub.id} className="sub-card glass-panel">
                <div className="sub-card-header">
                  <div className="sub-logo">{sub.name.charAt(0)}</div>
                  <div className="sub-actions">
                    <button onClick={() => handleEdit(sub)} className="edit-sub">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => confirmDelete(sub)} className="delete-sub">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="sub-card-body">
                  <h3>{sub.name}</h3>
                  <span className="sub-category"><Tag size={12} /> {sub.category}</span>
                  <div className="sub-price">
                    <span className="price">${sub.amount.toFixed(2)}</span>
                    <span className="cycle">/{sub.cycle === 'Monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>
                <div className="sub-card-footer">
                  <div className="next-billing">
                    <AlertCircle size={14} />
                    <span>Next Billing: {formatDate(sub.nextBilling)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-view glass-panel fade-in">
            <div className="calendar-grid">
              {calendarDays.map(day => {
                const daySubs = getSubsForDay(day);
                return (
                  <div key={day} className={`calendar-day ${daySubs.length > 0 ? 'has-subs' : ''}`}>
                    <span className="day-number">{day}</span>
                    <div className="day-subs">
                      {daySubs.map(sub => (
                        <div key={sub.id} className="day-sub-dot" title={`${sub.name} - $${sub.amount}`} style={{ background: sub.category === 'Work' ? '#3b82f6' : '#f59e0b' }}></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="calendar-legend">
              <div className="legend-item"><span className="dot" style={{ background: '#3b82f6' }}></span> Work</div>
              <div className="legend-item"><span className="dot" style={{ background: '#f59e0b' }}></span> Entertainment</div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container glass-panel fade-in">
            <div className="modal-header">
              <h2>{editingSub ? 'Edit Subscription' : 'New Subscription'}</h2>
              <button onClick={handleCloseModal} className="close-btn"><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" placeholder="e.g. Netflix" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Billing Cycle</label>
                  <select value={formData.cycle} onChange={(e) => setFormData({...formData, cycle: e.target.value})}>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Work">Work</option>
                    <option value="Music">Music</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Next Billing Date</label>
                  <input type="date" value={formData.nextBilling} onChange={(e) => setFormData({...formData, nextBilling: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="primary-btn">
                {editingSub ? 'Save Changes' : 'Add Subscription'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-container glass-panel delete-confirm-modal fade-in">
            <div className="confirm-icon"><Trash2 size={40} /></div>
            <h2>Remove Subscription?</h2>
            <p>Are you sure you want to remove <strong>{subToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="secondary-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="primary-btn danger" onClick={handleDelete}>Delete Subscription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
