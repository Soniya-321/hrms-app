import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ item, itemType, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  // Get the display name based on item type
  const getItemName = () => {
    if (itemType === 'team') {
      return item.name;
    }
    // For employee or default
    return `${item.first_name} ${item.last_name}`;
  };

  // Get the title based on item type
  const getTitle = () => {
    return itemType === 'team' ? 'Delete Team' : 'Delete Employee';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{getTitle()}</h3>
            <button
              onClick={onClose}
              className="modal-close-button"
              type="button"
            >
              <X className="modal-close-icon" />
            </button>
          </div>
          
          <div className="modal-message">
            <p>
              Are you sure you want to delete{' '}
              <span className="modal-employee-name">
                "{getItemName()}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="modal-actions">
            <button
              onClick={onClose}
              className="modal-button modal-cancel-button"
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`modal-button modal-delete-button ${loading ? 'modal-button-loading' : ''}`}
              disabled={loading}
              type="button"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;