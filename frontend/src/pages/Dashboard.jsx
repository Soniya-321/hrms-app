import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Employees from './Employees';
import Teams from './Teams';
import Logs from './Logs';
import { Users, UsersRound, ClipboardList } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // Load the active tab from sessionStorage or default to 'employees'
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('activeTab') || 'employees';
  });

  // Save the active tab to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <div className="dashboard-page">
      <Navbar user={user} logout={logout} />
      
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <h1 className="dashboard-hero-title">
            Human Resource Management System
          </h1>
          <p className="dashboard-hero-subtitle">
            Streamline your workforce management
          </p>
        </div>
      </div>
      
      <div className="dashboard-container">
        <div className="dashboard-tabs-container">
          <div className="dashboard-tabs">
            <button
              onClick={() => setActiveTab('employees')}
              className={`tab-button ${activeTab === 'employees' ? 'tab-button-active' : ''}`}
            >
              <Users className="tab-icon" />
              Employees
            </button>
            
            <button
              onClick={() => setActiveTab('teams')}
              className={`tab-button ${activeTab === 'teams' ? 'tab-button-active' : ''}`}
            >
              <UsersRound className="tab-icon" />
              Teams
            </button>
            
            <button
              onClick={() => setActiveTab('logs')}
              className={`tab-button ${activeTab === 'logs' ? 'tab-button-active' : ''}`}
            >
              <ClipboardList className="tab-icon" />
              Activity Logs
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'employees' && <Employees />}
          {activeTab === 'teams' && <Teams />}
          {activeTab === 'logs' && <Logs />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;