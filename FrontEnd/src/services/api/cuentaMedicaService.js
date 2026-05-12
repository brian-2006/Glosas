import apiClient from '../../config/api';

export const cuentaMedicaService = {
  createCuentaMedica: async (data) => {
    try {
      const response = await apiClient.post('/cuenta-medica/crear-cuenta-medica', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al crear cuenta médica';
    }
  },

  listCuentasMedicas: async () => {
    try {
      const response = await apiClient.get('/cuenta-medica/list');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener cuentas médicas';
    }
  },

  getCuentasMedicasByAseguradora: async (aseguradoraId) => {
    try {
      const response = await apiClient.get(`/cuenta-medica/by-aseguradora/${aseguradoraId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener cuentas médicas';
    }
  },
};
