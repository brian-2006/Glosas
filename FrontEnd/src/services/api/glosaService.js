import apiClient from '../../config/api';

export const glosaService = {
  getGlosas: async () => {
    try {
      const response = await apiClient.get('/glosa/list');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener glosas';
    }
  },
};
