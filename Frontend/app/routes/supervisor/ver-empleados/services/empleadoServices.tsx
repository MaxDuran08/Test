import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerEmpleados = async () => {
    try {
      const response = await axios.get(`${API_URL}/empleados`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener empleados", error);
      throw error;
    }
  };