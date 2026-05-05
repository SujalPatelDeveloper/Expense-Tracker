import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Transactions.css';

const transactions = [
  { id: 1, name: 'Apple Store', category: 'Tech', amount: -1299.00, date: 'May 04, 2026', status: 'Completed', type: 'expense' },
  { id: 2, name: 'Stripe Payout', category: 'Salary', amount: 4500.00, date: 'May 03, 2026', status: 'Completed', type: 'income' },
  { id: 3, name: 'Starbucks', category: 'Food', amount: -12.50, date: 'May 03, 2026', status: 'Pending', type: 'expense' },
  { id: 4, name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: 'May 02, 2026', status: 'Completed', type: 'expense' },
  { id: 5, name: 'Uber Trip', category: 'Transport', amount: -24.50, date: 'May 02, 2026', status: 'Completed', type: 'expense' },
  { id: 6, name: 'Freelance Work', category: 'Income', amount: 850.00, date: 'May 01, 2026', status: 'Completed', type: 'income' },
  { id: 7, name: 'Gym Membership', category: 'Health', amount: -50.00, date: 'Apr 30, 2026', status: 'Completed', type: 'expense' },
  { id: 8, name: 'Amazon Purchase', category: 'Shopping', amount: -89.99, date: 'Apr 29, 2026', status: 'Completed', type: 'expense' },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="transactions-container fade-in">
      <header className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Monitor and manage your financial activity</p>
        </div>
        <div className="header-actions">
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
            {transactions.map((t) => (
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
                  <span className={`status-pill ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <span className={`amount-text ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </td>
                <td>
                  <button className="more-btn"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">Showing 1-8 of 24 transactions</span>
          <div className="pagination-btns">
            <button className="page-btn disabled"><ChevronLeft size={18} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
