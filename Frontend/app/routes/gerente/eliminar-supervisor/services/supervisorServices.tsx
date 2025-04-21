import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para eliminar un supervisor
export const eliminarSupervisor = async (supervisorData: { CUI: number, Causa: string }) => {
    try {
      const response = await axios.post(`${API_URL}/eliminar_usuario`, {
        data: supervisorData,
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar supervisor", error);
      throw error;
    }
  };
