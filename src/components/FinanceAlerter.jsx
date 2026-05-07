import React, { useEffect, useRef } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';

const FinanceAlerter = () => {
  const { subscriptions, budgets, getCategoryTotals, currencySymbol, formatAmount } = useTransactions();
  const { addToast } = useToast();
  const alertedRef = useRef(new Set());

  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) return;

    const today = new Date();
    const currentMonthTotals = getCategoryTotals();

    // 1. Check for upcoming subscriptions (due in next 3 days)
    subscriptions.forEach(sub => {
      const dueDate = new Date(sub.next_billing || sub.date);
      // Simplify logic for demo: assume sub.date is the day of month
      const dueDay = dueDate.getDate();
      const currentDay = today.getDate();
      
      const diff = dueDay - currentDay;
      const alertKey = `sub-${sub.id}-${today.getMonth()}`;

      if (diff >= 0 && diff <= 3 && !alertedRef.current.has(alertKey)) {
        addToast(`${sub.name} subscription (${currencySymbol}${sub.amount}) is due in ${diff === 0 ? 'today' : diff + ' days'}`, 'info');
        alertedRef.current.add(alertKey);
      }
    });

    // 2. Check for exceeded budgets
    Object.entries(budgets).forEach(([category, limit]) => {
      const spent = currentMonthTotals[category] || 0;
      const alertKey = `budget-${category}-${today.getMonth()}`;

      if (spent > limit && limit > 0 && !alertedRef.current.has(alertKey)) {
        addToast(`Budget exceeded for ${category}! Spent: ${currencySymbol}${formatAmount(spent)}`, 'error');
        alertedRef.current.add(alertKey);
      } else if (spent > limit * 0.8 && limit > 0 && !alertedRef.current.has(alertKey)) {
        addToast(`You've used 80% of your ${category} budget`, 'info');
        alertedRef.current.add(alertKey);
      }
    });

  }, [subscriptions, budgets, getCategoryTotals, addToast, currencySymbol]);

  return null; // This component doesn't render anything UI-wise
};

export default FinanceAlerter;
