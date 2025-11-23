import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';
import { X } from 'lucide-react';
import '../styles/TeamForm.css';

const TeamForm = ({ team, employees, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    employeeIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        employeeIds: team.employees ? team.employees.map((emp) => emp.id) : [],
      });
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmployeeChange = (e) => {
    const { value, checked } = e.target;
    const employeeId = parseInt(value);
    
    if (checked) {
      setFormData({
        ...formData,
        employeeIds: [...formData.employeeIds, employeeId],
      });
    } else {
      setFormData({
        ...formData,
        employeeIds: formData.employeeIds.filter((id) => id !== employeeId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (team) {
        await teamAPI.update(team.id, formData);
      } else {
        await teamAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team');
    }
    
    setLoading(false);
  };

  return (
    <div className="team-form-overlay">
      <div className="team-form-modal">
        <div className="team-form-content">
          <div className="team-form-header">
            <h3 className="team-form-title">
              {team ? 'Edit Team' : 'Add New Team'}
            </h3>
            <button 
              className="team-form-close-button" 
              onClick={onClose}
              type="button"
            >
              <X className="team-form-close-icon" />
            </button>
          </div>

          {error && (
            <div className="team-form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="team-form-fields">
              <div className="team-form-field">
                <label className="team-form-label" htmlFor="name">
                  Team Name
                </label>
                <input
                  className="team-form-input"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="team-form-field">
                <label className="team-form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="team-form-textarea"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="team-form-field">
                <label className="team-form-label">Team Members</label>
                <div className="team-members-list">
                  {employees.map((employee) => (
                    <div key={employee.id} className="team-member-checkbox">
                      <input
                        type="checkbox"
                        id={`emp-${employee.id}`}
                        value={employee.id}
                        checked={formData.employeeIds.includes(employee.id)}
                        onChange={handleEmployeeChange}
                        className="team-checkbox-input"
                      />
                      <label htmlFor={`emp-${employee.id}`} className="team-checkbox-label">
                        {`${employee.first_name} ${employee.last_name}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="team-form-actions">
              <button
                type="button"
                className="team-form-button team-form-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`team-form-button team-form-submit ${loading ? 'team-form-button-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamForm;