import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';
import './Transactions.css';

const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredTransactions = transactions.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transactions-container fade-in">
      <header className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Monitor and manage your financial activity</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Add Transaction
          </button>
          <button className="secondary-btn"><Download size={18} /> Export</button>
        </div>
      </header>

      <div className="table-controls glass-panel">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="filter-btn"><Filter size={18} /> Filter</button>
          <select className="sort-select">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Highest Amount</option>
            <option>Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="table-container glass-panel">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className="transaction-info">
                    <div className={`type-icon ${t.type}`}>
                      {t.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <span className="transaction-name">{t.name}</span>
                  </div>
                </td>
                <td><span className="category-tag">{t.category}</span></td>
                <td><span className="date-text">{t.date}</span></td>
                <td>
                  <span className={`status-pill ${t.status?.toLowerCase() || 'completed'}`}>
                    {t.status || 'Completed'}
                  </span>
                </td>
                <td>
                  <span className={`amount-text ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </td>
                <td>
                  <button className="more-btn" onClick={() => deleteTransaction(t.id)}>
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <p>No transactions found matching your search.</p>
          </div>
        )}

        <div className="pagination">
          <span className="pagination-info">Showing {filteredTransactions.length} of {transactions.length} transactions</span>
          <div className="pagination-btns">
            <button className="page-btn disabled"><ChevronLeft size={18} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default Transactions;
