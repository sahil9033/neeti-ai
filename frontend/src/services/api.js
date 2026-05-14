import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      auth.signOut();
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export const analyzeConflict = async (description, conflictType, tone) => {
  const { data } = await api.post('/api/conflict/analyze', { description, conflictType, tone });
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/api/conflict/history');
  return data.conflicts || [];
};

export const getConflict = async (id) => {
  const { data } = await api.get(`/api/conflict/${id}`);
  return data.conflict;
};

export const deleteConflict = async (id) => {
  const { data } = await api.delete(`/api/conflict/${id}`);
  return data;
};

export const sendFollowUp = async (id, question, mode) => {
  const { data } = await api.post(`/api/conflict/${id}/followup`, { question, mode });
  return data;
};

export default api;
