import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const verProducto = async () => {
    try {
      const response = await axios.get(`${API_URL}/ver_productos`);
      return response.data; // Retorna la lista de productos
    } catch (error) {
      console.error("Error al obtener productos", error);
      throw error;
    }
  };
