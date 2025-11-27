import React, { useState, useEffect } from 'react';
import { employeeAPI, teamAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import ActionMenu from '../components/ActionMenu';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';
import { Plus, Users, AlertTriangle } from 'lucide-react'; // Added AlertTriangle icon
import '../styles/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteClick = (employee) => {
    setDeletingEmployee(employee);
  };

  const handleDeleteConfirm = async () => {
    try {
      await employeeAPI.delete(deletingEmployee.id);
      fetchEmployees();
      setDeletingEmployee(null);
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = () => {
    fetchEmployees();
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  // Determine the content to display inside the table body
  const renderTableBodyContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="loading-state">
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
        return (
            <tr>
              <td colSpan="5" className="error-state">
                <div className="empty-state-content">
                    <div className="empty-state-icon error-icon-wrapper">
                        <AlertTriangle className="empty-icon" />
                    </div>
                    <p className="empty-state-text">{error}</p>
                    <button onClick={fetchEmployees} className="retry-button">Try Again</button>
                </div>
              </td>
            </tr>
          );
    }

    if (currentEmployees.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <Users className="empty-icon" />
              </div>
              <p className="empty-state-text">No employees found. Add your first employee!</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentEmployees.map((employee) => (
      <tr key={employee.id} className="table-row">
        <td className="table-cell">
          <div className="employee-name">
            {employee.first_name} {employee.last_name}
          </div>
        </td>
        <td className="table-cell">
          <div className="cell-text">{employee.email}</div>
        </td>
        <td className="table-cell">
          <div className="cell-text">{employee.phone}</div>
        </td>
        <td className="table-cell">
          <div className="teams-container">
            {employee.teams && employee.teams.length > 0 ? (
              employee.teams.map((team) => (
                <span key={team.id} className="team-badge">
                  {team.name}
                </span>
              ))
            ) : (
              <span className="no-teams">No teams assigned</span>
            )}
          </div>
        </td>
        <td className="table-cell table-cell-actions">
          <div className="actions-wrapper">
            <ActionMenu
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteClick}
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="employees-page">
      <div className="employees-container">
        <div className="employees-header">
          <h1 className="employees-title">Employees</h1>
          <button onClick={handleAddEmployee} className="add-employee-button">
            <Plus className="button-icon" />
            Add Employee
          </button>
        </div>

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            teams={teams}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}

        {deletingEmployee && (
            <DeleteConfirmationModal
                item={deletingEmployee}
                itemType="employee"
                onClose={() => setDeletingEmployee(null)}
                onConfirm={handleDeleteConfirm}
            />
        )}

        {/* Removed the top-level error display as it is now in the table body */}
        
        <div className="table-container">
          <div className="table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Teams</th>
                  <th className="table-header table-header-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {renderTableBodyContent()}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination only shows if there are items and not loading/errored */}
        {employees.length > 0 && !loading && !error && (
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={employees.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            />
        )}
      </div>
    </div>
  );
};

export default Employees;
