import React, { useState, useEffect } from 'react';
import { teamAPI, employeeAPI } from '../services/api';
import TeamForm from '../components/TeamForm';
import ActionMenu from '../components/ActionMenu';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Pagination from '../components/Pagination';
import { Plus, UsersRound } from 'lucide-react';
import '../styles/Team.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch teams');
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDeleteClick = (team) => {
    setDeletingTeam(team);
  };

  const handleDeleteConfirm = async () => {
    try {
      await teamAPI.delete(deletingTeam.id);
      fetchTeams();
      setDeletingTeam(null);
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleFormSubmit = () => {
    fetchTeams();
    setShowForm(false);
    setEditingTeam(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination
  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = teams.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="teams-page">
      <div className="teams-container">
        <div className="teams-header">
          <h1 className="teams-title">Teams</h1>
          <button onClick={handleAddTeam} className="add-team-button">
            <Plus className="button-icon" />
            Add Team
          </button>
        </div>

        {showForm && (
          <TeamForm
            team={editingTeam}
            employees={employees}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}

        {deletingTeam && (
            <DeleteConfirmationModal
                item={deletingTeam}
                itemType="team"
                onClose={() => setDeletingTeam(null)}
                onConfirm={handleDeleteConfirm}
            />
        )}

        {/* Error message display remains here */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="table-container">
          <div className="table-wrapper">
            <table className="teams-table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Members</th>
                  <th className="table-header table-header-right">Actions</th>
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
                ) : currentTeams.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <div className="empty-state-content">
                        <div className="empty-state-icon">
                          <UsersRound className="empty-icon" />
                        </div>
                        <p className="empty-state-text">No teams found. Add your first team!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTeams.map((team) => (
                    <tr key={team.id} className="table-row">
                      <td className="table-cell">
                        <div className="team-name">{team.name}</div>
                      </td>
                      <td className="table-cell">
                        <div className="cell-text">{team.description}</div>
                      </td>
                      <td className="table-cell">
                        <div className="members-container">
                          {team.employees && team.employees.length > 0 ? (
                            team.employees.map((emp, index) => (
                              <span key={emp.id} className="member-badge">
                                {emp.first_name} {emp.last_name}
                              </span>
                            ))
                          ) : (
                            <span className="no-members">No members</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell table-cell-actions">
                        <div className="actions-wrapper">
                          <ActionMenu
                            employee={team}
                            onEdit={handleEditTeam}
                            onDelete={handleDeleteClick}
                          />
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

        {/* Pagination only shows if there are items */}
        {teams.length > 0 && !loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={teams.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
};

export default Teams;
