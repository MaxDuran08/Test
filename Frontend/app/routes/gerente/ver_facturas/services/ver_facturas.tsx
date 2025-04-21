import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const ver_Facturas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ver_facturas`);
    return response.data; // Retorna la lista de productos
  } catch (error) {
    console.error("Error al obtener las facturas", error);
    throw error;
  }
};
