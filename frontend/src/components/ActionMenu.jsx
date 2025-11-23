import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import '../styles/ActionMenu.css';

const ActionMenu = ({ employee, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="action-menu-container" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="action-menu-button"
        type="button"
      >
        <MoreVertical className="action-menu-icon" />
      </button>

      {isOpen && (
        <div className="action-menu-dropdown">
          <button
            onClick={() => {
              onEdit(employee);
              setIsOpen(false);
            }}
            className="action-menu-item action-menu-edit"
            type="button"
          >
            <Edit className="action-menu-item-icon" />
            Edit
          </button>
          <div className="action-menu-divider"></div>
          <button
            onClick={() => {
              onDelete(employee);
              setIsOpen(false);
            }}
            className="action-menu-item action-menu-delete"
            type="button"
          >
            <Trash2 className="action-menu-item-icon" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;