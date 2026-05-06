import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

const initialTransactions = [
  { id: 1, name: 'Apple Store', category: 'Tech', amount: -1299.00, date: '2026-05-04', status: 'Completed', type: 'expense' },
  { id: 2, name: 'Stripe Payout', category: 'Salary', amount: 4500.00, date: '2026-05-03', status: 'Completed', type: 'income' },
  { id: 3, name: 'Starbucks', category: 'Food', amount: -12.50, date: '2026-05-03', status: 'Pending', type: 'expense' },
  { id: 4, name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: '2026-05-02', status: 'Completed', type: 'expense' },
  { id: 5, name: 'Uber Trip', category: 'Transport', amount: -24.50, date: '2026-05-02', status: 'Completed', type: 'expense' },
  { id: 6, name: 'Freelance Work', category: 'Income', amount: 850.00, date: '2026-05-01', status: 'Completed', type: 'income' },
  { id: 7, name: 'Gym Membership', category: 'Health', amount: -50.00, date: '2026-04-30', status: 'Completed', type: 'expense' },
  { id: 8, name: 'Amazon Purchase', category: 'Shopping', amount: -89.99, date: '2026-04-29', status: 'Completed', type: 'expense' },
];

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([
      { 
        ...transaction, 
        id: Date.now(),
        status: 'Completed', 
        date: new Date().toISOString().split('T')[0] 
      }, 
      ...transactions
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'income') {
      acc.income += curr.amount;
    } else {
      acc.expense += Math.abs(curr.amount);
    }
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, totals }}>
      {children}
    </TransactionContext.Provider>
  );
};
