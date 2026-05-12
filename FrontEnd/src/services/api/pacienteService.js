import apiClient from '../../config/api';

export const pacienteService = {
  listPacientes: async () => {
    try {
      const response = await apiClient.get('/paciente/list');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al obtener pacientes';
    }
  },

  createPaciente: async (paciente) => {
    try {
      const response = await apiClient.post('/paciente/create', paciente);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al crear paciente';
    }
  },
};
