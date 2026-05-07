import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';

const ProtectedRoute = () => {
  const { session } = useTransactions();

  if (session === undefined) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>; // Or a proper loading spinner
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
