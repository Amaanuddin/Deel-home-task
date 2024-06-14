import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3010',
  headers: {
    'Content-Type': 'application/json',
    'profile_id': 1 // Default to client user for demonstration
  }
});

export const getContracts = () => api.get('/contracts');
export const getContractById = (id) => api.get(`/contracts/${id}`);
export const getUnpaidJobs = () => api.get('/jobs/unpaid');
export const payJob = (jobId) => api.post(`/jobs/${jobId}/pay`);
export const depositBalance = (userId, amount) => api.post(`/balances/deposit/${userId}`, { amount });
export const getBestProfession = (start, end) => api.get(`/admin/best-profession?start=${start}&end=${end}`);
export const getBestClients = (start, end, limit = 2) => api.get(`/admin/best-clients?start=${start}&end=${end}&limit=${limit}`);
