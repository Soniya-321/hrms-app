import React, { useState, useEffect } from 'react';
import { logAPI } from '../services/api';
import Pagination from '../components/Pagination';
import { Clock, User, Activity, FileText } from 'lucide-react';
import '../styles/Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await logAPI.getAll();
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch logs');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActionDescription = (action, meta) => {
    switch (action) {
      case 'user_registered':
        return 'User registered';
      case 'user_logged_in':
        return 'User logged in';
      case 'employee_created':
        return `Created employee: ${meta.first_name} ${meta.last_name}`;
      case 'employee_updated':
        return `Updated employee: ${meta.first_name} ${meta.last_name}`;
      case 'employee_deleted':
        return `Deleted employee with ID: ${meta.employeeId}`;
      case 'team_created':
        return `Created team: ${meta.name}`;
      case 'team_updated':
        return `Updated team: ${meta.name}`;
      case 'team_deleted':
        return `Deleted team with ID: ${meta.teamId}`;
      case 'employee_assigned_to_team':
        return `Assigned employee to team`;
      case 'employee_removed_from_team':
        return 'Removed employee from team';
      default:
        return action;
    }
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('created')) return 'action-badge action-badge-created';
    if (action.includes('updated')) return 'action-badge action-badge-updated';
    if (action.includes('deleted')) return 'action-badge action-badge-deleted';
    if (action.includes('logged_in') || action.includes('registered')) return 'action-badge action-badge-auth';
    return 'action-badge action-badge-default';
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="logs-page">
      <div className="logs-container">
        <div className="logs-header">
          <h1 className="logs-title">Log Entries</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="table-container">
          <div className="table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th className="table-header">
                    <div className="header-content">
                      <Clock className="header-icon" />
                      Date & Time
                    </div>
                  </th>
                  <th className="table-header">
                    <div className="header-content">
                      <User className="header-icon" />
                      User
                    </div>
                  </th>
                  <th className="table-header">
                    <div className="header-content">
                      <Activity className="header-icon" />
                      Action
                    </div>
                  </th>
                  <th className="table-header">
                    <div className="header-content">
                      <FileText className="header-icon" />
                      Details
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* --- Conditional Rendering inside the tbody --- */}
                {loading ? (
                  <tr>
                    <td colSpan="4" className="loading-state">
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <div className="empty-state-content">
                        <div className="empty-state-icon">
                          <FileText className="empty-icon" />
                        </div>
                        <p className="empty-state-text">No activity logs found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log) => (
                    <tr key={log.id} className="table-row">
                      <td className="table-cell">
                        <div className="cell-text cell-datetime">
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="user-cell">
                          <div className="user-avatar-small">
                            <User className="user-icon-small" />
                          </div>
                          <span className="cell-text">
                            {log.user ? log.user.name : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={getActionBadgeClass(log.action)}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="cell-text cell-details">
                          {getActionDescription(log.action, log.meta)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {/* --- End Conditional Rendering --- */}
              </tbody>
            </table>
          </div>
        </div>

        {logs.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={logs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Logs;
