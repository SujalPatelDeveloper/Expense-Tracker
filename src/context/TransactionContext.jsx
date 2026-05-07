import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Auth Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(formatUser(session.user));
        setBudgets(session.user.user_metadata?.budgets || {});
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const formattedUser = formatUser(session.user);
        setUser(formattedUser);
        setBudgets(session.user.user_metadata?.budgets || {});
      } else {
        setUser(null);
        setBudgets({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatUser = (supabaseUser) => {
    const localAvatar = localStorage.getItem('custom_avatar');
    const metadata = supabaseUser.user_metadata || {};
    
    return {
      id: supabaseUser.id,
      name: metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email,
      avatar: metadata.avatar_url || localAvatar,
      plan: 'Pro Member',
      providers: supabaseUser.app_metadata?.providers || [],
      currency: metadata.currency || 'USD'
    };
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return 'Rs. ';
      case 'USD': default: return '$';
    }
  };
  const currencySymbol = getCurrencySymbol(user?.currency);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Data Fetching & Real-time Subscriptions (only if authenticated)
  useEffect(() => {
    if (session) {
      fetchInitialData();

      const subTransactions = supabase
        .channel('public:transactions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchInitialData)
        .subscribe();

      const subGoals = supabase
        .channel('public:savings_goals')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'savings_goals' }, fetchInitialData)
        .subscribe();

      const subInvestments = supabase
        .channel('public:investments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, fetchInitialData)
        .subscribe();

      const subSubs = supabase
        .channel('public:subscriptions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, fetchInitialData)
        .subscribe();

      return () => {
        supabase.removeChannel(subTransactions);
        supabase.removeChannel(subGoals);
        supabase.removeChannel(subInvestments);
        supabase.removeChannel(subSubs);
      };
    } else {
      setTransactions([]);
      setGoals([]);
      setInvestments([]);
      setSubscriptions([]);
    }
  }, [session]);

  const fetchInitialData = async () => {
    const { data: trans } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    const { data: invs } = await supabase.from('investments').select('*');
    const { data: g } = await supabase.from('savings_goals').select('*');
    const { data: subs } = await supabase.from('subscriptions').select('*');

    if (trans) setTransactions(trans);
    if (invs) setInvestments(invs);
    if (g) setGoals(g);
    if (subs) setSubscriptions(subs);

    // Recurring Automation
    if (subs && trans && session) {
      const today = new Date().toISOString().split('T')[0];
      const newTransactions = [];
      const updatedSubscriptions = [];

      subs.forEach(sub => {
        if (sub.next_billing && sub.next_billing <= today) {
          const alreadyBilled = trans.some(t => 
            t.category === 'Subscription' && 
            t.name === sub.name && 
            t.date === sub.next_billing &&
            Number(t.amount) === Number(sub.amount)
          );

          if (!alreadyBilled) {
            newTransactions.push({
              user_id: session.user.id,
              name: sub.name,
              amount: sub.amount,
              type: 'expense',
              category: 'Subscription',
              date: sub.next_billing,
              status: 'Completed'
            });

            const nextDate = new Date(sub.next_billing);
            if (sub.cycle === 'Monthly') {
              nextDate.setMonth(nextDate.getMonth() + 1);
            } else {
              nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            updatedSubscriptions.push({
              ...sub,
              next_billing: nextDate.toISOString().split('T')[0]
            });
          }
        }
      });

      if (newTransactions.length > 0) {
        await supabase.from('transactions').insert(newTransactions);
        const { data: refreshedTrans } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (refreshedTrans) setTransactions(refreshedTrans);
      }

      for (const updatedSub of updatedSubscriptions) {
        await supabase.from('subscriptions').update({ next_billing: updatedSub.next_billing }).eq('id', updatedSub.id);
      }
    }
  };

  // Auth Methods
  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email, password, name) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: name } }
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' }
    });
  };

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.origin + '/dashboard' }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.replace('/');
  };

  const updateBudget = async (category, amount) => {
    try {
      const newBudgets = { ...budgets, [category]: amount };
      const { data, error } = await supabase.auth.updateUser({
        data: { budgets: newBudgets }
      });

      if (error) throw error;
      setBudgets(newBudgets);
      return { success: true };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false, error: error.message };
    }
  };

  const getCategoryTotals = () => {
    const totals = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    transactions.forEach(t => {
      const date = new Date(t.date);
      if (t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      }
    });
    return totals;
  };

  const updateUserProfile = async (updatedData) => {
    // Check if avatar is a base64 string (which exceeds Supabase's 8KB metadata limit)
    let safeAvatarUrl = updatedData.avatar;
    if (safeAvatarUrl && safeAvatarUrl.startsWith('data:image')) {
      localStorage.setItem('custom_avatar', safeAvatarUrl);
      safeAvatarUrl = undefined; // Do not send base64 to Supabase
    } else if (safeAvatarUrl === null) {
      localStorage.removeItem('custom_avatar');
    }

    const metadataToUpdate = {
      full_name: updatedData.name,
      currency: updatedData.currency
    };
    
    if (safeAvatarUrl !== undefined) {
      metadataToUpdate.avatar_url = safeAvatarUrl;
    }

    // Update Supabase Auth metadata
    const { data, error } = await supabase.auth.updateUser({
      data: metadataToUpdate
    });

    if (!error && data?.user) {
      // Sync with the actual data returned from Supabase
      const updatedUser = formatUser(data.user);
      setUser(updatedUser);
      return { success: true };
    } else {
      if (error) console.error("Error updating profile:", error.message);
      // Re-sync with session state if failed
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) setUser(formatUser(currentUser));
      return { error: error?.message || 'Failed to update profile' };
    }
  };

  const updateUserPassword = async (oldPassword, newPassword) => {
    // If old password is required, verify it first
    if (oldPassword) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: oldPassword
      });
      if (signInError) return { error: 'Incorrect old password' };
    }

    // Update to new password
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };

    // Refresh user state to update providers if needed
    if (data?.user) {
      setUser(formatUser(data.user));
    }
    return { success: true };
  };

  const uploadReceipt = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    
    const { error } = await supabase.storage.from('receipts').upload(filePath, file);
    if (error) {
      console.error('Upload error', error);
      return null;
    }
    
    const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const uploadAvatar = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${session.user.id}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (error) {
      console.error('Avatar upload error', error);
      return null;
    }
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addTransaction = async (transaction, receiptFiles = []) => {
    let newReceiptUrls = transaction.receipt_urls || [];
    if (receiptFiles && receiptFiles.length > 0) {
      for (const file of receiptFiles) {
        const url = await uploadReceipt(file);
        if (url) newReceiptUrls.push(url);
      }
    }
    const newTrans = { 
      ...transaction, 
      user_id: session.user.id,
      status: 'Completed', 
      receipt_urls: newReceiptUrls.length > 0 ? newReceiptUrls : null,
      date: transaction.date || new Date().toISOString().split('T')[0] 
    };
    const { error } = await supabase.from('transactions').insert([newTrans]);
    if (error) {
      console.error('Error adding transaction:', error);
      fetchInitialData();
    }
  };

  const deleteTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    await supabase.from('transactions').delete().eq('id', id);
  };

  const updateTransaction = async (id, updatedData, newReceiptFiles = []) => {
    let currentReceiptUrls = updatedData.receipt_urls || [];
    if (newReceiptFiles && newReceiptFiles.length > 0) {
      for (const file of newReceiptFiles) {
        const url = await uploadReceipt(file);
        if (url) currentReceiptUrls.push(url);
      }
    }
    const finalData = { ...updatedData };
    finalData.receipt_urls = currentReceiptUrls.length > 0 ? currentReceiptUrls : null;

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...finalData } : t));
    await supabase.from('transactions').update(finalData).eq('id', id);
  };

  const clearAllData = async () => {
    setTransactions([]);
    setGoals([]);
    setInvestments([]);
    setSubscriptions([]);
    await supabase.from('transactions').delete().eq('user_id', session.user.id);
    await supabase.from('savings_goals').delete().eq('user_id', session.user.id);
    await supabase.from('investments').delete().eq('user_id', session.user.id);
    await supabase.from('subscriptions').delete().eq('user_id', session.user.id);
  };

  const deleteAccount = async () => {
    await clearAllData();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const addGoal = async (goal) => {
    const newGoal = { ...goal, user_id: session.user.id };
    setGoals(prev => [...prev, newGoal]);
    await supabase.from('savings_goals').insert([newGoal]);
  };

  const updateGoal = async (id, data) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
    await supabase.from('savings_goals').update(data).eq('id', id);
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    await supabase.from('savings_goals').delete().eq('id', id);
  };

  const addInvestment = async (inv) => {
    const newInv = { ...inv, user_id: session.user.id };
    setInvestments(prev => [...prev, newInv]);
    await supabase.from('investments').insert([newInv]);
  };

  const deleteInvestment = async (id) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
    await supabase.from('investments').delete().eq('id', id);
  };

  const addSubscription = async (sub) => {
    const newSub = { ...sub, user_id: session.user.id };
    const { error } = await supabase.from('subscriptions').insert([newSub]);
    if (error) {
      console.error('Error adding subscription:', error);
      fetchInitialData();
    }
  };

  const deleteSubscription = async (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    await supabase.from('subscriptions').delete().eq('id', id);
  };

  const editSubscription = async (updatedSub) => {
    const { error } = await supabase.from('subscriptions').update(updatedSub).eq('id', updatedSub.id);
    if (error) {
      console.error('Error editing subscription:', error);
      fetchInitialData();
    }
  };

  // Totals Calculation
  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += Number(curr.amount);
    else acc.expense += Math.abs(Number(curr.amount));
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const formatAmount = (amount) => {
    const currency = user?.currency || 'USD';
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const monthlySubscriptionTotal = subscriptions.reduce((acc, sub) => {
    return acc + (sub.cycle === 'Monthly' ? Number(sub.amount) : Number(sub.amount) / 12);
  }, 0);
  
  totals.expense += monthlySubscriptionTotal;
  totals.balance = totals.income - totals.expense;

  const totalSavings = goals.reduce((acc, g) => acc + Number(g.current), 0);
  const totalInvestments = investments.reduce((acc, i) => acc + Number(i.amount), 0);
  totals.netWorth = totals.balance + totalSavings + totalInvestments;
  totals.totalSavings = totalSavings;
  totals.totalInvestments = totalInvestments;

  return (
    <TransactionContext.Provider value={{ 
      session,
      user,
      updateUserProfile,
      updateUserPassword,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      transactions, 
      addTransaction, 
      deleteTransaction, 
      updateTransaction, 
      clearAllData,
      deleteAccount,
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
      isDark,
      setIsDark,
      toggleTheme: () => setIsDark(prev => !prev),
      totals,
      currencySymbol,
      formatAmount,
      budgets,
      updateBudget,
      getCategoryTotals,
      uploadReceipt,
      uploadAvatar
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
