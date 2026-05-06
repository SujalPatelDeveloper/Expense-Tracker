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
    return saved ? JSON.parse(saved) : { 
      name: 'User', 
      plan: 'Pro Member', 
      currency: 'USD',
      avatar: null 
    };
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('savings_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('savings_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

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

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now() }]);
  };

  const updateGoal = (id, data) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const addInvestment = (inv) => {
    setInvestments([...investments, { ...inv, id: Date.now() }]);
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  const addSubscription = (sub) => {
    setSubscriptions([...subscriptions, { ...sub, id: Date.now() }]);
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  // Calculate Totals
  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'income') {
      acc.income += curr.amount;
    } else {
      acc.expense += Math.abs(curr.amount);
    }
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  // Add subscriptions to expenses
  const monthlySubscriptionTotal = subscriptions.reduce((acc, sub) => {
    return acc + (sub.cycle === 'Monthly' ? sub.amount : sub.amount / 12);
  }, 0);
  
  totals.expense += monthlySubscriptionTotal;
  totals.balance = totals.income - totals.expense;

  // Calculate Net Worth
  const totalSavings = goals.reduce((acc, g) => acc + g.current, 0);
  const totalInvestments = investments.reduce((acc, i) => acc + i.amount, 0);
  totals.netWorth = totals.balance + totalSavings + totalInvestments;
  totals.totalSavings = totalSavings;
  totals.totalInvestments = totalInvestments;

  const editSubscription = (updatedSub) => {
    setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
  };

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
      investments,
      addInvestment,
      deleteInvestment,
      editSubscription,
      subscriptions,
      addSubscription,
      deleteSubscription,
      searchQuery,
      setSearchQuery,
      totals 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
