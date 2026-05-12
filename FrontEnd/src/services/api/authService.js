import apiClient from '../../config/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, ...user };
    } catch (error) {
      throw error.response?.data?.detail || 'Error en autenticación';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('token'),

  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/auth/create-user', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al crear usuario';
    }
  },
};
