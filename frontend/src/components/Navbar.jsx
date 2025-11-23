import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ user, logout }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-text">HRMS</span>
          <span className="logo-subtitle">Human Resource Management</span>
        </Link>
        <div className="navbar-actions">
          <div className="user-info">
            <div className="user-avatar">
              <User className="user-icon" />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="logout-button"
          >
            <LogOut className="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;