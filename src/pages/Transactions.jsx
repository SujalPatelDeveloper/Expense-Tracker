import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  DollarSign,
  Paperclip
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTransactions } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';
import EmptyState from '../components/EmptyState';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './Transactions.css';

const Transactions = () => {
  const { transactions, deleteTransaction, searchQuery, setSearchQuery, currencySymbol, formatAmount } = useTransactions();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isExportOpen, setExportOpen] = useState(false);
  
  const menuRef = useRef(null);
  const exportRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTransactions = transactions.filter(t => 
    (t.text?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (t.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setModalOpen(true);
    setActiveMenuId(null);
  };

  const openAddModal = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Name', 'Category', 'Date', 'Type', 'Amount', 'Status'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(t => [
        `"${t.name}"`,
        `"${t.category}"`,
        t.date,
        t.type,
        t.amount.toFixed(2),
        t.status || 'Completed'
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FinVista_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('FinVista - Transaction Report', 14, 22);
    
    // Add date range info
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = transactions.map(t => [
      t.name,
      t.category,
      t.date,
      t.type.toUpperCase(),
      `${t.type === 'income' ? '+' : '-'}${currencySymbol}${formatAmount(Math.abs(t.amount))}`,
      t.status || 'Completed'
    ]);

    const netTotal = transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + Number(t.amount) : acc - Math.abs(Number(t.amount));
    }, 0);

    autoTable(doc, {
      head: [['Transaction', 'Category', 'Date', 'Type', 'Amount', 'Status']],
      body: tableData,
      foot: [['', '', '', 'NET TOTAL', `${netTotal >= 0 ? '+' : '-'}${currencySymbol}${formatAmount(Math.abs(netTotal))}`, '']],
      startY: 40,
      theme: 'striped',
      styles: { font: 'helvetica', fontSize: 10 },
      headStyles: { 
        fillColor: [245, 158, 11],
        fontStyle: 'bold'
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [40, 40, 40],
        fontStyle: 'bold'
      },
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' } 
      },
      willDrawCell: (data) => {
        // Color code Amount column body cells
        if (data.column.index === 4 && data.cell.section === 'body') {
          const type = data.row.raw[3];
          if (type === 'INCOME') data.doc.setTextColor(16, 185, 129);
          else if (type === 'EXPENSE') data.doc.setTextColor(244, 63, 94);
        }
        // Color code NET TOTAL in footer
        if (data.column.index === 4 && data.cell.section === 'footer') {
          if (netTotal >= 0) data.doc.setTextColor(16, 185, 129); // Profit
          else data.doc.setTextColor(244, 63, 94); // Loss
        }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`FinVista_Transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    setExportOpen(false);
  };

  return (
    <div className="transactions-container">
      <div className="fade-in">
        <header className="page-header">
          <div>
            <h1>Transactions</h1>
            <p>Monitor and manage your financial activity</p>
          </div>
          <div className="header-actions">
            <button className="primary-btn" onClick={openAddModal}>
              <Plus size={18} /> Add Transaction
            </button>
            <div className="export-dropdown-container" ref={exportRef}>
              <button className="secondary-btn" onClick={() => setExportOpen(!isExportOpen)}>
                <Download size={18} /> Export Data
              </button>
              {isExportOpen && (
                <div className="action-menu export-menu glass-panel fade-in">
                  <button onClick={handleExportCSV} className="menu-item">
                    CSV File (.csv)
                  </button>
                  <button onClick={handleExportPDF} className="menu-item">
                    PDF Document (.pdf)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="table-controls glass-panel">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredTransactions.length === 0 ? (
            <EmptyState 
              icon={DollarSign}
              title={searchQuery ? "No matching transactions" : "No transactions found"}
              message={searchQuery ? `We couldn't find anything for "${searchQuery}"` : "Your financial history is empty. Start by adding your first income or expense."}
              onAction={searchQuery ? null : openAddModal}
              actionLabel="Add Transaction"
            />
          ) : (
            <>
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
                          <span className="transaction-name">
                            {t.name}
                            {t.receipt_urls && t.receipt_urls.length > 0 && (
                              <div style={{ display: 'inline-flex', gap: '4px', marginLeft: '8px' }}>
                                {t.receipt_urls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="receipt-link" style={{ color: 'var(--text-secondary)' }} title={`View Receipt ${i+1}`}>
                                    <Paperclip size={14} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </span>
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
                          {t.type === 'income' ? '+' : '-'}{currencySymbol}{formatAmount(Math.abs(t.amount))}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="menu-container" ref={activeMenuId === t.id ? menuRef : null}>
                          <button 
                            className="more-btn" 
                            onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {activeMenuId === t.id && (
                            <div className="action-menu glass-panel fade-in">
                              <button onClick={() => handleEdit(t)} className="menu-item">
                                <Edit2 size={14} /> Edit
                              </button>
                              <button onClick={() => setDeleteConfirmId(t.id)} className="menu-item delete">
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <span className="pagination-info">Showing {filteredTransactions.length} of {transactions.length} transactions</span>
                <div className="pagination-btns">
                  <button className="page-btn disabled"><ChevronLeft size={18} /></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn"><ChevronRight size={18} /></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        editData={editData}
      />

      <DeleteConfirmModal 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};

export default Transactions;
