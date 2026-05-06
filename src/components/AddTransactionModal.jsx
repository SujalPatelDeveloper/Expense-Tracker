import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, editData = null }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Lifestyle',
    type: 'expense'
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        amount: Math.abs(editData.amount),
        category: editData.category,
        type: editData.type
      });
    } else {
      setFormData({ name: '', amount: '', category: 'Lifestyle', type: 'expense' });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const transactionData = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };

    if (editData) {
      updateTransaction(editData.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container glass-panel fade-in">
        <div className="modal-header">
          <h2>{editData ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="type-toggle">
            <button 
              type="button" 
              className={`toggle-btn expense ${formData.type === 'expense' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, type: 'expense'})}
            >
              <ArrowUpRight size={18} /> Expense
            </button>
            <button 
              type="button" 
              className={`toggle-btn income ${formData.type === 'income' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, type: 'income'})}
            >
              <ArrowDownLeft size={18} /> Income
            </button>
          </div>

          <div className="form-group">
            <label>Transaction Name</label>
            <div className="input-wrapper">
              <Tag size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g. Apple Store" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <div className="input-wrapper">
              <DollarSign size={18} className="input-icon" />
              <input 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Lifestyle">Lifestyle</option>
              <option value="Tech">Tech</option>
              <option value="Food">Food</option>
              <option value="Salary">Salary</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Investments">Investments</option>
              <option value="Housing">Housing</option>
            </select>
          </div>

          <button type="submit" className="submit-btn primary-btn">
            {editData ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
