import apiClient from '../../config/api';

export const procedimientoService = {
  changeProcedimientoState: async (procedimientoId, nuevoEstado) => {
    try {
      const response = await apiClient.put(
        `/procedimiento/cambiar-estado/${procedimientoId}/${nuevoEstado}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Error al cambiar estado del procedimiento';
    }
  },

  ListNameProcedimiento: async () => {
    try{
      const response = await apiClient.get(
        `/procedimiento/list`
      );
      return response.data;
    } catch(error){
      throw error.response?.data?.detail || "Error al traer los nombres de procedimientos";
    }
  },
};
