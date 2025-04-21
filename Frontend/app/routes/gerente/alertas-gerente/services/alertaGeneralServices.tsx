import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener el stock de productos
export const obtenerStockProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/alerta_general`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el stock de productos", error);
    throw error;
  }
};