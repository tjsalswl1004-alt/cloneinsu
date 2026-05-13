import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_URL });

export const claimService = {
  getAll: (status) =>
    api.get('/claims', { params: status ? { status } : {} }).then((r) => r.data),

  getById: (id) =>
    api.get(`/claims/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/claims', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/claims/${id}`, data).then((r) => r.data),

  remove: (id) =>
    api.delete(`/claims/${id}`),

  getStats: () =>
    api.get('/claims/stats').then((r) => r.data),
};

export const insuranceCompanyService = {
  getAll: () =>
    api.get('/insurance-companies').then((r) => r.data),

  getByCategory: (category) =>
    api.get('/insurance-companies', { params: { category } }).then((r) => r.data),
};
