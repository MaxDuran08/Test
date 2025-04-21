import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const verOpiniones = async () => {
  try {
    const response = await axios.get(`${API_URL}/opiniones`);
    return response.data; // Retorna la lista de productos
  } catch (error) {
    console.error("Error al obtener  opiniones", error);
    throw error;
  }
};
