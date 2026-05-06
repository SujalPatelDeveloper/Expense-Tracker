import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

const initialTransactions = [];

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { name: 'User', plan: 'Pro Member', currency: 'USD' };
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('savings_goals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'New Car', target: 25000, current: 18750, color: '#f59e0b' },
      { id: 2, name: 'Home Downpayment', target: 50000, current: 15000, color: '#10b981' },
      { id: 3, name: 'Vacation Fund', target: 5000, current: 4500, color: '#6366f1' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('savings_goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now() }]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

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

  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const clearAllData = () => {
    setTransactions([]);
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
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction, 
      updateTransaction, 
      clearAllData,
      user,
      setUser,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      totals 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
