import apiClient from '../../config/api';

export const aseguradoraService = {
  listAseguradoras: async () => {
    try {
      const response = await apiClient.get('/aseguradora/aseguradoras');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener aseguradoras';
    }
  },

  createAseguradora: async (nombre) => {
    try {
      const response = await apiClient.post('/aseguradora/crear-aseguradora', { nombre });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al crear aseguradora';
    }
  },
};
