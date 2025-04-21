import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para agregar un libro
export const agregarLibro = async (libroData: { 
  titulo: string, 
  autor: string, 
  fecha_lanzamiento: string, 
  descripcion: string, 
  genero: string, 
  stock: number, 
  precio: number 
}) => {
  try {
    const response = await axios.post(`${API_URL}/agregar_libro`, libroData);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al agregar libro", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};
