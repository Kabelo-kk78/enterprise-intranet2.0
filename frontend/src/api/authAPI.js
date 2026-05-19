// frontend/src/api/authAPI.js
import axios from './axiosConfig';

export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password }),
  register: (userData) => axios.post('/auth/register', userData),
  getMe: () => axios.get('/auth/me'),
  changePassword: (oldPassword, newPassword) => 
    axios.post('/auth/change-password', { oldPassword, newPassword }),
};