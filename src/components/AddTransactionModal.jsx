import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, ArrowUpRight, ArrowDownLeft, Paperclip } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, editData = null }) => {
  const { addTransaction, updateTransaction, currencySymbol } = useTransactions();
  const [receiptFiles, setReceiptFiles] = useState([]);
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
      setReceiptFiles([]);
    } else {
      setFormData({ name: '', amount: '', category: 'Lifestyle', type: 'expense' });
      setReceiptFiles([]);
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
      updateTransaction(editData.id, transactionData, receiptFiles);
    } else {
      addTransaction(transactionData, receiptFiles);
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
              <span className="input-icon" style={{ fontSize: '18px', fontWeight: 'bold' }}>{currencySymbol}</span>
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

          <div className="form-group">
            <label>Receipts (Optional)</label>
            <label htmlFor="receipt-upload" className="input-wrapper file-upload-wrapper">
              <Paperclip size={18} className="input-icon" />
              <span className="file-upload-text">Choose files...</span>
              <input 
                id="receipt-upload"
                type="file" 
                accept="image/*,.pdf"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setReceiptFiles(prev => [...prev, ...Array.from(e.target.files)]);
                  }
                }}
                className="hidden-file-input"
              />
            </label>

            {receiptFiles.length > 0 && (
              <div className="selected-files-list">
                {receiptFiles.map((file, index) => (
                  <div key={index} className="selected-file-item fade-in">
                    <span className="file-name">{file.name}</span>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setReceiptFiles(prev => prev.filter((_, i) => i !== index));
                        document.getElementById('receipt-upload').value = '';
                      }}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {editData && editData.receipt_urls && editData.receipt_urls.length > 0 && (
              <small style={{ color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
                {editData.receipt_urls.length} receipt(s) previously saved. Uploading new files will add to them.
              </small>
            )}
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
