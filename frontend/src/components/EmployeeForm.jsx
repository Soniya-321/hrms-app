import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { X } from 'lucide-react';
import '../styles/EmployeeForm.css';

const EmployeeForm = ({ employee, teams, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    teamIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        teamIds: employee.teams ? employee.teams.map((team) => team.id) : [],
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    const teamId = parseInt(value);
    
    if (checked) {
      setFormData({
        ...formData,
        teamIds: [...formData.teamIds, teamId],
      });
    } else {
      setFormData({
        ...formData,
        teamIds: formData.teamIds.filter((id) => id !== teamId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (employee) {
        await employeeAPI.update(employee.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    }
    
    setLoading(false);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-content">
          <div className="form-header">
            <h3 className="form-title">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <button 
              className="form-close-button" 
              onClick={onClose}
              type="button"
            >
              <X className="form-close-icon" />
            </button>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-field">
                <label className="form-label" htmlFor="first_name">
                  First Name
                </label>
                <input
                  className="form-input"
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  className="form-input"
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-input"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="form-input"
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Teams</label>
                <div className="teams-list">
                  {teams.map((team) => (
                    <div key={team.id} className="team-checkbox">
                      <input
                        type="checkbox"
                        id={`team-${team.id}`}
                        value={team.id}
                        checked={formData.teamIds.includes(team.id)}
                        onChange={handleTeamChange}
                        className="checkbox-input"
                      />
                      <label htmlFor={`team-${team.id}`} className="checkbox-label">
                        {team.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-button form-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`form-button form-submit ${loading ? 'form-button-loading' : ''}`}
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

export default EmployeeForm;