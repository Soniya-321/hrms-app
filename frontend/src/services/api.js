import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (orgName, adminName, email, password) =>
    api.post('/auth/register', { orgName, adminName, email, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employeeData) => api.post('/employees', employeeData),
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (teamData) => api.post('/teams', teamData),
  update: (id, teamData) => api.put(`/teams/${id}`, teamData),
  delete: (id) => api.delete(`/teams/${id}`),
  assignEmployee: (teamId, employeeId) =>
    api.post('/teams/assign', { teamId, employeeId }),
  removeEmployee: (teamId, employeeId) =>
    api.post('/teams/remove', { teamId, employeeId }),
};

// Log API
export const logAPI = {
  getAll: () => api.get('/logs'),
};

export default api;