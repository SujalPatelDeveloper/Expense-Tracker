import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this entry? This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container glass-panel fade-in delete-confirm">
        <div className="confirm-icon">
          <AlertCircle size={40} />
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn delete-btn" onClick={onConfirm}>Delete Entry</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
