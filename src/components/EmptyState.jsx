import React from 'react';
import { Plus } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ icon: Icon, title, message, onAction, actionLabel }) => {
  return (
    <div className="empty-state-container fade-in">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {onAction && (
        <button className="primary-btn" onClick={onAction}>
          <Plus size={18} /> {actionLabel || 'Add New'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
